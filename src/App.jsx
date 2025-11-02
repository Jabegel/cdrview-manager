import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import StopProcess from "./pages/StopProcess.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/stop" element={<StopProcess />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
