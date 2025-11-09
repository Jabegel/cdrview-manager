import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do host CDRView (pode ser alterado via variável de ambiente)
const CDRVIEW_HOST = process.env.CDRVIEW_HOST || "localhost:6869";

// Armazenamento em memória dos processos (em produção, usar banco de dados)
let processos = [];
let processoIdCounter = 1;

// Rota de saúde
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Rota para iniciar processo
app.post("/api/processo/iniciar", async (req, res) => {
  try {
    const { machineId, processType, parameters } = req.body;

    // Validação básica
    if (!processType) {
      return res.status(400).json({ 
        success: false, 
        error: "Tipo de processo é obrigatório" 
      });
    }

    // Preparar dados para enviar ao CDRView
    const payload = {
      machineId: machineId || null,
      processType,
      parameters: parameters || {}
    };

    // Fazer requisição ao endpoint CDRView
    const cdrviewUrl = `http://${CDRVIEW_HOST}/cdrview/processo/iniciar`;
    
    // Simulação de resposta (em produção, fazer fetch real)
    // const response = await fetch(cdrviewUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // const data = await response.json();

    // Para demonstração, criar processo localmente
    const novoProcesso = {
      id: processoIdCounter++,
      machineId: machineId || "N/A",
      processType,
      parameters,
      status: "iniciado",
      createdAt: new Date().toISOString(),
      cdrviewUrl
    };

    processos.unshift(novoProcesso);

    res.json({
      success: true,
      message: "Processo iniciado com sucesso",
      processo: novoProcesso
    });

  } catch (error) {
    console.error("Erro ao iniciar processo:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao iniciar processo",
      details: error.message
    });
  }
});

// Rota para listar processos
app.get("/api/processos", (_req, res) => {
  res.json({
    success: true,
    processos: processos.slice(0, 50) // Limitar a 50 processos mais recentes
  });
});

// Rota para parar processo
app.post("/api/processo/parar/:id", (req, res) => {
  const { id } = req.params;
  const processo = processos.find(p => p.id === parseInt(id));

  if (!processo) {
    return res.status(404).json({
      success: false,
      error: "Processo não encontrado"
    });
  }

  processo.status = "parado";
  processo.stoppedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Processo parado com sucesso",
    processo
  });
});

// Rota para obter status do sistema
app.get("/api/status", (_req, res) => {
  res.json({
    success: true,
    status: "online",
    processosAtivos: processos.filter(p => p.status === "iniciado").length,
    totalProcessos: processos.length,
    cdrviewHost: CDRVIEW_HOST
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Backend CDRView Manager rodando em http://localhost:${port}`);
  console.log(`📡 CDRView Host configurado: ${CDRVIEW_HOST}`);
});
