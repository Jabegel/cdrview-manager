import React from 'react';
import Sidebar from './components/Sidebar'; 
import ListProcesses from './pages/ListProcesses'; 

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content-area">
        <ListProcesses />
      </main>
    </div>
  );
}

export default App;