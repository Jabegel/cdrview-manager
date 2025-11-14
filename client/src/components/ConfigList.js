import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function ConfigList({ setEditingConfig, setScreen }){
  const [cfgs, setCfgs] = useState([]);

  async function load(){ try{ const res = await api.getConfiguracoes(); setCfgs(res.configuracoes || []); }catch(e){ console.error(e); alert('Erro ao carregar configs'); } }

  useEffect(()=>{ load(); },[]);

  async function remove(nome){
    if(!confirm('Excluir ' + nome + '?')) return;
    try{ await fetch(`/cdrview/processo/configuracao/${encodeURIComponent(nome)}`, { method: 'DELETE' }); alert('Excluído'); load(); }catch(e){ console.error(e); alert('Erro ao excluir'); }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Configurações</h2>
        <div>
          <button className="btn btn-success me-2" onClick={() => setScreen('new-config')}>Nova Configuração</button>
          <button className="btn btn-outline-secondary" onClick={load}>Atualizar</button>
        </div>
      </div>

      <table className="table table-striped">
        <thead className="table-dark"><tr><th>Nome</th><th>Processo</th><th>Servidor</th><th>Central</th><th>Argumentos</th><th>Ações</th></tr></thead>
        <tbody>
          {cfgs.map(c => (
            <tr key={c.nome}>
              <td>{c.nome}</td>
              <td>{c.processo || '-'}</td>
              <td>{c.servidor}</td>
              <td>{c.central || '-'}</td>
              <td><small>{c.argumentos || '-'}</small></td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditingConfig(c); setScreen('new-config'); }}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => remove(c.nome)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
