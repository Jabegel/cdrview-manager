import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Gerenciador de CDRView</h2>
      <nav className="sidebar-nav">
        <Link to="/stop" className="nav-link">
          Parar Processos
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
