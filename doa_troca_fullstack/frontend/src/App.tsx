import React, { useEffect, useState } from 'react'

type Category = { id:number; name:string }
type Item = {
  id:number; title:string; description?:string; is_donation:boolean;
  condition:string; category_id:number|null; created_at:string
}

const api = {
  async login(email: string, password: string) {
    const form = new FormData()
    form.append('username', email)
    form.append('password', password)
    const r = await fetch('/api/auth/login', { method:'POST', body:form })
    if(!r.ok) throw new Error('Login falhou')
    return r.json()
  },
  async register(payload: { email:string; password:string; name?:string; city?:string }) {
    const r = await fetch('/api/auth/register', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    })
    if(!r.ok) throw new Error('Falha no registro (email já usado?)')
    return r.json()
  },
  async me(token: string) {
    const r = await fetch('/api/users/me', { headers:{ Authorization:`Bearer ${token}` } })
    if(!r.ok) throw new Error('Falha no perfil')
    return r.json()
  },
  async categories(): Promise<Category[]> {
    const r = await fetch('/api/categories'); return r.json()
  },
  async listItems(params: Record<string, any> = {}): Promise<Item[]> {
    const qs = new URLSearchParams(params as any).toString()
    const r = await fetch('/api/items' + (qs ? `?${qs}` : '')); return r.json()
  },
  async createItem(token:string, payload:any): Promise<Item> {
    const r = await fetch('/api/items', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
      body: JSON.stringify(payload)
    })
    if(!r.ok) throw new Error('Erro ao criar item'); return r.json()
  }
}

export default function App(){
  // auth
  const [email, setEmail] = useState('demo@demo.com')
  const [password, setPassword] = useState('demo123')
  const [name, setName] = useState('')        // registro
  const [city, setCity] = useState('')        // registro
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [me, setMe] = useState<any>(() => {
    const raw = localStorage.getItem('me')
    return raw ? JSON.parse(raw) : null
  })
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  // dados
  const [cats, setCats] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)

  // filtros
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState<number | ''>('')

  // form novo item
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isDonation, setIsDonation] = useState(true)
  const [condition, setCondition] = useState<'new'|'used'|'refurb'>('used')
  const [categoryId, setCategoryId] = useState<number | ''>('')

  // carrega dados só quando autenticado
  useEffect(()=>{
    if(!token) return
    api.categories().then(setCats)
    api.listItems().then(setItems)
  },[token])

  // tenta recuperar perfil se tiver token salvo
  useEffect(()=>{
    if(!token) return
    api.me(token).then(u=>{
      setMe(u)
      localStorage.setItem('me', JSON.stringify(u))
    }).catch(()=>{
      // token inválido → limpa
      localStorage.removeItem('token')
      localStorage.removeItem('me')
      setToken(null); setMe(null)
    })
  }, [token])

  async function doLogin(){
    setAuthError(null); setAuthLoading(true)
    try{
      const { access_token } = await api.login(email, password)
      setToken(access_token)
      localStorage.setItem('token', access_token)
      const profile = await api.me(access_token)
      setMe(profile)
      localStorage.setItem('me', JSON.stringify(profile))
    }catch(e:any){
      setAuthError(e.message || 'Erro no login')
    }finally{ setAuthLoading(false) }
  }

  async function doRegister(){
    setAuthError(null); setAuthLoading(true)
    try{
      await api.register({ email, password, name: name || undefined, city: city || undefined })
      await doLogin() // já entra após registrar
    }catch(e:any){
      setAuthError(e.message || 'Erro no registro')
    }finally{ setAuthLoading(false) }
  }

  function logout(){
    setToken(null); setMe(null)
    localStorage.removeItem('token'); localStorage.removeItem('me')
  }

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!token) return alert('Faça login')
    if(!title) return alert('Título é obrigatório')

    const payload = {
      title, description,
      is_donation: isDonation,
      condition,
      category_id: categoryId === '' ? null : Number(categoryId)
    }
    const it = await api.createItem(token, payload)
    setItems([it, ...items])
    setTitle(''); setDescription(''); setIsDonation(true); setCondition('used'); setCategoryId('')
  }

  async function handleSearch(){
    setLoading(true)
    const params:any = {}
    if(q) params.q = q
    if(catFilter !== '') params.category_id = Number(catFilter)
    const list = await api.listItems(params)
    setItems(list)
    setLoading(false)
  }

  // -------- TELA DE LOGIN/REGISTRO (antes) --------
  if(!token || !me){
    return (
      <div style={{fontFamily:'Inter, system-ui', maxWidth: 420, margin:'60px auto', padding:'0 16px'}}>
        <h1 style={{marginBottom:16}}>Plataforma de Doações e Trocas</h1>
        <div style={{border:'1px solid #ddd', borderRadius:12, padding:16}}>
          <div style={{display:'flex', gap:8, marginBottom:12}}>
            <button onClick={()=>setMode('login')} disabled={mode==='login'}>Entrar</button>
            <button onClick={()=>setMode('register')} disabled={mode==='register'}>Criar conta</button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={(e)=>{e.preventDefault(); doLogin()}}>
              <p style={{fontSize:12,color:'#666'}}>Dica: seed `POST /dev/seed`: <code>demo@demo.com</code> / <code>demo123</code></p>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:'100%',padding:8,marginBottom:8}}/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="senha" style={{width:'100%',padding:8,marginBottom:8}}/>
              {authError && <div style={{color:'crimson', marginBottom:8}}>{authError}</div>}
              <button type="submit" disabled={authLoading}>{authLoading ? 'Entrando...' : 'Entrar'}</button>
            </form>
          ) : (
            <form onSubmit={(e)=>{e.preventDefault(); doRegister()}}>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="nome (opcional)" style={{width:'100%',padding:8,marginBottom:8}}/>
              <input value={city} onChange={e=>setCity(e.target.value)} placeholder="cidade (opcional)" style={{width:'100%',padding:8,marginBottom:8}}/>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:'100%',padding:8,marginBottom:8}}/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="senha (mín. 6)" style={{width:'100%',padding:8,marginBottom:8}}/>
              {authError && <div style={{color:'crimson', marginBottom:8}}>{authError}</div>}
              <button type="submit" disabled={authLoading}>{authLoading ? 'Criando...' : 'Criar conta e entrar'}</button>
            </form>
          )}
        </div>
      </div>
    )
  }

  // -------- APP (depois de logado) --------
  return (
    <div style={{fontFamily:'Inter, system-ui', maxWidth: 1000, margin:'24px auto', padding:'0 16px'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h2>Bem-vindo, {me?.name || me?.email}</h2>
        <button onClick={logout}>Sair</button>
      </header>

      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div style={{border:'1px solid #ddd', borderRadius:12, padding:16}}>
          <h2>Novo item</h2>
          <form onSubmit={handleCreate}>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" style={{width:'100%',padding:8,marginBottom:8}}/>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descrição" rows={3} style={{width:'100%',padding:8,marginBottom:8}}/>
            <div style={{display:'flex', gap:8, marginBottom:8}}>
              <select value={condition} onChange={e=>setCondition(e.target.value as any)} style={{flex:1,padding:8}}>
                <option value="new">Novo</option>
                <option value="used">Usado</option>
                <option value="refurb">Recondicionado</option>
              </select>
              <select value={categoryId} onChange={e=>setCategoryId(e.target.value === '' ? '' : Number(e.target.value))} style={{flex:1,padding:8}}>
                <option value="">Categoria (opcional)</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
              <input type="checkbox" checked={isDonation} onChange={e=>setIsDonation(e.target.checked)} />
              É doação (desmarque para troca)
            </label>
            <button type="submit">Salvar item</button>
          </form>
        </div>

        <div style={{border:'1px solid #ddd', borderRadius:12, padding:16}}>
          <h2>Buscar</h2>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input placeholder="buscar por texto..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,padding:8}}/>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value === '' ? '' : Number(e.target.value))} style={{padding:8}}>
              <option value="">Todas categorias</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={handleSearch} disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</button>
          </div>
        </div>
      </section>

      <section style={{marginTop:16}}>
        {items.length === 0 && <p style={{color:'#666'}}>Nenhum item encontrado.</p>}
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
