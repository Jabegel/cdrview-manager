
import React, { useEffect, useState } from 'react';

export default function Stop() {
  const [processos, setProcessos] = useState([]);
  const [procId, setProcId] = useState('');

  useEffect(() => {
    async function load() {
      const resp = await fetch('/api/processos/list');
      const j = await resp.json();
      setProcessos(j.processos || []);
    }
    load();
  }, []);

  async function parar() {
    if (!procId) {
      alert('Selecione um processo.');
      return;
    }
    const selected = processos.find(p => p.id === Number(procId));
    const resp = await fetch('/api/proxy/parar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configId: selected.configId })
    });
    const j = await resp.json();
    alert(JSON.stringify(j, null, 2));
  }

  return (
    <div>
      <h2>Parar Processos</h2>
      <div className="card p-3">
        <div className="mb-3">
          <label>Processo Ativo</label>
          <select className="form-control" value={procId} onChange={e => setProcId(e.target.value)}>
            <option value="">Selecione...</option>
            {processos.filter(p => p.status === 'running').map(p => (
              <option key={p.id} value={p.id}>
                {p.configNome} - {p.processo} - {p.servidor}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-danger w-100" onClick={parar}>Parar</button>
      </div>
    </div>
  );
}
