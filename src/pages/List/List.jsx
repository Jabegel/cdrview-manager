import React, {useEffect, useState, useMemo} from 'react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'

export default function List(){
  const [processos, setProcessos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{ fetchList() }, [])

  async function fetchList(){
    setLoading(true)
    const resp = await fetch('/api/processos/list')
    const j = await resp.json()
    setProcessos(j.processos || [])
    setLoading(false)
  }

  const columns = useMemo(()=>[
    { name: 'Máquina ID', selector: r => r.servidor, sortable: true },
    { name: 'Processo ID', selector: r => r.pid ? 'Proc'+r.pid : '-', sortable: true },
    { name: 'Status', selector: r => r.status, cell: r => (r.status==='running' ? <span className="badge bg-success">Running</span> : <span className="badge bg-danger">Stopped</span>), sortable: true },
    { name: 'Início', selector: r => r.inicio || '-', sortable: true },
    { name: 'Duração', selector: r => r.duracao || '-', sortable: true },
    { name: 'Ações', cell: r => <button className="btn btn-sm btn-primary" onClick={()=>navigate('/details?pid='+ (r.pid||r.id))}>Ver Detalhes</button>, ignoreRowClick:true, allowOverflow:true }
  ], [navigate])

  const filtered = processos.filter(p => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (p.servidor||'').toLowerCase().includes(q) || (p.processo||'').toLowerCase().includes(q)
  })

  return (
    <div>
      <h2>Listar Processos</h2>
      <div className="card p-3">
        <div className="mb-2"><input className="form-control" placeholder="Buscar Processo/Máquina" value={filterText} onChange={e=>setFilterText(e.target.value)} /></div>
        <DataTable columns={columns} data={filtered} pagination progressPending={loading} />
      </div>
    </div>
  )
}