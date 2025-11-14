
import React,{useEffect,useState} from 'react';
import api from '../api/api';

export default function Start(){
 const [configs,setConfigs]=useState([]);
 const [hosts,setHosts]=useState([]);
 const [selected,setSelected]=useState(new Set());

 const [manualHost,setManualHost]=useState("");
 const [manualProc,setManualProc]=useState("");
 const [manualArg,setManualArg]=useState("");

 useEffect(()=>{ load(); },[]);
 async function load(){
   setConfigs((await api.listarConfigs()).configuracoes);
   setHosts((await api.listarHosts()).servidores);
 }

 function toggle(n){ const s=new Set(selected); s.has(n)?s.delete(n):s.add(n); setSelected(s); }

 async function startSelected(){
   for(const name of selected){
     const cfg=configs.find(c=>c.nome===name);
     await api.iniciar(cfg.iniciar);
   }
   alert("Iniciado");
 }

 async function startManual(){
   if(!manualHost || !manualProc) return alert("Complete todos os campos");
   await api.iniciar({host:manualHost,processo:manualProc,argumento:manualArg});
   alert("Criado e iniciado");
 }

 return(
  <div>
    <h2>Iniciar Processos</h2>

    <h4>Via Configurações</h4>
    <table className="table">
      <thead><tr><th></th><th>Nome</th><th>Processo</th><th>Host</th></tr></thead>
      <tbody>
        {configs.map(c=>
          <tr key={c.nome}>
            <td><input type='checkbox' onChange={()=>toggle(c.nome)} checked={selected.has(c.nome)}/></td>
            <td>{c.nome}</td>
            <td>{c.processo}</td>
            <td>{c.servidor}</td>
          </tr>
        )}
      </tbody>
    </table>

    <button className="btn btn-primary mb-4" onClick={startSelected}>Iniciar Selecionados</button>

    <h4>Criar Processo Manual</h4>
    <select className="form-control mb-2" value={manualHost} onChange={e=>setManualHost(e.target.value)}>
      <option value="">Selecione Host</option>
      {hosts.map(h=><option key={h}>{h}</option>)}
    </select>
    <input placeholder="processo.exe" className="form-control mb-2" value={manualProc} onChange={e=>setManualProc(e.target.value)}/>
    <input placeholder="argumentos..." className="form-control mb-2" value={manualArg} onChange={e=>setManualArg(e.target.value)}/>
    <button className="btn btn-success" onClick={startManual}>Iniciar Manual</button>
  </div>
 )
}
