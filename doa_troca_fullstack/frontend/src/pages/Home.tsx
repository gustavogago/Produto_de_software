import React, { useEffect, useState } from "react"
import { useAuth } from "../auth"
import { useNavigate } from "react-router-dom"

type Category = { id:number; name:string }
type Item = {
  id:number; title:string; description?:string; is_donation:boolean;
  condition:string; category_id:number|null; created_at:string
}

const api = {
  async categories() { const r = await fetch("/api/categories"); return r.json() },
  async listItems(params: Record<string, any> = {}) {
    const qs = new URLSearchParams(params as any).toString()
    const r = await fetch("/api/items" + (qs ? `?${qs}` : "")); return r.json()
  },
  async createItem(token:string, payload:any) {
    const r = await fetch("/api/items", {
      method:"POST",
      headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    if(!r.ok) throw new Error("Erro ao criar item"); return r.json()
  }
}

export default function Home(){
  const { user, token, logout } = useAuth()
  const nav = useNavigate()
  const [cats, setCats] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isDonation, setIsDonation] = useState(true)
  const [condition, setCondition] = useState<'new'|'used'|'refurb'>('used')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [q, setQ] = useState("")

  useEffect(()=>{
    if(!token){ nav("/login"); return }
    api.categories().then(setCats)
    api.listItems().then(setItems)
  }, [token])

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!token) return
    const it = await api.createItem(token, {
      title, description, is_donation: isDonation, condition,
      category_id: categoryId === '' ? null : Number(categoryId)
    })
    setItems([it, ...items])
    setTitle(""); setDescription(""); setIsDonation(true); setCondition("used"); setCategoryId("")
  }

  async function handleSearch(){
    const list = await api.listItems({ q })
    setItems(list)
  }

  return (
    <div style={{maxWidth:1000, margin:"24px auto", padding:"0 16px", fontFamily:"Inter, system-ui"}}>
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <h2>Bem-vindo, {user?.name || user?.email}</h2>
        <button onClick={()=>{ logout(); nav("/login") }}>Sair</button>
      </header>

      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div style={{border:'1px solid #ddd', borderRadius:12, padding:16}}>
          <h3>Novo item</h3>
          <form onSubmit={handleCreate}>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" style={{width:"100%",padding:8,marginBottom:8}}/>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descrição" rows={3} style={{width:"100%",padding:8,marginBottom:8}}/>
            <div style={{display:'flex', gap:8, marginBottom:8}}>
              <select value={condition} onChange={e=>setCondition(e.target.value as any)} style={{flex:1,padding:8}}>
                <option value="new">Novo</option><option value="used">Usado</option><option value="refurb">Recondicionado</option>
              </select>
              <select value={categoryId} onChange={e=>setCategoryId(e.target.value===''? '' : Number(e.target.value))} style={{flex:1,padding:8}}>
                <option value="">Categoria (opcional)</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
              <input type="checkbox" checked={isDonation} onChange={e=>setIsDonation(e.target.checked)}/>
              É doação (desmarque para troca)
            </label>
            <button type="submit">Salvar item</button>
          </form>
        </div>

        <div style={{border:'1px solid #ddd', borderRadius:12, padding:16}}>
          <h3>Buscar</h3>
          <div style={{display:'flex', gap:8}}>
            <input placeholder="buscar por texto..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,padding:8}}/>
            <button onClick={handleSearch}>Buscar</button>
          </div>
        </div>
      </section>

      <section style={{marginTop:16}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:12}}>
          {items.map(it => (
            <div key={it.id} style={{border:'1px solid #eee', borderRadius:12, padding:12}}>
              <div style={{fontWeight:600, fontSize:16}}>{it.title}</div>
              <div style={{fontSize:12, color:'#666', margin:'4px 0 8px'}}>{new Date(it.created_at).toLocaleString()}</div>
              <div>{it.description || 'sem descrição'}</div>
              <div style={{marginTop:8, fontSize:12}}>
                {it.is_donation ? 'Doação' : 'Troca'} • {it.condition}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
