
import React,{useEffect,useState} from 'react';
import api from '../api/api';

export default function Processes({setSelectedProcess,setScreen}){
 const [list,setList]=useState([]);

 useEffect(()=>{load();},[]);
 async function load(){ setList((await api.listarProcessos()).processos); }

 return(
  <div>
    <h2>Processos</h2>
    <table className="table">
      <thead><tr><th>Proc</th><th>PID</th><th>Host</th><th>Status</th><th></th></tr></thead>
      <tbody>
        {list.map(p=>
          <tr key={p.id}>
            <td>{p.processo}</td>
            <td>{p.pid}</td>
            <td>{p.maquina}</td>
            <td>{p.status}</td>
            <td>
              <button className='btn btn-info btn-sm' onClick={()=>{ setSelectedProcess(p); setScreen("details"); }}>
                Ver detalhes
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
 )
}
