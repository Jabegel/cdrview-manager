import React from 'react';

export default function Sidebar({ setScreen }){
  return (
    <div className="sidebar">
      <h4 className="text-white mb-4">CDRView Manager</h4>
      <button className="nav-link mb-2" onClick={() => setScreen('start')}>Iniciar Processos</button>
      <button className="nav-link mb-2" onClick={() => setScreen('stop')}>Parar Processos</button>
      <button className="nav-link mb-2" onClick={() => setScreen('processes')}>Processos</button>
      <hr style={{borderColor:'rgba(255,255,255,0.06)'}} />
      <button className="nav-link mb-2" onClick={() => setScreen('configs')}>Configurações</button>
    </div>
  );
}
