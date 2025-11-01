import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import StopProcess from "./pages/StopProcess";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6">
          <Routes>
            <Route path="/stop" element={<StopProcess />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
