import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth"

const api = {
  async login(email: string, password: string) {
    const f = new FormData()
    f.append("username", email); f.append("password", password)
    const r = await fetch("/api/auth/login", { method:"POST", body:f })
    if (!r.ok) throw new Error("Falha no login")
    return r.json()
  },
  async me(token: string) {
    const r = await fetch("/api/users/me", { headers:{ Authorization:`Bearer ${token}` }})
    if (!r.ok) throw new Error("Falha ao obter perfil")
    return r.json()
  },
  async register(payload: { email:string; password:string; name?:string; city?:string }) {
    const r = await fetch("/api/auth/register", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    })
    if (!r.ok) throw new Error("Falha no registro (email já usado?)")
    return r.json()
  }
}

export default function LoginPage(){
  const nav = useNavigate()
  const { login } = useAuth()
  const [mode, setMode] = useState<"login"|"register">("login")

  // campos
  const [email, setEmail] = useState("demo@demo.com")
  const [password, setPassword] = useState("demo123")
  const [name, setName] = useState("")
  const [city, setCity] = useState("")

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent){
    e.preventDefault(); setErr(null); setLoading(true)
    try{
      const { access_token } = await api.login(email, password)
      const me = await api.me(access_token)
      login(access_token, me)
      nav("/") // para Home
    }catch(err:any){ setErr(err.message) }
    finally{ setLoading(false) }
  }

  async function handleRegister(e: React.FormEvent){
    e.preventDefault(); setErr(null); setLoading(true)
    try{
      await api.register({ email, password, name, city })
      // após registrar, já loga
      const { access_token } = await api.login(email, password)
      const me = await api.me(access_token)
      login(access_token, me)
      nav("/")
    }catch(err:any){ setErr(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div style={{maxWidth:420, margin:"60px auto", fontFamily:"Inter, system-ui"}}>
      <h1 style={{marginBottom:16}}>Plataforma de Doações e Trocas</h1>

      <div style={{border:"1px solid #ddd", borderRadius:12, padding:16}}>
        <div style={{display:"flex", gap:8, marginBottom:12}}>
          <button onClick={()=>setMode("login")} disabled={mode==="login"}>Entrar</button>
          <button onClick={()=>setMode("register")} disabled={mode==="register"}>Criar conta</button>
        </div>

        {mode==="login" ? (
          <form onSubmit={handleLogin}>
            <p style={{fontSize:12,color:"#666"}}>Dica: use o seed: <code>demo@demo.com</code> / <code>demo123</code></p>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:"100%",padding:8,marginBottom:8}}/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="senha" style={{width:"100%",padding:8,marginBottom:8}}/>
            {err && <div style={{color:"crimson", marginBottom:8}}>{err}</div>}
            <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="nome (opcional)" style={{width:"100%",padding:8,marginBottom:8}}/>
            <input value={city} onChange={e=>setCity(e.target.value)} placeholder="cidade (opcional)" style={{width:"100%",padding:8,marginBottom:8}}/>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:"100%",padding:8,marginBottom:8}}/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="senha (mín. 6)" style={{width:"100%",padding:8,marginBottom:8}}/>
            {err && <div style={{color:"crimson", marginBottom:8}}>{err}</div>}
            <button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar conta e entrar"}</button>
          </form>
        )}
      </div>
    </div>
  )
}
