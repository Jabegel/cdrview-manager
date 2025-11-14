
import React, { useEffect, useState } from 'react';

export default function Start() {
  const [configs, setConfigs] = useState([]);
  const [configId, setConfigId] = useState('');

  useEffect(() => {
    async function load() {
      const resp = await fetch('/api/configs/list');
      const j = await resp.json();
      setConfigs(j.configs || []);
    }
    load();
  }, []);

  async function iniciar() {
    if (!configId) {
      alert('Selecione uma configuração.');
      return;
    }
    const resp = await fetch('/api/proxy/iniciar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configId })
    });
    const j = await resp.json();
    alert(JSON.stringify(j, null, 2));
  }

  return (
    <div>
      <h2>Iniciar Processos</h2>
      <div className="card p-3">
        <div className="mb-3">
          <label>Configuração</label>
          <select className="form-control" value={configId} onChange={e => setConfigId(Number(e.target.value))}>
            <option value="">Selecione...</option>
            {configs.map(c => (
              <option key={c.id} value={c.id}>
                {c.nome} - {c.exe} - {c.servidor}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary w-100" onClick={iniciar}>Iniciar</button>
      </div>
    </div>
  );
}
