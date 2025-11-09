import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [activeView, setActiveView] = useState('iniciar');
  const [machineId, setMachineId] = useState('');
  const [processType, setProcessType] = useState('CDR Analysis');
  const [parameters, setParameters] = useState('');
  const [processos, setProcessos] = useState([]);
  const [systemStatus, setSystemStatus] = useState({ status: 'offline' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [backendHost, setBackendHost] = useState('http://localhost:6869');
  const API_BASE = `${backendHost}/cdrview`;

  // Carregar status do sistema
  useEffect(() => {
    fetchSystemStatus();
  }, []);

  // Carregar processos quando mudar para a view de listar
  useEffect(() => {
    if (activeView === 'listar') {
      fetchProcessos();
    }
  }, [activeView]);

  const fetchSystemStatus = async () => {
    try {
      // tenta endpoint /status primeiro
      const resp = await axios.get(`${backendHost}/status`);
      const data = resp.data;
      if (data && data.status) {
        setSystemStatus(data);
        return;
      }
    } catch (err) {
      // ignore and fallback to listar
    }
    try {
      const resp = await axios.post(`${API_BASE}/processo/listar`, {});
      const data = resp.data;
      // monta um status simples a partir da lista
      const maquinas = Array.isArray(data.processos) ? data.processos.map(p=>p.machineId) : [];
      setSystemStatus({ status: 'online', maquinasOnline: [...new Set(maquinas)].length });
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  const fetchProcessos = async () => {
    try {
      const response = await fetch(`${API_URL}/processos`);
      const data = await response.json();
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
      // Tentar parsear parâmetros como JSON
      let parsedParams = {};
      if (parameters.trim()) {
        try {
          parsedParams = JSON.parse(parameters);
        } catch {
          // Se não for JSON, tentar parsear como chave=valor
          const pairs = parameters.split(',').map(p => p.trim());
          pairs.forEach(pair => {
            const [key, value] = pair.split('=').map(s => s.trim());
            if (key && value) {
              parsedParams[key] = value;
            }
          });
        }
      }

      const response = await fetch(`${API_URL}/processo/iniciar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machineId: machineId || null,
          processType,
          parameters: parsedParams,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Processo iniciado com sucesso!', 'success');
        // Limpar formulário
        setMachineId('');
        setParameters('');
        // Adicionar processo à lista
        setProcessos(prev => [data.processo, ...prev]);
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
      const response = await fetch(`${API_URL}/processo/parar/${id}`, {
        method: 'POST',
      });
      const data = await response.json();

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
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
            </svg>
            <div>
              <div className="logo-title">CDRView</div>
              <div className="logo-subtitle">Manager</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === 'iniciar' ? 'active' : ''}`}
            onClick={() => setActiveView('iniciar')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10 8 16 12 10 16 10 8"/>
            </svg>
            Iniciar Processos
          </button>

          <button
            className={`nav-item ${activeView === 'parar' ? 'active' : ''}`}
            onClick={() => setActiveView('parar')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <rect x="9" y="9" width="6" height="6"/>
            </svg>
            Parar Processos
          </button>

          <button
            className={`nav-item ${activeView === 'listar' ? 'active' : ''}`}
            onClick={() => setActiveView('listar')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
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

      {/* Main Content */}
      <main className="main-content">
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {activeView === 'iniciar' && (
          <div className="content-wrapper">
            <h1>Iniciar Processos</h1>
            <p className="subtitle">Gerencie e inicie processos do sistema</p>

            <form onSubmit={handleIniciarProcesso} className="form">
              <div className="form-group">
                <label htmlFor="machineId">
                  ID da Máquina <span className="optional">(Obrigatório)</span>
                </label>
                <input
                  type="text"
                  id="machineId"
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  placeholder="Digite o ID da máquina"
                  className="input"
                />
                <small className="help-text">Ex: MACH-001, SERVER-02</small>
              </div>

              <div className="form-group">
                <label htmlFor="processType">Tipo de Processo</label>
                <select
                  id="processType"
                  value={processType}
                  onChange={(e) => setProcessType(e.target.value)}
                  className="select"
                >
                  <option value="CDR Analysis">CDR Analysis</option>
                  <option value="Data Processing">Data Processing</option>
                  <option value="Report Generation">Report Generation</option>
                  <option value="System Maintenance">System Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="parameters">
                  Parâmetros <span className="optional">(Opcional)</span>
                </label>
                <textarea
                  id="parameters"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  placeholder="Insira os parâmetros aqui no formato JSON ou chave=valor"
                  className="textarea"
                  rows="5"
                />
              </div>

              <div className="recent-section">
                <h3>Processos Recentes</h3>
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="9"/>
                  </svg>
                  <p>
                    {processos.length === 0
                      ? 'Nenhum processo recente'
                      : `${processos.length} processo(s) iniciado(s)`}
                  </p>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar Processo'}
              </button>
            </form>
          </div>
        )}

        {activeView === 'parar' && (
          <div className="content-wrapper">
            <h1>Parar Processos</h1>
            <p className="subtitle">Interrompa processos em execução</p>

            <div className="process-list">
              {processos.filter(p => p.status === 'iniciado').length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                  <p>Nenhum processo em execução</p>
                </div>
              ) : (
                processos
                  .filter(p => p.status === 'iniciado')
                  .map(processo => (
                    <div key={processo.id} className="process-card">
                      <div className="process-info">
                        <div className="process-header">
                          <span className="process-type">{processo.processType}</span>
                          <span className={`status-badge ${processo.status}`}>{processo.status}</span>
                        </div>
                        <div className="process-details">
                          <span>ID: {processo.id}</span>
                          <span>Máquina: {processo.machineId}</span>
                          <span>Iniciado: {new Date(processo.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                      <button
                        className="btn-danger"
                        onClick={() => handlePararProcesso(processo.id)}
                      >
                        Parar
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {activeView === 'listar' && (
          <div className="content-wrapper">
            <h1>Listar Processos</h1>
            <p className="subtitle">Visualize todos os processos do sistema</p>

            <div className="process-list">
              {processos.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                  <p>Nenhum processo encontrado</p>
                </div>
              ) : (
                processos.map(processo => (
                  <div key={processo.id} className="process-card">
                    <div className="process-info">
                      <div className="process-header">
                        <span className="process-type">{processo.processType}</span>
                        <span className={`status-badge ${processo.status}`}>{processo.status}</span>
                      </div>
                      <div className="process-details">
                        <span>ID: {processo.id}</span>
                        <span>Máquina: {processo.machineId}</span>
                        <span>Iniciado: {new Date(processo.createdAt).toLocaleString('pt-BR')}</span>
                        {processo.stoppedAt && (
                          <span>Parado: {new Date(processo.stoppedAt).toLocaleString('pt-BR')}</span>
                        )}
                      </div>
                      {processo.parameters && Object.keys(processo.parameters).length > 0 && (
                        <div className="process-params">
                          <strong>Parâmetros:</strong> {JSON.stringify(processo.parameters)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
