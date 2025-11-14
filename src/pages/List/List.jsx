
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function List() {
  const [processos, setProcessos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const resp = await fetch('/api/processos/list');
      const j = await resp.json();
      setProcessos(j.processos || []);
    }
    load();
  }, []);

  // group by servidor
  const byHost = processos.reduce((acc, p) => {
    acc[p.servidor] = acc[p.servidor] || [];
    acc[p.servidor].push(p);
    return acc;
  }, {});

  return (
    <div>
      <h2>Listar Processos</h2>
      <div className="card p-3">
        {Object.keys(byHost).map(host => (
          <div key={host} className="mb-3">
            <h5>{host}</h5>
            <table className="table table-sm">
              <thead><tr><th>PID</th><th>Processo</th><th>Status</th><th>Início</th><th>Ações</th></tr></thead>
              <tbody>
                {byHost[host].map(p => (
                  <tr key={p.id}>
                    <td>{p.pid || '-'}</td>
                    <td>{p.processo}</td>
                    <td>{p.status}</td>
                    <td>{p.inicio || '-'}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={()=>navigate('/details?id='+p.id)}>Detalhes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
