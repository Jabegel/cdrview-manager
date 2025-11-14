import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProcessList from './components/ProcessList';
import ConfigList from './components/ConfigList';
import ConfigForm from './components/ConfigForm';

export default function App() {
  const [screen, setScreen] = useState('processes');

  return (
    <div className="d-flex">
      <Sidebar setScreen={setScreen} />
      <div className="flex-grow-1 p-4">
        {screen === 'processes' && <ProcessList />}
        {screen === 'configs' && <ConfigList setScreen={setScreen} />}
        {screen === 'new-config' && <ConfigForm setScreen={setScreen} />}
      </div>
    </div>
  );
}
