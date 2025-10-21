import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { FiArrowLeft, FiStar, FiShield, FiPackage, FiMapPin, FiTag, FiMessageCircle } from "react-icons/fi";
import "../styles/Detail.css";

const BASE = "http://localhost:8000";
const fullUrl = (u) => (!u ? "" : u.startsWith("http") ? u : u.startsWith("/") ? `${BASE}${u}` : `${BASE}/${u}`);

export default function ProductDetail() {
  const { slug } = useParams(); // pode ser slug ou id
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = useMemo(() => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded?.user_id || decoded?.sub || decoded?.id || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(`/items/${slug}/`);
        if (mounted) setItem(res.data);
      } catch (e) {
        console.error("Erro ao buscar item:", e);
        console.error("Detalhes:", e.response?.data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [slug]);

  const isOwner = useMemo(() => {
    if (!item || !currentUserId) return false;
    const ownerId = item.owner_id || item.user_id || item.seller_id || item?.owner?.id || item?.seller?.id;
    return ownerId && String(ownerId) === String(currentUserId);
  }, [item, currentUserId]);

  if (loading) {
    return (
      <main className="detail-page">
        <div className="detail-card">Carregando...</div>
      </main>
    );
  }
  if (!item) {
    return (
      <main className="detail-page">
        <div className="detail-card">
          <h2>Item não encontrado</h2>
          <button className="btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Voltar
          </button>
        </div>
      </main>
    );
  }

  const typeLabel =
    item.type === "Sell" ? "Available for Sale" :
    item.type === "Donation" ? "Available for Donation" : "Available for Trade";

  const cover = fullUrl(item.images?.[0]);

  return (
    <main className="detail-page">
      <article className="detail-card">
        <header className="detail-topbar">
          <button className="icon-btn" aria-label="Voltar" onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} />
          </button>
          {isOwner && <Link to={`/edit-item/${item.id}`} className="link-edit">Editar</Link>}
        </header>

        {cover && (
          <div className="detail-hero">
            <img src={cover} alt={item.title} />
          </div>
        )}

        <div className="detail-type">{typeLabel}</div>
        <h1 className="detail-title">{item.title}</h1>
        {item.description && <p className="detail-desc">{item.description}</p>}

        <div className="detail-badges">
          <div className="badge"><FiTag /><span>{item.category || "—"}</span></div>
          <div className="badge"><FiMapPin /><span>{item.location || "—"}</span></div>
          {item.type === "Sell" && (
            <div className="badge"><FiTag /><span>{item.price ? `R$ ${item.price}` : "Preço a combinar"}</span></div>
          )}
        </div>

        <ul className="detail-specs">
          <li className="spec-row">
            <div className="spec-left"><FiPackage /><span>Item Condition</span></div>
            <div className="spec-right">
              {item.condition || "—"}
              {item.rating && <span className="spec-rating"><FiStar /> {Number(item.rating).toFixed(1)}</span>}
            </div>
          </li>
          <li className="spec-row">
            <div className="spec-left"><FiShield /><span>Donor Reputation</span></div>
            <div className="spec-right">{item.reputation || "94% (117 reviews)"}</div>
          </li>
        </ul>

        <footer className="detail-actions">
          <button className="btn btn-primary">
            {item.type === "Sell" ? "Buy" : item.type === "Donation" ? "Request" : "Propose Trade"}
          </button>
          <button className="btn btn-ghost"><FiMessageCircle /> Chat</button>
        </footer>
      </article>

      <nav className="detail-bottom-nav">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </main>
  );
}
