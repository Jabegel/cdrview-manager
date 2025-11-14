import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Processes({ setSelectedProcess, setScreen }){
  const [processos, setProcessos] = useState([]);

  async function load(){ try{ const res = await api.listarProcessos(); setProcessos(res.processos || []); }catch(e){ console.error(e); } }

  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Processos</h2>
        <button className="btn btn-outline-secondary" onClick={load}>Atualizar</button>
      </div>
      <table className="table table-striped">
        <thead className="table-dark"><tr><th>Processo</th><th>PID</th><th>Máquina</th><th>Status</th><th>Início</th><th></th></tr></thead>
        <tbody>
          {processos.map(p => (
            <tr key={p.id}>
              <td>{p.processo}</td>
              <td>{p.pid || '-'}</td>
              <td>{p.maquina}</td>
              <td>{p.status}</td>
              <td>{p.inicio || '-'}</td>
              <td><button className="btn btn-sm btn-info" onClick={() => { setSelectedProcess(p); setScreen('details'); }}>Ver detalhes</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
