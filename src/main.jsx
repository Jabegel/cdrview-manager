import React from 'react'
import { createRoot } from 'react-dom/client'
import Start from './pages/Start/Start'
import Stop from './pages/Stop/Stop'
import List from './pages/List/List'
import Configs from './pages/Configs/Configs'
import Details from './pages/Details/Details'

function App() {
  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>CDRView Manager (local)</h1>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:1,border:'1px solid #ddd',padding:10}}>
          <h2>Start</h2>
          <Start />
        </div>
        <div style={{flex:1,border:'1px solid #ddd',padding:10}}>
          <h2>Stop</h2>
          <Stop />
        </div>
        <div style={{flex:1,border:'1px solid #ddd',padding:10}}>
          <h2>List</h2>
          <List />
        </div>
      </div>
      <div style={{display:'flex',gap:20, marginTop:20}}>
        <div style={{flex:1,border:'1px solid #ddd',padding:10}}>
          <h2>Configs</h2>
          <Configs />
        </div>
        <div style={{flex:1,border:'1px solid #ddd',padding:10}}>
          <h2>Details</h2>
          <Details />
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)