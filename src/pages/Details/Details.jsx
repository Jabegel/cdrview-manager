import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'

function useQuery(){ return new URLSearchParams(useLocation().search); }

export default function Details(){
  const q = useQuery()
  const pid = q.get('pid')
  const [detail, setDetail] = useState(null)

  useEffect(()=>{ if(pid) load() }, [pid])

  async function load(){
    const resp = await fetch('/api/processos/list')
    const j = await resp.json()
    const proc = (j.processos||[]).find(p => String(p.pid)===String(pid) || String(p.id)===String(pid))
    setDetail(proc || null)
  }

  return (
    <div>
      <h2>Detalhes do Processo</h2>
      <div className="card p-3">
        {detail ? (
          <div>
            <p><strong>Servidor:</strong> {detail.servidor}</p>
            <p><strong>PID:</strong> {detail.pid}</p>
            <p><strong>Status:</strong> {detail.status}</p>
            <p><strong>Início:</strong> {detail.inicio}</p>
            <p><strong>Duração:</strong> {detail.duracao || '-'}</p>
            <p><strong>Argumentos:</strong> {detail.argumentos}</p>
          </div>
        ) : <p>Nenhum detalhe encontrado para PID/ID {pid}</p>}
      </div>
    </div>
  )
}