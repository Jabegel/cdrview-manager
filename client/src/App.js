import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Processes from './components/Processes';
import StartProcesses from './components/StartProcesses';
import StopProcesses from './components/StopProcesses';
import ConfigList from './components/ConfigList';
import ConfigForm from './components/ConfigForm';
import Details from './components/Details';

export default function App(){
  const [screen, setScreen] = useState('start');
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [editingConfig, setEditingConfig] = useState(null);

  return (
    <div className="d-flex">
      <Sidebar setScreen={setScreen} />
      <div className="flex-grow-1 p-4">
        {screen === 'start' && <StartProcesses />}
        {screen === 'stop' && <StopProcesses />}
        {screen === 'processes' && <Processes setSelectedProcess={setSelectedProcess} setScreen={setScreen} />}
        {screen === 'configs' && <ConfigList setEditingConfig={setEditingConfig} setScreen={setScreen} />}
        {screen === 'new-config' && <ConfigForm setScreen={setScreen} editingConfig={editingConfig} />}
        {screen === 'details' && <Details process={selectedProcess} />}
      </div>
    </div>
  );
}
