import React, {useState} from 'react'

export default function Stop(){
  const [host,setHost] = useState('localhost')
  const [processo,setProcesso] = useState('parsergen.exe')

  async function parar(){
    const resp = await fetch('/api/proxy/parar', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({host, processo})})
    const j = await resp.json()
    alert(JSON.stringify(j))
  }

  return (
    <div>
      <h2>Parar Processos</h2>
      <div className="card p-3">
        <div className="mb-2"><label>Host</label><input className="form-control" value={host} onChange={e=>setHost(e.target.value)} /></div>
        <div className="mb-2"><label>Processo (.exe)</label><input className="form-control" value={processo} onChange={e=>setProcesso(e.target.value)} /></div>
        <button className="btn btn-danger" onClick={parar}>Parar</button>
      </div>
    </div>
  )
}