import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiHeart, FiUser, FiHome, FiShoppingCart } from "react-icons/fi";

// Constante base para URLs de imagens
export const BASE_URL = "http://localhost:8000";

// Função utilitária para construir URLs completas
export function fullUrl(u) {
  if (!u) return "";
  if (u.startsWith("http")) return u;
  if (u.startsWith("/")) return `${BASE_URL}${u}`;
  return `${BASE_URL}/${u}`;
}

// Componente de navegação inferior (Bottom Nav)
export function BottomNav({ activePage = "home" }) {
  return (
    <nav className="bottom-nav">
      <Link to="/" className={activePage === "home" ? "nav-link active" : "nav-link"}>
        <FiHome size={20} />
        <span>Home</span>
      </Link>
      <Link to="/search" className={activePage === "search" ? "nav-link active" : "nav-link"}>
        <FiSearch size={20} />
        <span>Search</span>
      </Link>
      <Link to="/favorites" className={activePage === "favorites" ? "nav-link active" : "nav-link"}>
        <FiHeart size={20} />
        <span>Favorites</span>
      </Link>
      <Link to="/profile" className={activePage === "profile" ? "nav-link active" : "nav-link"}>
        <FiUser size={20} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

// Componente de Header com botão de voltar
export function BackHeader({ title, rightElement, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="back-header">
      <button 
        className="icon-btn" 
        aria-label="Voltar" 
        onClick={handleBack}
      >
        <FiArrowLeft size={22} />
      </button>
      {title && <h2>{title}</h2>}
      {rightElement && <div className="header-right">{rightElement}</div>}
    </header>
  );
}

// Componente de Header principal (usado na Home)
export function MainHeader({ onAddClick }) {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      navigate("/create-item");
    }
  };

  return (
    <header className="home-header">
      <h1 className="logo">Give.me</h1>
      <div className="header-actions">
        <button 
          onClick={handleAddClick}
          className="add-btn" 
          aria-label="Cadastrar produto"
        >
          <span className="plus-icon">+</span>
        </button>
        <FiShoppingCart className="icon" size={22} />
      </div>
    </header>
  );
}

// Componente de busca (usado na Home)
export function SearchBar({ placeholder = "What are you looking for?", onSearch }) {
  return (
    <div className="search-container">
      <FiSearch className="search-icon" size={18} />
      <input 
        type="text" 
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    </div>
  );
}

// Estilos comuns para inputs
export const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  color: "var(--text-dark)",
  outline: "none",
};

// Estilos comuns para labels
export const labelStyle = {
  display: "block",
  fontSize: 12,
  color: "var(--text-light)",
  marginBottom: 6,
};

// Estilos comuns para botões
export const buttonStyle = {
  border: "1px solid #ddd",
  background: "#fff",
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
  color: "#333",
};

// Estilos para botão primário
export const primaryButtonStyle = {
  ...buttonStyle,
  background: "var(--main-green)",
  color: "#fff",
  border: "none",
  fontWeight: 600,
};

// Componente de container de loading
export function LoadingContainer({ message = "Carregando..." }) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      padding: 24,
      minHeight: "200px"
    }}>
      <div>{message}</div>
    </div>
  );
}

// Componente de mensagem vazia
export function EmptyState({ message = "Nenhum item encontrado" }) {
  return (
    <div style={{ 
      textAlign: "center", 
      padding: 40,
      color: "var(--text-light)"
    }}>
      <div>{message}</div>
    </div>
  );
}
