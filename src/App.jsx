import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">CDRView Manager</h2>
      <nav className="flex flex-col gap-2">
        <Link
          to="/stop"
          className="hover:bg-gray-700 px-3 py-2 rounded transition"
        >
          Stop Processes
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
