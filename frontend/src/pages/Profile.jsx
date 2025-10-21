import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiHeart, FiUser, FiHome } from "react-icons/fi";
import "../styles/Profile.css";

const mockItems = [
  { title: "Vintage Camera", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" },
  { title: "Leather Jacket", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" },
  { title: "Board Game", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
  { title: "Cookbook", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" },
];

const tabs = ["My Items", "Favorites", "Reviews", "Settings"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  function ItemCard({ item }) {
    return (
      <Link key={item.title} className="product-card" to={"/product/" + (item.slug || item.id)}>
        <img
          src={item.img || "/placeholder.png"}
          alt={item.title || "Item"}
          onError={e => (e.currentTarget.src = "/placeholder.png")}
        />
        <div className="item-title">{item.title}</div>
      </Link>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="icon-btn" aria-label="Voltar" onClick={() => navigate(-1)}>
          <FiArrowLeft size={22} />
        </button>
        <h2>Profile</h2>
      </header>
      <div className="profile-avatar">
        <div className="avatar-img" />
      </div>
      <h3 className="profile-name">Maria Silva</h3>
      <div className="profile-joined">Joined in March 2024</div>
      <div className="profile-summary">
        12 Completed Donations · 25 Reviews
      </div>
      <nav className="profile-tabs">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`tab${activeTab === idx ? " active" : ""}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="profile-items-section">
        {activeTab === 0 && (
          <div className="products-grid">
            {mockItems.map((item) => (
              <ItemCard item={item} key={item.title} />
            ))}
          </div>
        )}
        {activeTab !== 0 && (
          <div className="empty-tab">Content for "{tabs[activeTab]}" tab</div>
        )}
      </section>
      <nav className="bottom-nav">
        <Link to="/" className="nav-link"><FiHome size={20} /><span>Home</span></Link>
        <Link to="/search" className="nav-link"><FiSearch size={20} /><span>Search</span></Link>
        <Link to="/favorites" className="nav-link"><FiHeart size={20} /><span>Favorites</span></Link>
        <Link to="/profile" className="nav-link active"><FiUser size={20} /><span>Profile</span></Link>
      </nav>
    </div>
  );
}
