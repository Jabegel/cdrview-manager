import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function StopProcesses(){
  const [list, setList] = useState([]);

  async function load(){ try{ const r = await api.listarProcessos(); setList(r.processos || []); }catch(e){ console.error(e); } }

  useEffect(()=>{ load(); },[]);

  async function stop(p){
    if(!confirm(`Parar ${p.processo} em ${p.maquina}?`)) return;
    await api.pararProcesso({ parar: [{ hosts: p.maquina, processo: p.processo, pid: p.pid ? String(p.pid) : '' }] });
    await load();
  }

  return (
    <div>
      <h2>Parar Processos</h2>
      <table className="table table-striped">
        <thead className="table-dark"><tr><th>Processo</th><th>PID</th><th>Máquina</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id}>
              <td>{p.processo}</td>
              <td>{p.pid || '-'}</td>
              <td>{p.maquina}</td>
              <td>{p.status}</td>
              <td>{p.status === 'running' ? <button className="btn btn-sm btn-danger" onClick={() => stop(p)}>Parar</button> : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
