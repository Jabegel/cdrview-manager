import React, {useState} from 'react'

export default function Start() {
  const [host,setHost] = useState('localhost')
  const [processo,setProcesso] = useState('ServicoIndexacao')

  const startProcess = async () => {
    const resp = await fetch('/api/processos/start', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({host, processo})
    })
    const json = await resp.json()
    alert(JSON.stringify(json))
  }

  return (
    <div>
      <label>Host: <input value={host} onChange={e=>setHost(e.target.value)} /></label><br/>
      <label>Processo: <input value={processo} onChange={e=>setProcesso(e.target.value)} /></label><br/>
      <button className="btn btn-primary mt-2" onClick={startProcess}>Iniciar</button>
    </div>
  )
}