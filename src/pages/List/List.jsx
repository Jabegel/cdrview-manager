import React, {useState} from 'react'

export default function List() {
  const [host,setHost] = useState('localhost')
  const [result,setResult] = useState(null)

  const listProcesses = async () => {
    const resp = await fetch('/api/processos/list', {
      method: 'GET'
    })
    const json = await resp.json()
    setResult(json)
  }

  return (
    <div>
      <label>Host: <input value={host} onChange={e=>setHost(e.target.value)} /></label><br/>
      <button className="btn btn-secondary mt-2" onClick={listProcesses}>Listar</button>
      <pre style={{whiteSpace:'pre-wrap'}}>{result ? JSON.stringify(result, null, 2) : ''}</pre>
    </div>
  )
}