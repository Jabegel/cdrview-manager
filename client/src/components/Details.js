
import React from 'react';

export default function Details({process}){
 if(!process) return <div>Nenhum processo selecionado</div>;
 return (
  <div>
    <h2>Detalhes do Processo</h2>
    <p><b>Processo:</b> {process.processo}</p>
    <p><b>PID:</b> {process.pid}</p>
    <p><b>Host:</b> {process.maquina}</p>
    <p><b>Status:</b> {process.status}</p>
    <p><b>Início:</b> {process.inicio}</p>
  </div>
 )
}
