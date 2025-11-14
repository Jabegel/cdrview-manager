import React from 'react';

export default function Sidebar({ setScreen }) {
  return (
    <div className="sidebar p-3">
      <h4 className="text-white mb-4">CDRView Manager</h4>
      <button className="nav-link mb-2" onClick={() => setScreen('processes')}>Processos</button>
      <button className="nav-link mb-2" onClick={() => setScreen('configs')}>Configurações</button>
      <button className="nav-link" onClick={() => setScreen('new-config')}>Nova Configuração</button>
    </div>
  );
}
