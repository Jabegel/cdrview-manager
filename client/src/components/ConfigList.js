import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function ConfigList({ setScreen }) {
  const [cfgs, setCfgs] = useState([]);

  async function load() {
    try {
      const res = await api.getConfiguracoes();
      setCfgs(res.configuracoes || []);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar configurações');
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Configurações</h2>
        <div>
          <button className="btn btn-success me-2" onClick={() => setScreen('new-config')}>Nova</button>
          <button className="btn btn-outline-secondary" onClick={load}>Atualizar</button>
        </div>
      </div>
      <table className="table table-striped">
        <thead className="table-dark"><tr><th>Nome</th><th>Processo</th><th>Servidor</th><th>Central</th></tr></thead>
        <tbody>
          {cfgs.map(c => (
            <tr key={c.nome}>
              <td>{c.nome}</td><td>{c.processo || c.exe || '-'}</td><td>{c.servidor}</td><td>{c.central || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
