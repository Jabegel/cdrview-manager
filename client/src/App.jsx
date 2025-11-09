import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const MODE = 'local'; // 'local' ou 'external'
  const backendHost =
    MODE === 'local'
      ? 'http://localhost:4000/api'
      : 'http://localhost:6869/cdrview';
  const API_BASE = `${backendHost}`;

  const [activeView, setActiveView] = useState('iniciar');
  const [machineId, setMachineId] = useState('');
  const [processType, setProcessType] = useState('CDR Analysis');
  const [parameters, setParameters] = useState('');
  const [processos, setProcessos] = useState([]);
  const [systemStatus, setSystemStatus] = useState({ status: 'offline' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  useEffect(() => {
    if (activeView === 'listar') {
      fetchProcessos();
    }
  }, [activeView]);

  const fetchSystemStatus = async () => {
    try {
      const resp = await axios.get(`${backendHost}/status`);
      const data = resp.data;
      if (data && data.status) {
        setSystemStatus(data);
        return;
      }
    } catch { }
    try {
      const resp = await axios.post(`${API_BASE}/processo/listar`, {});
      const data = resp.data;
      const maquinas = Array.isArray(data.processos)
        ? data.processos.map((p) => p.machineId)
        : [];
      setSystemStatus({
        status: 'online',
        maquinasOnline: [...new Set(maquinas)].length,
      });
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  const fetchProcessos = async () => {
    try {
      const resp = await axios.post(`${API_BASE}/processo/listar`, {});
      const data = resp.data;
      if (data.success) {
        setProcessos(data.processos);
      }
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      showMessage('Erro ao carregar processos', 'error');
    }
  };

  const handleIniciarProcesso = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let parsedParams = {};
      if (parameters.trim()) {
        try {
          parsedParams = JSON.parse(parameters);
        } catch {
          const pairs = parameters.split(',').map((p) => p.trim());
          pairs.forEach((pair) => {
            const [key, value] = pair.split('=').map((s) => s.trim());
            if (key && value) parsedParams[key] = value;
          });
        }
      }

      const resp = await axios.post(`${API_BASE}/processo/iniciar`, {
        host: machineId,
        processo: processType,
        argumento: parsedParams,
      });

      const data = resp.data;
      if (data.success) {
        showMessage('Processo iniciado com sucesso!', 'success');
        setMachineId('');
        setParameters('');
        setProcessos((prev) => [data.processo, ...prev]);
      } else {
        showMessage(data.error || 'Erro ao iniciar processo', 'error');
      }
    } catch (error) {
      console.error('Erro ao iniciar processo:', error);
      showMessage('Erro ao conectar com o servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePararProcesso = async (id) => {
    try {
      const resp = await axios.post(`${API_BASE}/processo/parar`, {
        parar: [{ pid: id }],
      });
      const data = resp.data;
      if (data.success) {
        showMessage('Processo parado com sucesso!', 'success');
        fetchProcessos();
      } else {
        showMessage(data.error || 'Erro ao parar processo', 'error');
      }
    } catch (error) {
      console.error('Erro ao parar processo:', error);
      showMessage('Erro ao conectar com o servidor', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            <div>
              <div className="logo-title">CDRView</div>
              <div className="logo-subtitle">Manager</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeView === 'iniciar' ? 'active' : ''}`} onClick={() => setActiveView('iniciar')}>
            Iniciar Processos
          </button>
          <button className={`nav-item ${activeView === 'parar' ? 'active' : ''}`} onClick={() => setActiveView('parar')}>
            Parar Processos
          </button>
          <button className={`nav-item ${activeView === 'listar' ? 'active' : ''}`} onClick={() => setActiveView('listar')}>
            Listar Processos
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="status-box">
            <div className="status-title">Status do Sistema</div>
            <div className="status-indicator">
              <span className={`status-dot ${systemStatus.status === 'online' ? 'online' : 'offline'}`}></span>
              {systemStatus.status === 'online' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        {/* INICIAR */}
        {activeView === 'iniciar' && (
          <div className="content-wrapper">
            <h1>Iniciar Processos</h1>
            <form onSubmit={handleIniciarProcesso} className="form">
              <input type="text" value={machineId} onChange={(e) => setMachineId(e.target.value)} placeholder="ID da máquina" />
              <select value={processType} onChange={(e) => setProcessType(e.target.value)}>
                <option value="CDR Analysis">CDR Analysis</option>
                <option value="Data Processing">Data Processing</option>
                <option value="Report Generation">Report Generation</option>
                <option value="System Maintenance">System Maintenance</option>
              </select>
              <textarea value={parameters} onChange={(e) => setParameters(e.target.value)} placeholder="Parâmetros (JSON ou chave=valor)"></textarea>
              <button type="submit" disabled={loading}>{loading ? 'Iniciando...' : 'Iniciar Processo'}</button>
            </form>
          </div>
        )}

        {/* PARAR */}
        {activeView === 'parar' && (
          <div className="content-wrapper">
            <h1>Parar Processos</h1>
            <div className="process-list">
              {processos.filter(p => p.status === 'iniciado').map(processo => (
                <div key={processo.id} className="process-card">
                  <div>{processo.processType} - {processo.machineId}</div>
                  <button onClick={() => handlePararProcesso(processo.id)}>Parar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTAR */}
        {activeView === 'listar' && (
          <div className="content-wrapper">
            <h1>Listar Processos</h1>
            <div className="process-list">
              {processos.map(processo => (
                <div key={processo.id} className="process-card">
                  <div>{processo.processType} - {processo.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
