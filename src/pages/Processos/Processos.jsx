import React, {useEffect, useState, useMemo} from 'react'
import DataTable from 'react-data-table-component'

export default function Processos(){
  const [processos, setProcessos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState('')

  useEffect(()=>{ fetchList() }, [])

  async function fetchList(){
    setLoading(true)
    const resp = await fetch('/api/processos/list')
    const j = await resp.json()
    setProcessos(j.processos || [])
    setLoading(false)
  }

  async function start(proc){
    await fetch('/api/processos/start', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ configId: proc.configId, host: proc.servidor })})
    fetchList()
  }

  async function stop(proc){
    await fetch('/api/processos/stop', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ configId: proc.configId, host: proc.servidor })})
    fetchList()
  }

  const columns = useMemo(()=>[
    { name: 'Nome Config', selector: row => row.configNome || '-', sortable: true },
    { name: 'Processo', selector: row => row.processo || '-', sortable: true },
    { name: 'PID', selector: row => row.pid || '-', sortable: true },
    { name: 'Servidor', selector: row => row.servidor, sortable: true },
    { name: 'Status', selector: row => row.status, sortable: true, cell: row => (row.status==='running' ? <span className="badge bg-success">Running</span> : <span className="badge bg-danger">Stopped</span>) },
    { name: 'Argumentos', selector: row => row.argumentos || '-', wrap: true },
    { name: 'Ações', cell: row => (row.status === 'stopped' ? <button className="btn btn-sm btn-success" onClick={()=>start(row)}>Iniciar</button> : <button className="btn btn-sm btn-danger" onClick={()=>stop(row)}>Parar</button>), ignoreRowClick: true, allowOverflow: true, button: true }
  ], [])

  const filtered = processos.filter(p => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (p.configNome||'').toLowerCase().includes(q) || (p.processo||'').toLowerCase().includes(q) || (p.servidor||'').toLowerCase().includes(q)
  })

  const subHeader = (
    <div className="d-flex gap-2">
      <input className="form-control" placeholder="Buscar..." value={filterText} onChange={e=>setFilterText(e.target.value)} />
      <button className="btn btn-outline-secondary" onClick={fetchList}>Atualizar</button>
    </div>
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Processos</h2>
      </div>
      <div className="card">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={filtered}
            progressPending={loading}
            pagination
            subHeader
            subHeaderComponent={subHeader}
            responsive
            highlightOnHover
          />
        </div>
      </div>
    </div>
  )
}