import React, {useEffect, useState, useMemo} from 'react'
import DataTable from 'react-data-table-component'

export default function Configuracoes(){
  const [configs, setConfigs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({nome:'', processo:'', servidor:'', central:'', argumentos:''})
  const [filterText, setFilterText] = useState('')

  useEffect(()=>{ load() }, [])

  async function load(){
    try {
        const resp = await fetch('/api/processo/configuracao', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
        
        if(!resp.ok) throw new Error("Erro " + resp.status)

        const j = await resp.json()
        
        let lista = []
        if (j.configuracoes) lista = j.configuracoes
        else if (j.configuracao) lista = j.configuracao
        else if(Array.isArray(j)) lista = j
        
        setConfigs(lista)

    } catch (e) {
        console.error("Erro ao carregar configs:", e)
    }
  }

  // --- função iniciar processo ---
  async function iniciarProcesso(row) {
    if(!confirm(`Deseja iniciar o processo da configuração "${row.nome}"?`)) return;

    let argsCorrigidos = row.argumentos || "";
    if (argsCorrigidos && !argsCorrigidos.startsWith(" ")) {
        argsCorrigidos = " " + argsCorrigidos;
    }

    const hostCorrigido = row.servidor ? row.servidor.toUpperCase() : "VISENTUCB";

    const payload = {
        "host": hostCorrigido,
        "processo": row.processo,
        "argumento": argsCorrigidos,
        "argumentos": argsCorrigidos
    }
    
    console.log("Enviando payload:", JSON.stringify(payload));

    try {
        const resp = await fetch('/api/processo/iniciar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if(resp.ok) {
            alert(`Comando enviado! Aguarde alguns segundos e verifique a aba Processos.`)
        } else {
            let erro = await resp.text().catch(()=>"Erro desconhecido");
            console.error("Erro do servidor:", erro)
            alert('Erro: ' + erro)
        }
    } catch (e) {
        console.error(e)
        alert('Erro de conexão.')
    }
  }

  function openNew(){ setForm({nome:'', processo:'', servidor:'', central:'', argumentos:''}); setShowForm(true) }
  function openEdit(c){ setForm(c); setShowForm(true) }

  async function save(e){
    e.preventDefault()
    const payload = {
        configuracao: [{
            nome: form.nome,
            central: form.central,
            servidor: form.servidor,
            processo: form.processo || form.exe,
            argumentos: form.argumentos
        }]
    }

    try {
        const resp = await fetch('/api/processo/configuracao', {
            method: 'POST', 
            headers:{'Content-Type':'application/json'}, 
            body: JSON.stringify(payload)
        })
        
        if(resp.ok) {
            alert("Salvo com sucesso!")
            await load()
            setShowForm(false)
        } else {
            alert("Erro ao salvar")
        }
    } catch (err) {
        console.error(err)
    }
  }

  const columns = useMemo(()=>[
    { name: 'Nome', selector: r => r.nome, sortable: true },
    { name: 'Processo', selector: r => r.processo, sortable: true },
    { name: 'Servidor', selector: r => r.servidor, sortable: true },
    { name: 'Central', selector: r => r.central, sortable: true },
    { name: 'Argumentos', selector: r => r.argumentos, wrap: true },
    { name: 'Ações', cell: r => (
        <div className="d-flex gap-2">
            {/* botão de iniciar */}
            <button className="btn btn-sm btn-success" onClick={()=>iniciarProcesso(r)} title="Iniciar Processo">
                ▶ Iniciar
            </button>
            <button className="btn btn-sm btn-warning" onClick={()=>openEdit(r)}>
                Editar
            </button>
        </div>
    ), ignoreRowClick:true, allowOverflow:true, button:true, width: '200px' }
  ], [])

  const filtered = configs.filter(c => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (c.nome||'').toLowerCase().includes(q) || (c.servidor||'').toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Configurações</h2>
        <div>
          <input className="form-control d-inline-block me-2" style={{width:220}} placeholder="Buscar..." value={filterText} onChange={e=>setFilterText(e.target.value)} />
          <button className="btn btn-primary" onClick={openNew}>Nova Configuração</button>
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
            <h5>{form.nome ? 'Editar/Ver' : 'Nova'} Configuração</h5>
            <form onSubmit={save}>
              <div className="mb-2"><label className="form-label">Nome</label><input className="form-control" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} required /></div>
              <div className="mb-2"><label className="form-label">Processo (.exe)</label><input className="form-control" value={form.processo} onChange={e=>setForm({...form, processo:e.target.value})} required /></div>
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