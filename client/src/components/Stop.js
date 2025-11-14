
import React,{useEffect,useState} from 'react';
import api from '../api/api';

export default function Stop(){
 const [list,setList]=useState([]);
 useEffect(()=>{load();},[]);
 async function load(){ setList((await api.listarProcessos()).processos); }

 async function stop(p){ await api.parar({parar:[{hosts:p.maquina,processo:p.processo,pid:String(p.pid)}]}); load(); }

 return(
  <div>
    <h2>Parar Processos</h2>
    <table className="table">
     <thead><tr><th>Proc</th><th>PID</th><th>Host</th><th></th></tr></thead>
     <tbody>
      {list.map(p=>
       <tr key={p.id}>
         <td>{p.processo}</td>
         <td>{p.pid}</td>
         <td>{p.maquina}</td>
         <td><button className='btn btn-danger' onClick={()=>stop(p)}>Parar</button></td>
       </tr>
      )}
     </tbody>
    </table>
  </div>
 )
}
