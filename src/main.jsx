import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Processos from './pages/Processos/Processos'
import Configuracoes from './pages/Config/Configuracoes'
import 'bootstrap/dist/css/bootstrap.min.css'


function Sidebar() {
  const linkStyle = {
    color: '#d6ddeb',
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '6px',
    fontSize: '0.95rem',
    textDecoration: 'none'
  };
  const linkActive = {
    color: '#fff',
    backgroundColor: '#2c5a8a'
  };
  return (
    <div className="vh-100 p-3" style={{width:240, backgroundColor:'#1a3a5e', color:'#fff', borderRight:'3px solid #2c5a8a'}}>
      <h4 style={{color:'#fff', fontWeight:600, marginBottom:'30px'}}>CDRView</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/processos" style={linkStyle}>Processos</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/configuracoes" style={linkStyle}>Configurações</Link>
        </li>
      </ul>
    </div>
  );
}
}>
      <h4>CDRView</h4>
      <ul className="nav flex-column">
        <li className="nav-item"><Link className="nav-link" to="/processos">Processos</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/configuracoes">Configurações</Link></li>
      </ul>
    </div>
  )
}

function App(){
  return (
    <BrowserRouter>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-fill p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/processos" replace />} />
            <Route path="/processos" element={<Processos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)