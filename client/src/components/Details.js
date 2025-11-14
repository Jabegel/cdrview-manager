import React from 'react';

export default function Details({ process }){
  if(!process) return <div>Nenhum processo selecionado</div>;
  return (
    <div>
      <h2>Detalhes do Processo</h2>
      <dl className="row">
        <dt className="col-sm-3">Processo</dt><dd className="col-sm-9">{process.processo}</dd>
        <dt className="col-sm-3">PID</dt><dd className="col-sm-9">{process.pid || '-'}</dd>
        <dt className="col-sm-3">Máquina</dt><dd className="col-sm-9">{process.maquina}</dd>
        <dt className="col-sm-3">Status</dt><dd className="col-sm-9">{process.status}</dd>
        <dt className="col-sm-3">Início</dt><dd className="col-sm-9">{process.inicio || '-'}</dd>
      </dl>
    </div>
  );
}
