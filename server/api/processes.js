import { Router } from "express";
const router = Router();

// Fake data (mock)
let processes = [
  {
    id: 1,
    name: "CDR Processing - SP",
    status: "running",
    start: "2025-01-15T10:00:00Z",
    end: null,
    description: "Processes CDRs for São Paulo region"
  },
  {
    id: 2,
    name: "CDR Processing - RJ",
    status: "stopped",
    start: "2025-01-12T08:00:00Z",
    end: "2025-01-12T18:00:00Z",
    description: "Processes CDRs for Rio de Janeiro region"
  }
];

const logs = {
  1: [{ timestamp: "2025-01-15T10:01:00Z", message: "Process started" }],
  2: [{ timestamp: "2025-01-12T08:01:00Z", message: "Process started" }]
};

// Get details
router.get("/:id", (req, res) => {
  const process = processes.find(x => x.id == req.params.id);
  if (!process) return res.status(404).json({ error: "Process not found" });
  res.json(process);
});

// Get logs
router.get("/:id/logs", (req, res) => {
  res.json(logs[req.params.id] || []);
});

// Start process
router.post("/:id/start", (req, res) => {
  const process = processes.find(x => x.id == req.params.id);
  if (!process) return res.status(404).json({ error: "Process not found" });

  process.status = "running";
  process.start = new Date().toISOString();
  process.end = null;

  logs[req.params.id] = logs[req.params.id] || [];
  logs[req.params.id].push({
    timestamp: new Date().toISOString(),
    message: "Process started manually"
  });

  res.json({ success: true });
});

// Stop process
router.post("/:id/stop", (req, res) => {
  const process = processes.find(x => x.id == req.params.id);
  if (!process) return res.status(404).json({ error: "Process not found" });

  process.status = "stopped";
  process.end = new Date().toISOString();

  logs[req.params.id] = logs[req.params.id] || [];
  logs[req.params.id].push({
    timestamp: new Date().toISOString(),
    message: "Process stopped manually"
  });

  res.json({ success: true });
});

export default router;
