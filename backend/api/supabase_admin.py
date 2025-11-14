import json
import logging
import os
from typing import Optional

import requests

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


class SupabaseAdminError(Exception):
    pass


def _get_headers():
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise SupabaseAdminError(
            "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados no ambiente."
        )
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }


def _extract_user_id_from_response(data: dict) -> Optional[str]:
    # A API pode devolver {"id": "..."} ou {"user": {"id": "..."}}
    if isinstance(data, dict):
        if "id" in data and isinstance(data["id"], str):
            return data["id"]
        if "user" in data and isinstance(data["user"], dict):
            uid = data["user"].get("id")
            if isinstance(uid, str):
                return uid
    return None


def get_supabase_user_by_email(email: str) -> Optional[str]:
    """
    Tenta achar um usuário existente no Supabase Auth pelo e-mail.
    Retorna o id (UUID) ou None.
    """
    headers = _get_headers()
    url = f"{SUPABASE_URL}/auth/v1/admin/users"

    # A sintaxe ?email=eq.algo@algo.com é a que o Supabase usa na Admin API
    params = {"email": f"eq.{email}"}

    resp = requests.get(url, headers=headers, params=params, timeout=10)
    if resp.status_code != 200:
        logger.warning(
            "Falha ao buscar usuário Supabase por email (%s): %s %s",
            email,
            resp.status_code,
            resp.text,
        )
        return None

    try:
        data = resp.json()
    except json.JSONDecodeError:
        logger.warning("Resposta JSON inválida da Admin API Supabase: %r", resp.text)
        return None

    # Alguns formatos possíveis:
    # 1) Lista de usuários: [ {...}, {...} ]
    # 2) Objeto: {"users": [ {...}, ... ]}
    if isinstance(data, list) and data:
        return _extract_user_id_from_response(data[0])

    if isinstance(data, dict) and "users" in data and data["users"]:
        return _extract_user_id_from_response(data["users"][0])

    return None


def create_supabase_user(email: str, password: str) -> str:
    """
    Cria um usuário novo no Supabase Auth (Admin API).
    Retorna o id (UUID) do usuário criado ou levanta SupabaseAdminError.
    """
    headers = _get_headers()
    url = f"{SUPABASE_URL}/auth/v1/admin/users"

    payload = {
        "email": email,
        "password": password,

        "email_confirm": True,
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=10)

    if resp.status_code not in (200, 201):
        raise SupabaseAdminError(
            f"Erro ao criar usuário Supabase ({resp.status_code}): {resp.text}"
        )

    try:
        data = resp.json()
    except json.JSONDecodeError:
        raise SupabaseAdminError(
            f"Resposta inválida da Admin API ao criar usuário: {resp.text}"
        )

    uid = _extract_user_id_from_response(data)
    if not uid:
        raise SupabaseAdminError(
            f"Não foi possível extrair o ID de usuário Supabase da resposta: {data}"
        )

    return uid


def get_or_create_supabase_user(email: str, password: str) -> str:
    """
    Se já existir usuário com esse e-mail no Auth, reaproveita o ID.
    Senão, cria um novo.
    """
    existing_id = get_supabase_user_by_email(email)
    if existing_id:
        return existing_id

    return create_supabase_user(email, password)
