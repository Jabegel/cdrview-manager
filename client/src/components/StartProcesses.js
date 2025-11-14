import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function StartProcesses(){
  const [configs, setConfigs] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [manual, setManual] = useState({ host:'', processo:'', argumento:'' });

  useEffect(() => { (async ()=>{ try{ const c = await api.getConfiguracoes(); setConfigs(c.configuracoes || []); const h = await api.listarHosts(); setHosts(h.servidores || []); }catch(e){ console.error(e); } })(); },[]);

  function toggle(name){ const s = new Set(selected); s.has(name) ? s.delete(name) : s.add(name); setSelected(s); }

  async function startSelected(){
    if(selected.size === 0) return alert('Selecione ao menos uma configuração');
    for(const name of selected){
      const cfg = configs.find(x => x.nome === name);
      const body = cfg && cfg.iniciar ? cfg.iniciar : { host: cfg.servidor, processo: cfg.processo, argumento: cfg.argumentos || '' };
      await api.iniciarProcesso(body);
    }
    alert('Solicitações enviadas');
  }

  async function startManual(){
    if(!manual.host || !manual.processo) return alert('Preencha host e processo');
    await api.iniciarProcesso({ host: manual.host, processo: manual.processo, argumento: manual.argumento });
    alert('Processo iniciado (manual)');
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Iniciar Processos</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => { setSelected(new Set()); }}>Limpar seleção</button>
          <button className="btn btn-primary" onClick={startSelected}>Iniciar Selecionados</button>
        </div>
      </div>

      <h5>Por Configurações</h5>
      <table className="table table-hover">
        <thead className="table-dark"><tr><th></th><th>Nome</th><th>Processo</th><th>Servidor</th><th>Central</th><th>Args</th></tr></thead>
        <tbody>
          {configs.map(c => (
            <tr key={c.nome}>
              <td><input type="checkbox" checked={selected.has(c.nome)} onChange={() => toggle(c.nome)} /></td>
              <td>{c.nome}</td>
              <td>{c.processo}</td>
              <td>{c.servidor}</td>
              <td>{c.central}</td>
              <td><small>{c.argumentos}</small></td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr/>

      <h5>Manual</h5>
      <div className="row mb-3">
        <div className="col-md-4"><select className="form-select" value={manual.host} onChange={e=>setManual({...manual, host: e.target.value})}><option value="">Selecione host</option>{hosts.map(h=> <option key={h} value={h}>{h}</option>)}</select></div>
        <div className="col-md-4"><input className="form-control" placeholder="processo.exe" value={manual.processo} onChange={e=>setManual({...manual, processo: e.target.value})} /></div>
        <div className="col-md-4"><input className="form-control" placeholder="argumentos (opcional)" value={manual.argumento} onChange={e=>setManual({...manual, argumento: e.target.value})} /></div>
      </div>
      <button className="btn btn-success" onClick={startManual}>Iniciar Manual</button>
    </div>
  );
}
