import React, { useState, useEffect } from "react";
import axios from "axios";

const StopProcess = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmProcess, setConfirmProcess] = useState(null);
  const API_BASE = "http://localhost:6869/cdrview/processo";

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/listar`, {});
      setProcesses(res.data.processes || []);
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
    } finally {
      setLoading(false);
    }
  };

  const stopProcess = async (process) => {
    try {
      const payload = {
        parar: [
          {
            hosts: process.host,
            processo: process.name,
            pid: process.pid
          }
        ]
      };
      await axios.post(`${API_BASE}/parar`, payload);
      alert(`Process ${process.name} stopped successfully!`);
      setConfirmProcess(null);
      fetchProcesses();
    } catch (error) {
      console.error("Erro ao parar processo:", error);
      alert("Error stopping process.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Stop Processes</h1>
      {loading ? (
        <p>Loading processes...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2">Host</th>
                <th className="p-2">Process</th>
                <th className="p-2">PID</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {processes.length > 0 ? (
                processes.map((proc, i) => (
                  <tr key={i} className="text-center border-b hover:bg-gray-100">
                    <td className="p-2">{proc.host}</td>
                    <td className="p-2">{proc.name}</td>
                    <td className="p-2">{proc.pid}</td>
                    <td className="p-2 text-green-600 font-medium">{proc.status}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setConfirmProcess(proc)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Stop
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-gray-500">
                    No processes running.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {confirmProcess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-3">Confirm Stop</h2>
            <p>
              Are you sure you want to stop{" "}
              <strong>{confirmProcess.name}</strong> on{" "}
              <strong>{confirmProcess.host}</strong>?
            </p>
            <div className="flex justify-end gap-4 mt-5">
              <button
                onClick={() => setConfirmProcess(null)}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => stopProcess(confirmProcess)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StopProcess;
