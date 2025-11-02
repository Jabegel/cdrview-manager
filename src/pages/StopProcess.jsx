import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StopProcess.css";

const StopProcess = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmProcess, setConfirmProcess] = useState(null);
  const API_BASE = "http://127.0.0.1:6869/cdrview/processo";

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

  const stopProcess = async (process, force = false) => {
    try {
      // Atualiza status visual para "Stopping"
      setProcesses((prev) =>
        prev.map((p) =>
          p.name === process.name ? { ...p, status: "Stopping" } : p
        )
      );

      const endpoint = force ? `${API_BASE}/forcar` : `${API_BASE}/parar`;
      const payload = {
        parar: [
          {
            hosts: process.host,
            processo: process.name,
            pid: process.pid,
          },
        ],
      };

      await axios.post(endpoint, payload);

      // Atualiza status visual para "Stopped"
      setProcesses((prev) =>
        prev.map((p) =>
          p.name === process.name ? { ...p, status: "Stopped" } : p
        )
      );

      alert(
        `Processo ${process.name} ${
          force ? "forçado a parar" : "parado"
        } com sucesso!`
      );
      setConfirmProcess(null);
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
                <th>Ações</th>
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
                          proc.status === "Running"
                            ? "running"
                            : proc.status === "Stopping"
                            ? "stopping"
                            : "stopped"
                        }`}
                      >
                        {proc.status === "Running"
                          ? "Rodando"
                          : proc.status === "Stopping"
                          ? "Parando..."
                          : "Parado"}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="btn-stop"
                        onClick={() => setConfirmProcess(proc)}
                      >
                        Parar
                      </button>
                      <button
                        className="btn-force"
                        onClick={() => stopProcess(proc, true)}
                      >
                        Forçar
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
