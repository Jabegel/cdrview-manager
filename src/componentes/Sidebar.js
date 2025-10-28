import React from 'react';

function Sidebar() {
  return (
    <nav className="sidebar">
      <h1>CDRView Manager</h1>
      <ul>
        <li>Iniciar Processos</li>
        <li>Parar Processos</li>
        <li className="active">Listar Processos</li>
      </ul>
    </nav>
  );
}

export default Sidebar;