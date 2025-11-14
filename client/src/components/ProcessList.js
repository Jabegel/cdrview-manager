import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function ProcessList() {
  const [processos, setProcessos] = useState([]);

  async function load() {
    try {
      const res = await api.listarProcessos();
      setProcessos(res.processos || []);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar processos');
    }
  }

  useEffect(() => { load(); }, []);

  async function handleStart(p) {
    await api.iniciarProcesso({ host: p.maquina, processo: p.processo, argumento: '' });
    await load();
  }

  async function handleStop(p) {
    await api.pararProcesso({ parar: [{ hosts: p.maquina, processo: p.processo, pid: p.pid ? String(p.pid) : '' }] });
    await load();
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Processos</h2>
        <button className="btn btn-outline-secondary" onClick={load}>Atualizar</button>
      </div>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr><th>Processo</th><th>PID</th><th>Máquina</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {processos.map(p => (
            <tr key={p.id}>
              <td>{p.processo}</td>
              <td>{p.pid || '-'}</td>
              <td>{p.maquina}</td>
              <td>{p.status}</td>
              <td>
                {p.status === 'stopped' && <button className="btn btn-sm btn-success me-2" onClick={() => handleStart(p)}>Iniciar</button>}
                {p.status === 'running' && <button className="btn btn-sm btn-danger" onClick={() => handleStop(p)}>Parar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
