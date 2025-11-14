import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Start from './pages/Start/Start'
import Stop from './pages/Stop/Stop'
import List from './pages/List/List'
import Details from './pages/Details/Details'
import Configuracoes from './pages/Config/Configuracoes'
import 'bootstrap/dist/css/bootstrap.min.css'

function Sidebar() {
  return (
    <div style={{width:220, backgroundColor:'#2F3640', color:'#fff', minHeight:'100vh'}} className="p-3">
      <h5 className="text-white">CDRView Manager</h5>
      <ul className="nav flex-column mt-3">
        <li className="nav-item"><Link className="nav-link text-white" to="/start">Iniciar Processos</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/stop">Parar Processos</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/list">Listar Processos</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/configuracoes">Configurações</Link></li>
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
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/start" element={<Start />} />
            <Route path="/stop" element={<Stop />} />
            <Route path="/list" element={<List />} />
            <Route path="/details" element={<Details />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)