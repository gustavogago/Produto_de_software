import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ListItem() {
  const navigate = useNavigate();

  // Estados para os campos do formulário
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  
  // NOTA: Estes campos são coletados no frontend mas não enviados ao backend atual
  // O modelo Item do backend não tem campos para: type, location, price, photos
  // Eles precisariam ser adicionados ao modelo ou tratados em modelos relacionados
  const [type, setType] = useState("sell");           // "sell" | "donation" | "trade" (não usado no backend)
  const [condition, setCondition] = useState("new");  // "new" | "used-good" | "needs-repair" (mapeado para status)
  const [location, setLocation] = useState("");       // (não usado no backend - usar city)
  const [price, setPrice] = useState("");             // (não usado no backend - modelo não tem campo price)
  const [files, setFiles] = useState([]);             // (não usado no backend - modelo ItemPhoto existe mas não está implementado)
  
  const [submitting, setSubmitting] = useState(false);
  const dropRef = useRef(null);

  // Carregar categorias ao montar
  useEffect(() => {
    fetch("http://localhost:8000/categories/")
      .then(res => res.json())
      .then(data => {
        console.log("Categorias carregadas:", data);
        setCategories(data);
      })
      .catch(err => {
        console.error("Erro ao carregar categorias:", err);
      });
  }, []);

  function onFilesSelected(list) {
    if (!list) return;
    const arr = Array.from(list).slice(0, 6 - files.length);
    setFiles((prev) => [...prev, ...arr]);
  }
  function removeFile(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }
  function onDrop(e) {
    e.preventDefault();
    dropRef.current?.classList.remove("ring");
    onFilesSelected(e.dataTransfer.files);
  }
  function onDragOver(e) {
    e.preventDefault();
    dropRef.current?.classList.add("ring");
  }
  function onDragLeave() {
    dropRef.current?.classList.remove("ring");
  }

  function validate() {
    if (!title.trim()) return "Título é obrigatório.";
    if (type === "sell" && (!price || Number.isNaN(Number(price)))) return "Preço inválido.";
    return null;
  }

  const mapType = (t) => (t === "sell" ? "Sell" : t === "donation" ? "Donation" : "Trade");
  const mapCondition = (c) =>
    c === "new" ? "New" : c === "used-good" ? "Used - Good Condition" : "Needs Repair";

  async function onSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    try {
      setSubmitting(true);
      
      // Buscar ID da categoria pelo nome
      const categoryObj = categories.find(c => 
        c.name.toLowerCase() === category.toLowerCase()
      );

      if (!categoryObj) {
        alert("Categoria inválida. Escolha: " + categories.map(c => c.name).join(", "));
        setSubmitting(false);
        return;
      }

      const mapConditionToStatus = (frontendCondition) => {
        if (frontendCondition === "new") return "new";
        return "used";
      };

      // First upload photos if any
      let photoUrls = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`photo_${index}`, file);
        });
        try {
          const photoRes = await api.post('/upload-photos/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          photoUrls = photoRes.data.urls;
        } catch (err) {
          console.error('Error uploading photos:', err);
        }
      }

      const payload = {
        title: title,
        description: desc,
        category: categoryObj.id,
        city: location,  // Assuming we have a city ID from a dropdown
        status: mapConditionToStatus(condition),
        listing_state: "active",
        photos: photoUrls
      };

      const { data } = await api.post("items/create/", payload);

      alert("Item publicado com sucesso!");
      console.log("Item criado:", data);
      
      const itemId = data.id;
      navigate(`/product/${itemId}`);
    } catch (e) {
      console.error("Erro ao criar item:", e);
      const status = e?.response?.status;
      const errorData = e?.response?.data;
      
      let errorMsg = "Erro ao publicar item.\n";
      if (status) errorMsg += `Status: ${status}\n`;
      if (errorData) {
        errorMsg += `Detalhes: ${JSON.stringify(errorData, null, 2)}`;
      } else {
        errorMsg += e.message;
      }
      
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 960,
          background: "var(--container-bg)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,.06)",
        }}
        aria-labelledby="li-title"
      >
        <header style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => history.back()}
            style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: 20 }}
          >
            ←
          </button>
          <h1 id="li-title" style={{ margin: 0, fontSize: 24, color: "var(--text-dark)" }}>
            List Item
          </h1>
        </header>

        {/* Photos */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, margin: "0 0 8px", color: "var(--text-dark)" }}>Photos</h2>
          <div
            ref={dropRef}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            style={{
              background: "#eaf7ef",
              border: "1px dashed #b6e7c6",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
            }}
          >
            <input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => onFilesSelected(e.target.files)}
            />
            <label htmlFor="photos" style={{ cursor: "pointer", display: "block" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
              <span style={{ color: "var(--text-regular)" }}>
                Arraste imagens aqui ou <u>clique para enviar</u> (até 6)
              </span>
            </label>
          </div>

          {files.length > 0 && (
            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 12,
                marginTop: 12,
                listStyle: "none",
                padding: 0,
              }}
            >
              {files.map((f, i) => {
                const url = URL.createObjectURL(f);
                return (
                  <li key={i} style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt={f.name}
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "1px solid #eee",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        border: 0,
                        background: "#fff",
                        borderRadius: 999,
                        padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Item Information */}
        <section>
          <h2 style={{ fontSize: 14, margin: "0 0 12px", color: "var(--text-dark)" }}>Item Information</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <input
                placeholder="Item Title (Ex: Used Cell Phone, Children's Clothing)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <textarea
                rows={4}
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input
                placeholder="Ex: Electronics"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="categories-list"
                style={inputStyle}
              />
              <datalist id="categories-list">
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input
                placeholder="City, State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Listing Type */}
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Listing Type</label>
            <Segmented
              value={type}
              onChange={setType}
              options={[
                { value: "sell", label: "Sell" },
                { value: "donation", label: "Donation" },
                { value: "trade", label: "Trade" },
              ]}
            />
          </div>

          {type === "sell" && (
            <div style={{ marginTop: 12, maxWidth: 280 }}>
              <label style={labelStyle}>Price</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...inputStyle, width: 56, textAlign: "center" }}>R$</span>
                <input
                  inputMode="decimal"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>
          )}

          {/* Condition */}
          <div style={{ marginTop: 20 }}>
            <label style={labelStyle}>Condition</label>
            <Chips
              value={condition}
              onChange={setCondition}
              options={[
                { value: "new", label: "New" },
                { value: "used-good", label: "Used - Good Condition" },
                { value: "needs-repair", label: "Needs Repair" },
              ]}
            />
          </div>
        </section>

        <footer style={{ marginTop: 24 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "var(--main-green)",
              color: "#fff",
              border: 0,
              borderRadius: 12,
              padding: "12px 20px",
              fontWeight: 600,
              cursor: "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Publicando..." : "Publish Item"}
          </button>
        </footer>
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  color: "var(--text-dark)",
  outline: "none",
};
const labelStyle = { display: "block", fontSize: 12, color: "var(--text-light)", marginBottom: 6 };

function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", background: "#fff", border: "1px solid #ddd", borderRadius: 12, padding: 4 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: active ? "var(--main-green)" : "transparent",
              color: active ? "#fff" : "var(--text-dark)",
              fontWeight: 500,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Chips({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: active ? "1px solid transparent" : "1px solid #ddd",
              background: active ? "#eaf7ef" : "#fff",
              color: active ? "var(--main-green)" : "var(--text-dark)",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
