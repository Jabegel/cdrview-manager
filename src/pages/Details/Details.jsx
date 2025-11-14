
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery(){ return new URLSearchParams(useLocation().search); }

export default function Details(){
  const q = useQuery();
  const id = q.get('id');
  const [detail, setDetail] = useState(null);

  useEffect(()=>{
    async function load() {
      if (!id) return;
      const resp = await fetch('/api/processos/details?id=' + id);
      if (resp.status !== 200) { setDetail(null); return; }
      const j = await resp.json();
      setDetail(j.details);
    }
    load();
  }, [id]);

  if (!detail) return <div><h2>Detalhes do Processo</h2><p>Nenhum detalhe encontrado.</p></div>;

  return (
    <div>
      <h2>Detalhes do Processo</h2>
      <div className="card p-3">
        <p><strong>Servidor:</strong> {detail.servidor}</p>
        <p><strong>PID:</strong> {detail.pid || '-'}</p>
        <p><strong>Status:</strong> {detail.status}</p>
        <p><strong>Início:</strong> {detail.inicio}</p>
        <p><strong>Duração:</strong> {detail.duracao || '-'}</p>
        <p><strong>Argumentos:</strong> {detail.argumentos}</p>
        <hr />
        <h5>Logs</h5>
        <textarea className="form-control" rows="8" readOnly value={detail.logs}></textarea>
        <hr />
        <h5>Métricas</h5>
        <p>CPU: {detail.metrics.cpu}%</p>
        <p>Memória: {detail.metrics.memoryMB} MB</p>
        <div className="mt-2"><button className="btn btn-sm btn-secondary" onClick={()=>window.location.reload()}>Atualizar</button></div>
      </div>
    </div>
  );
}
