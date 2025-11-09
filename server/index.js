// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ⚙️ Configurações básicas
const PORT = process.env.PORT || 4000;

// 🧠 Banco de dados em memória (simulação)
let processos = [];

// 🟢 STATUS DO SISTEMA
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    maquinasOnline: 4,
    timestamp: new Date().toISOString(),
  });
});

// 🚀 INICIAR PROCESSO
app.post('/api/processo/iniciar', (req, res) => {
  const { host, processo, argumento } = req.body;

  if (!host || !processo) {
    return res.status(400).json({ success: false, error: 'Host e processo são obrigatórios' });
  }

  const novoProcesso = {
    id: Math.floor(Math.random() * 100000).toString(),
    host,
    machineId: host,
    processType: processo,
    argumento: argumento || '',
    status: 'iniciado',
    createdAt: new Date().toISOString(),
    stoppedAt: null,
    parameters: argumento ? { argumento } : {},
  };

  processos.unshift(novoProcesso);
  console.log(`✅ Processo iniciado localmente: ${processo} em ${host}`);
  res.json({ success: true, processo: novoProcesso });
});

// 🛑 PARAR PROCESSO
app.post('/api/processo/parar', (req, res) => {
  const { parar } = req.body;
  if (!parar || !Array.isArray(parar)) {
    return res.status(400).json({ success: false, error: 'Formato inválido. Use { parar: [ { pid } ] }' });
  }

  parar.forEach((item) => {
    const pid = item.pid?.toString();
    const p = processos.find((proc) => proc.id === pid);
    if (p) {
      p.status = 'parado';
      p.stoppedAt = new Date().toISOString();
    }
  });

  console.log(`🟥 Processos parados: ${parar.map(p => p.pid).join(', ')}`);
  res.json({ success: true });
});

// 📋 LISTAR PROCESSOS
app.post('/api/processo/listar', (req, res) => {
  res.json({ success: true, processos });
});

// 🚀 Servidor online
app.listen(PORT, () => {
  console.log(`✅ Backend local CDRView Manager rodando em http://localhost:${PORT}`);
  console.log('📡 Modo simulado (sem conexão externa)');
});
