
import React from 'react';

export default function Sidebar({setScreen}){
 return(
   <div className="sidebar">
     <h4>CDRView Manager</h4>
     <div className="nav-item" onClick={()=>setScreen("start")}>Iniciar Processos</div>
     <div className="nav-item" onClick={()=>setScreen("stop")}>Parar Processos</div>
     <div className="nav-item" onClick={()=>setScreen("processes")}>Processos</div>
     <hr/>
     <div className="nav-item" onClick={()=>setScreen("configs")}>Configurações</div>
   </div>
 )
}
