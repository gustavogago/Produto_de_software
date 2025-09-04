import os
import sys

# adiciona a pasta "backend" (que contém manage.py e o pacote inner "backend")
REPO_ROOT = os.path.dirname(__file__)
BACKEND_DIR = os.path.join(REPO_ROOT, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Se quiser, force o DJANGO_SETTINGS_MODULE aqui:
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
