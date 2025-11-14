
import React,{useState} from 'react';
import Sidebar from './components/Sidebar';
import Start from './components/Start';
import Stop from './components/Stop';
import Processes from './components/Processes';
import Details from './components/Details';

export default function App(){
 const [screen,setScreen]=useState("start");
 const [selectedProcess,setSelectedProcess]=useState(null);

 return(
   <div className="d-flex">
     <Sidebar setScreen={setScreen}/>
     <div className="flex-grow-1 p-4">
       {screen==="start" && <Start/>}
       {screen==="stop" && <Stop/>}
       {screen==="processes" && <Processes setSelectedProcess={setSelectedProcess} setScreen={setScreen}/>}
       {screen==="details" && <Details process={selectedProcess} />}
     </div>
   </div>
 )
}
