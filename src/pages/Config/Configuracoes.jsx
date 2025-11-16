import React, {useEffect, useState, useMemo} from 'react'
import DataTable from 'react-data-table-component'

export default function Configuracoes(){
  const [configs, setConfigs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({id:null, nome:'', exe:'', servidor:'', central:'', argumentos:''})
  const [filterText, setFilterText] = useState('')

  useEffect(()=>{ load() }, [])

  async function load(){
    const resp = await fetch('/api/configs/list')
    const j = await resp.json()
    setConfigs(j.configs || [])
  }

  function openNew(){ setForm({id:null, nome:'', exe:'', servidor:'', central:'', argumentos:''}); setShowForm(true) }
  function openEdit(c){ setForm(c); setShowForm(true) }

  async function save(e){
    e.preventDefault()
    const url = form.id ? '/api/configs/update' : '/api/configs/create'
    await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    await load(); setShowForm(false)
  }

  async function remove(id){
    if(!confirm('Excluir?')) return
    await fetch('/api/configs/delete', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})})
    await load()
  }

  const columns = useMemo(()=>[
    { name: 'Nome', selector: r => r.nome, sortable: true },
    { name: 'Processo', selector: r => r.exe, sortable: true },
    { name: 'Servidor', selector: r => r.servidor, sortable: true },
    { name: 'Central', selector: r => r.central, sortable: true },
    { name: 'Argumentos', selector: r => r.argumentos, wrap: true },
    { name: 'Ações', cell: r => (<div><button className="btn btn-sm btn-warning me-2" onClick={()=>openEdit(r)}>Editar</button><button className="btn btn-sm btn-danger" onClick={()=>remove(r.id)}>Excluir</button></div>), ignoreRowClick:true, allowOverflow:true, button:true }
  ], [])

  const filtered = configs.filter(c => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (c.nome||'').toLowerCase().includes(q) || (c.exe||'').toLowerCase().includes(q) || (c.servidor||'').toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Configurações</h2>
        <div>
          <input className="form-control d-inline-block me-2" style={{width:220}} placeholder="Buscar..." value={filterText} onChange={e=>setFilterText(e.target.value)} />
          <button className="btn btn-success" onClick={openNew}>Nova Configuração</button>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filtered}
            pagination
            responsive
            highlightOnHover
          />
        </div>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-body">
            <h5>{form.id ? 'Editar' : 'Nova'} Configuração</h5>
            <form onSubmit={save}>
              <div className="mb-2"><label className="form-label">Nome</label><input className="form-control" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} required /></div>
              <div className="mb-2"><label className="form-label">Processo (.exe)</label><input className="form-control" value={form.exe} onChange={e=>setForm({...form, exe:e.target.value})} required /></div>
              <div className="mb-2"><label className="form-label">Servidor</label><input className="form-control" value={form.servidor} onChange={e=>setForm({...form, servidor:e.target.value})} /></div>
              <div className="mb-2"><label className="form-label">Central</label><input className="form-control" value={form.central} onChange={e=>setForm({...form, central:e.target.value})} /></div>
              <div className="mb-2"><label className="form-label">Argumentos</label><input className="form-control" value={form.argumentos} onChange={e=>setForm({...form, argumentos:e.target.value})} /></div>
              <div className="d-flex gap-2"><button className="btn btn-primary" type="submit">Salvar</button><button type="button" className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancelar</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}