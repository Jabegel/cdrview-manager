
import React, { useEffect, useState } from 'react';

export default function Stop() {
  const [processos, setProcessos] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    async function load() {
      const resp = await fetch('/api/processos/list');
      const j = await resp.json();
      setProcessos(j.processos || []);
    }
    load();
  }, []);

  function toggle(id) {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function pararSelecionados() {
    const chosen = processos.filter(p => selected[p.id]).map(p => p.id);
    if (!chosen.length) { alert('Selecione ao menos um processo.'); return; }
    const resp = await fetch('/api/processos/stop-multiple', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ pids: chosen })
    });
    const j = await resp.json();
    alert(JSON.stringify(j, null, 2));
  }

  return (
    <div>
      <h2>Parar Processos</h2>
      <div className="card p-3">
        <div className="mb-2">
          <button className="btn btn-danger me-2" onClick={pararSelecionados}>Parar Selecionados</button>
        </div>
        <div style={{maxHeight:'60vh', overflowY:'auto'}}>
          <table className="table table-sm table-hover">
            <thead><tr><th></th><th>Processo</th><th>Máquina</th><th>Status</th><th>PID</th></tr></thead>
            <tbody>
              {processos.map(p => (
                <tr key={p.id}>
                  <td><input type="checkbox" checked={!!selected[p.id]} onChange={()=>toggle(p.id)} /></td>
                  <td>{p.configNome}</td>
                  <td>{p.servidor}</td>
                  <td>{p.status}</td>
                  <td>{p.pid || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
