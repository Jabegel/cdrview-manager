import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StopProcess.css";

const StopProcess = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmProcess, setConfirmProcess] = useState(null);
  const API_BASE = "http://localhost:6869/cdrview/processo";

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/listar`, {});
      setProcesses(res.data.processes || []);
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
    } finally {
      setLoading(false);
    }
  };

  const stopProcess = async (process) => {
    try {
      const payload = {
        parar: [
          {
            hosts: process.host,
            processo: process.name,
            pid: process.pid,
          },
        ],
      };
      await axios.post(`${API_BASE}/parar`, payload);
      alert(`Processo ${process.name} parado com sucesso!`);
      setConfirmProcess(null);
      fetchProcesses();
    } catch (error) {
      console.error("Erro ao parar processo:", error);
      alert("Erro ao parar o processo.");
    }
  };

  return (
    <div className="stop-page">
      <h1 className="page-title">Parar Processos</h1>

      {loading ? (
        <p>Carregando processos...</p>
      ) : (
        <div className="table-container">
          <table className="process-table">
            <thead>
              <tr>
                <th>Host</th>
                <th>Processo</th>
                <th>PID</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {processes.length > 0 ? (
                processes.map((proc, index) => (
                  <tr key={index}>
                    <td>{proc.host}</td>
                    <td>{proc.name}</td>
                    <td>{proc.pid}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          proc.status === "Running" ? "running" : "stopped"
                        }`}
                      >
                        {proc.status === "Running" ? "Rodando" : "Parado"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-stop"
                        onClick={() => setConfirmProcess(proc)}
                      >
                        Parar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhum processo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {confirmProcess && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar Ação</h3>
            <p>
              Deseja realmente parar o processo{" "}
              <strong>{confirmProcess.name}</strong> no host{" "}
              <strong>{confirmProcess.host}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setConfirmProcess(null)}
              >
                Cancelar
              </button>
              <button
                className="btn-confirm"
                onClick={() => stopProcess(confirmProcess)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StopProcess;
