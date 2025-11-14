import React, {useState} from 'react'

export default function Start(){
  const [host,setHost] = useState('localhost')
  const [processo,setProcesso] = useState('parsergen.exe')
  const [argumentos,setArgumentos] = useState('')

  async function iniciar(){
    const resp = await fetch('/api/proxy/iniciar', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({host, processo, argumentos})})
    const j = await resp.json()
    alert(JSON.stringify(j))
  }

  return (
    <div>
      <h2>Iniciar Processos</h2>
      <div className="card p-3">
        <div className="mb-2"><label>Host</label><input className="form-control" value={host} onChange={e=>setHost(e.target.value)} /></div>
        <div className="mb-2"><label>Processo (.exe)</label><input className="form-control" value={processo} onChange={e=>setProcesso(e.target.value)} /></div>
        <div className="mb-2"><label>Argumentos</label><input className="form-control" value={argumentos} onChange={e=>setArgumentos(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={iniciar}>Iniciar</button>
      </div>
    </div>
  )
}