import React, {useState} from 'react'

export default function Details() {
  const [pid,setPid] = useState('');
  const [detail,setDetail] = useState(null);

  const fetchDetail = async () => {
    const resp = await fetch('/api/processos/list');
    const j = await resp.json();
    const proc = (j.processos || []).find(p => String(p.pid) === String(pid) || String(p.id) === String(pid));
    setDetail(proc || { error: 'Não encontrado' });
  }

  return (
    <div>
      <label>PID ou ID do processo: <input value={pid} onChange={e=>setPid(e.target.value)} /></label>
      <button className="btn btn-secondary ms-2" onClick={fetchDetail}>Buscar</button>
      <pre style={{whiteSpace:'pre-wrap', marginTop:10}}>{detail ? JSON.stringify(detail, null, 2) : ''}</pre>
    </div>
  )
}