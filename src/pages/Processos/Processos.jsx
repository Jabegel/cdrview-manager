import React, {useEffect, useState, useMemo} from 'react'
import DataTable from 'react-data-table-component'

export default function Processos(){
  const [processos, setProcessos] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState('')

  useEffect(()=>{ fetchList() }, [])

  async function fetchList(){
    setLoading(true)
    try {
        const resp = await fetch('/api/processo/listar', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        
        if (!resp.ok) {
            const text = await resp.text()
            throw new Error(`Erro ${resp.status}: ${text}`)
        }

        const j = await resp.json()
        
        let listaFinal = []
        if (j.lista_processos) {
            const hosts = Object.keys(j.lista_processos);
            hosts.forEach(hostKey => {
                const procs = j.lista_processos[hostKey];
                const procsComHost = procs.map(p => ({ ...p, servidor: hostKey }));
                listaFinal = [...listaFinal, ...procsComHost];
            });
        } else if (j.processos) {
             listaFinal = j.processos
        } else if (Array.isArray(j)) {
             listaFinal = j
        }

        setProcessos(listaFinal || [])

    } catch (error) {
        console.error("Erro:", error)
    } finally {
        setLoading(false)
    }
  }

  async function stop(proc){
    if(!confirm(`Deseja parar o processo "${proc.nome || proc.processo}"?`)) return;

    const hostCorrigido = (proc.servidor || proc.host || "VISENTUCB").toUpperCase();
    const processoNome = proc.nome || proc.processo;
    const args = proc.argumentos || "";

    const payload = {
        host: hostCorrigido,
        processo: processoNome,
        argumento: args,
        argumentos: args
    };

    console.log("Payload enviado para parar:", payload);

    try {
        const resp = await fetch('/api/processo/parar', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });

        const text = await resp.text();
        console.log("Resposta do servidor:", text);

        if(resp.ok){
            alert("Comando enviado! Aguardando fechamento...");
            let tentativas = 0;
            const intervalo = setInterval(async () => {
                await fetchList();
                tentativas++;
                if(tentativas >= 15) clearInterval(intervalo);
            }, 2000);
        } else {
            alert("Erro ao parar: " + text);
        }
    } catch(e){
        console.error(e);
        alert("Erro de conexão ao tentar parar.");
    }
}


  const columns = useMemo(()=>[
    { name: 'Nome Config', selector: row => row.configNome || row.nome || '-', sortable: true },
    { name: 'Processo', selector: row => row.nome || row.processo || '-', sortable: true },
    { name: 'PID', selector: row => row.pid || '-', sortable: true },
    { name: 'Servidor', selector: row => row.servidor || row.host || '-', sortable: true },
    { 
        name: 'Status', 
        selector: row => row.pid ? 'running' : 'stopped', 
        sortable: true, 
        cell: row => (row.pid ? <span className="badge bg-success">Running</span> : <span className="badge bg-danger">Stopped</span>) 
    },
    { name: 'Argumentos', selector: row => row.argumentos || '-', wrap: true },
    { 
        name: 'Ações', 
        cell: row => (row.pid ? <button className="btn btn-sm btn-danger" onClick={()=>stop(row)}>Parar</button> : <span className="text-muted">-</span>), 
        ignoreRowClick: true, 
        allowOverflow: true, 
        button: true 
    }
  ], [])

  const filtered = processos.filter(p => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (p.configNome||'').toLowerCase().includes(q) || (p.nome||'').toLowerCase().includes(q) || (p.processo||'').toLowerCase().includes(q)
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