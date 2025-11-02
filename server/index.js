import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let processes = [
  { host: "appl01", name: "ServicoIndexacao", pid: "2345", status: "Running" },
  { host: "appl02", name: "ParserGsm.exe", pid: "4567", status: "Running" },
  { host: "appl03", name: "ServicoBuscaIndice", pid: "6789", status: "Running" }
];

app.post("/cdrview/processo/listar", (req, res) => {
  res.json({ processes });
});

app.post("/cdrview/processo/parar", (req, res) => {
  const { parar } = req.body;
  if (!parar || !Array.isArray(parar)) {
    return res.status(400).json({ error: "Formato inválido" });
  }
  parar.forEach((p) => {
    processes = processes.filter((proc) => proc.name !== p.processo);
  });
  res.json({ success: true, message: "Processos parados com sucesso!" });
});

const port = process.env.PORT || 6869;
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});

app.post("/cdrview/processo/forcar", (req, res) => {
  const { parar } = req.body;
  if (!parar || !Array.isArray(parar)) {
    return res.status(400).json({ error: "Formato inválido" });
  }
  parar.forEach((p) => {
    processes = processes.filter((proc) => proc.name !== p.processo);
  });
  res.json({ success: true, message: "Processos forçados a parar!" });
});
