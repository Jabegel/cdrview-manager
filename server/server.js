import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const app = express();
app.use(express.json());

// Carregamento da configuração (local/remote)
const cfgPath = path.join(process.cwd(), 'server', 'config', 'server-config.json');
let cfg = { mode: 'local', host: 'localhost', port: 3000 };

try {
  cfg = JSON.parse(fs.readFileSync(cfgPath));
} catch (e) {
  console.warn('Config não encontrada, usando modo local.');
}

// Caminhos do banco de dados local (JSON)
const dbDir = path.join(process.cwd(), 'server', 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const configsDb = path.join(dbDir, 'configs.json');
const processosDb = path.join(dbDir, 'processos.json');


// Funções utilitárias de leitura e escrita JSON
function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p));
  } catch (e) {
    return [];
  }
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}


// Inicialização dos arquivos JSON, se não existirem
if (!fs.existsSync(configsDb)) {
  writeJson(configsDb, [
    {
      id: 1,
      nome: "p_cfgHUAWEI",
      exe: "parsergen.exe",
      servidor: "Machine01",
      central: "HBBH",
      argumentos: "--type=cdr --central=HBBH"
    }
  ]);
}

if (!fs.existsSync(processosDb)) {
  writeJson(processosDb, [
    {
      id: 1,
      configId: 1,
      pid: 1234,
      servidor: "Machine01",
      status: "running",
      inicio: "2025-10-10 10:00",
      duracao: "2h",
      configNome: "p_cfgHUAWEI",
      processo: "parsergen.exe",
      argumentos: "--type=cdr --central=HBBH"
    }
  ]);
}


// Proxy para servidor real (CDRView) no modo remote
async function proxyToRemote(req, res, remotePath) {
  const url = `http://${cfg.host}:${cfg.port}${remotePath}`;
  try {
    const response = await axios({
      method: req.method.toLowerCase(),
      url,
      data: req.body,
      params: req.query,
      headers: { 'Content-Type': 'application/json' }
    });

    return res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}


// Rotas de CONFIGURAÇÕES (CRUD)

// Lista configs
app.get('/api/configs/list', (req, res) => {
  res.json({ configs: readJson(configsDb) });
});

// Cria config
app.post('/api/configs/create', (req, res) => {
  const body = req.body || {};
  const all = readJson(configsDb);

  const id = Date.now();
  const cfgObj = {
    id,
    nome: body.nome,
    exe: body.exe,
    servidor: body.servidor,
    central: body.central,
    argumentos: body.argumentos
  };

  all.push(cfgObj);
  writeJson(configsDb, all);

  // Vincula processo inicial
  const procs = readJson(processosDb);
  procs.push({
    id: Date.now(),
    configId: cfgObj.id,
    pid: null,
    servidor: cfgObj.servidor,
    status: 'stopped',
    inicio: null,
    configNome: cfgObj.nome,
    processo: cfgObj.exe,
    argumentos: cfgObj.argumentos
  });
  writeJson(processosDb, procs);

  res.json({ message: 'Criado', cfg: cfgObj });
});

// Atualiza config
app.post('/api/configs/update', (req, res) => {
  const body = req.body || {};
  let all = readJson(configsDb);

  all = all.map(c => c.id === body.id ? { ...c, ...body } : c);
  writeJson(configsDb, all);

  res.json({ message: 'Atualizado' });
});

// Remove config e processos vinculados
app.post('/api/configs/delete', (req, res) => {
  const body = req.body || {};

  let all = readJson(configsDb);
  all = all.filter(c => c.id !== body.id);
  writeJson(configsDb, all);

  let procs = readJson(processosDb);
  procs = procs.filter(p => p.configId !== body.id);
  writeJson(processosDb, procs);

  res.json({ message: 'Removido' });
});

// PROCESSOS (LOCAL / REMOTE)

// Lista processos
app.get('/api/processos/list', (req, res) => {
  if (cfg.mode === 'remote') {
    return proxyToRemote(req, res, '/cdrview/processo/listar');
  }
  return res.json({ processos: readJson(processosDb) });
});

// Iniciar processo
app.post('/api/processos/start', (req, res) => {
  if (cfg.mode === 'remote') {
    return proxyToRemote(req, res, '/cdrview/processo/iniciar');
  }

  const body = req.body || {};
  let procs = readJson(processosDb);

  let target = procs.find(p => p.configId === body.configId);

  if (!target && body.host) {
    target = procs.find(p => p.servidor === body.host);
  }

  if (!target) {
    return res.status(404).json({ error: 'Não encontrado' });
  }

  target.status = 'running';
  target.pid = Math.floor(Math.random() * 90000) + 1000;
  target.inicio = new Date().toLocaleString();

  writeJson(processosDb, procs);

  res.json({ message: 'Iniciado', target });
});

// Parar processo
app.post('/api/processos/stop', (req, res) => {
  if (cfg.mode === 'remote') {
    return proxyToRemote(req, res, '/cdrview/processo/parar');
  }

  const body = req.body || {};
  let procs = readJson(processosDb);

  let target = procs.find(p => p.configId === body.configId);

  if (!target && body.host) {
    target = procs.find(p => p.servidor === body.host);
  }

  if (!target) {
    return res.status(404).json({ error: 'Não encontrado' });
  }

  target.status = 'stopped';
  target.pid = null;

  writeJson(processosDb, procs);

  res.json({ message: 'Parado', target });
});


// PROXY FINAL CORRIGIDO (SEM LOOP INFINITO)

// Iniciar via proxy
app.post('/api/proxy/iniciar', (req, res) => {
  if (cfg.mode === 'remote') {
    return proxyToRemote(req, res, '/cdrview/processo/iniciar');
  }

  req.url = '/api/processos/start';
  return app._router.handle(req, res);
});

// Parar via proxy
app.post('/api/proxy/parar', (req, res) => {
  if (cfg.mode === 'remote') {
    return proxyToRemote(req, res, '/cdrview/processo/parar');
  }

  req.url = '/api/processos/stop';
  return app._router.handle(req, res);
});

// Hosts / Centrais

// Hosts
app.get('/api/config/hosts', (req, res) => {
  if (cfg.mode === 'remote') {
    return proxyToRemote(req, res, '/cdrview/processo/configuracao/hosts');
  }

  const all = readJson(configsDb);
  const hosts = [...new Set(all.map(c => c.servidor).filter(Boolean))];

  res.json({ servidores: hosts.length ? hosts : ['Machine01', 'Machine02'] });
});

// Centrais
app.get('/api/config/centrais', (req, res) => {
  if (cfg.mode === 'remote') {
    return proxyToRemote(req, res, '/cdrview/processo/configuracao/centrais');
  }

  const all = readJson(configsDb);
  const centrais = all.map(c => ({
    nome: c.central,
    servidor: c.servidor
  }));

  res.json({ centrais });
});


// Servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port} - mode=${cfg.mode}`);
});
