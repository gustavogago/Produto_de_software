import "../styles/Home.css";
import { FiSearch, FiHeart, FiUser, FiHome, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

const BASE = "http://localhost:8000"; // para completar imagem relativa

function fullUrl(u) {
  if (!u) return "";
  if (u.startsWith("http")) return u;
  if (u.startsWith("/")) return `${BASE}${u}`;
  return `${BASE}/${u}`;
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/items/");
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (mounted) setItems(list);
      } catch (e) {
        console.error("home fetch", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/categories/");
        const list = Array.isArray(data) ? data : (data?.results || []);
        if (mounted) setCategories(list);
      } catch (e) {
        console.error("categories fetch", e);
      }
    })();
    return () => (mounted = false);
  }, []);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="logo">Give.me</h1>
        <FiShoppingCart className="icon" size={22} />
      </header>

      <div className="search-container">
        <FiSearch className="search-icon" size={18} />
        <input type="text" placeholder="What are you looking for?" />
      </div>

      <section className="highlight">
        <img
          src="https://copilot.microsoft.com/th/id/BCO.f758662b-2439-4b83-bb36-276835cae548.png"
          alt="Top donation"
        />
        <div className="highlight-info">
          <h2>TOP Donations</h2>
          <Link to="/create-item">
            <button>I WANT IT</button>
          </Link>
        </div>
      </section>

      <section className="categories">
        <h2>Categories</h2>
        <div className="chips">
          <button
            className={`chip ${selectedCategory === null ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`chip ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="products">
        {loading && <div>Loading...</div>}
        {!loading && filteredItems.length === 0 && <div>Sem anúncios ainda.</div>}

        {!loading &&
          filteredItems.map((it) => {
            const cover = fullUrl(it.images?.[0]);
            const slugOrId = it.slug || it.id;
            return (
              <Link key={it.id} className="product-card" to={`/product/${slugOrId}`}>
                <img
                  src={cover || "/placeholder.png"}
                  alt={it.title || "Item"}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              </Link>
            );
          })}
      </section>

      <nav className="bottom-nav">
        <Link to="/" className="active"><FiHome size={20} /><span>Home</span></Link>
        <Link to="/search"><FiSearch size={20} /><span>Search</span></Link>
        <Link to="/favorites"><FiHeart size={20} /><span>Favorites</span></Link>
        <Link to="/profile"><FiUser size={20} /><span>Profile</span></Link>
      </nav>
    </div>
  );
}
