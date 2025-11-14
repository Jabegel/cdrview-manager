// Exemplo: servidor Node/Express para CDRView Manager (modo local + proxy remote)
// Usa JSON local para persistência (server/database) e implementa endpoints conforme documentação.
import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Exemplo: carregar configuração de modo (local/remote)
const cfgPath = path.join(process.cwd(), 'server', 'config', 'server-config.json');
let cfg = { mode: 'local', host: 'localhost', port: 6869 };
try { cfg = JSON.parse(fs.readFileSync(cfgPath)); } catch(e){ console.warn('Config não encontrada, usando modo local'); }

// Exemplo: diretório de dados local
const dbDir = path.join(process.cwd(), 'server', 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const configsDb = path.join(dbDir, 'configs.json');
const processosDb = path.join(dbDir, 'processos.json');

// Exemplo: helpers simples para JSON
function readJson(p){ try { return JSON.parse(fs.readFileSync(p)); } catch(e) { return []; } }
function writeJson(p, data){ fs.writeFileSync(p, JSON.stringify(data, null, 2)); }

// Exemplo: inicializar arquivos se não existirem
if (!fs.existsSync(configsDb)) writeJson(configsDb, []);
if (!fs.existsSync(processosDb)) writeJson(processosDb, []);

// Exemplo: proxy para servidor remoto
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
    console.error('Proxy error', err.message);
    return res.status(500).json({ error: err.message });
  }
}

// Exemplo: endpoints de configuração (CRUD)
// Listar configurações
app.get('/api/configuracoes', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/configuracao');
  return res.json({ configuracoes: readJson(configsDb) });
});

// Criar configuração
app.post('/api/configuracoes', (req, res) => {
  const body = req.body || {};
  const all = readJson(configsDb);
  const id = Date.now();
  const item = { id, nome: body.nome, processo: body.processo, servidor: body.servidor, central: body.central, argumentos: body.argumentos };
  all.push(item);
  writeJson(configsDb, all);

  // criar processo associado em processos.json (stopped)
  const procs = readJson(processosDb);
  procs.push({ id: Date.now(), configId: item.id, pid: null, servidor: item.servidor, status: 'stopped', inicio: null, processo: item.processo, argumentos: item.argumentos, configNome: item.nome });
  writeJson(processosDb, procs);

  res.json({ message: 'ok', configuracao: item });
});

// Atualizar configuração
app.put('/api/configuracoes/:id', (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  let all = readJson(configsDb);
  all = all.map(c => c.id === id ? { ...c, ...body } : c);
  writeJson(configsDb, all);
  res.json({ message: 'atualizado' });
});

// Remover configuração
app.delete('/api/configuracoes/:id', (req, res) => {
  const id = Number(req.params.id);
  let all = readJson(configsDb);
  all = all.filter(c => c.id !== id);
  writeJson(configsDb, all);
  let procs = readJson(processosDb);
  procs = procs.filter(p => p.configId !== id);
  writeJson(processosDb, procs);
  res.json({ message: 'removido' });
});

// Endpoints de processos
// Listar processos
app.get('/api/processos', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/listar');
  return res.json({ processos: readJson(processosDb) });
});

// Iniciar processo (single -> aceita configId or host)
app.post('/api/processos/iniciar', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/iniciar');
  const body = req.body || {};
  let procs = readJson(processosDb);
  let target = null;
  if (body.configId) target = procs.find(p => p.configId === body.configId);
  if (!target && body.host) target = procs.find(p => p.servidor === body.host);
  if (!target) return res.status(404).json({ error: 'não encontrado' });
  target.status = 'running';
  target.pid = Math.floor(Math.random()*90000)+1000;
  target.inicio = new Date().toLocaleString();
  writeJson(processosDb, procs);
  return res.json({ message: 'iniciado', target });
});

// Iniciar múltiplos (hosts list) - conforme PDF opção de iniciar em várias máquinas
app.post('/api/processos/iniciar-multiplos', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/iniciar');
  const { hosts = [], processo = null, argumentos = null, configId = null } = req.body || {};
  const procs = readJson(processosDb);
  const created = [];
  hosts.forEach(h => {
    const id = Date.now() + Math.floor(Math.random()*1000);
    const cfgItem = configId ? (readJson(configsDb).find(c=>c.id===configId) || {}) : {};
    const exe = processo || cfgItem.processo || 'unknown.exe';
    const item = { id, configId: configId || null, pid: Math.floor(Math.random()*90000)+1000, servidor: h, status: 'running', inicio: new Date().toLocaleString(), duracao: null, configNome: cfgItem.nome || ('cfg-'+h), processo: exe, argumentos: argumentos || '' };
    procs.push(item);
    created.push(item);
  });
  writeJson(processosDb, procs);
  res.json({ message: 'iniciados', created });
});

// Parar processo (single)
app.post('/api/processos/parar', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/parar');
  const body = req.body || {};
  let procs = readJson(processosDb);
  let target = null;
  if (body.configId) target = procs.find(p => p.configId === body.configId);
  if (!target && body.host) target = procs.find(p => p.servidor === body.host);
  if (!target) return res.status(404).json({ error: 'não encontrado' });
  target.status = 'stopped';
  target.pid = null;
  writeJson(processosDb, procs);
  res.json({ message: 'parado', target });
});

// Parar múltiplos por pid ou hosts
app.post('/api/processos/parar-multiplos', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/parar');
  const { pids = [], hosts = [] } = req.body || {};
  let procs = readJson(processosDb);
  const stopped = [];
  procs = procs.map(p => {
    if ((pids.length && pids.includes(p.pid)) || (hosts.length && hosts.includes(p.servidor))) {
      p.status = 'stopped'; p.pid = null; stopped.push(p);
    }
    return p;
  });
  writeJson(processosDb, procs);
  res.json({ message: 'parados', stopped });
});

// Details
app.get('/api/processos/details', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/detalhes');
  const q = req.query || {};
  const id = q.id ? Number(q.id) : null;
  const pid = q.pid ? Number(q.pid) : null;
  const procs = readJson(processosDb);
  const proc = procs.find(p => (id && p.id === id) || (pid && p.pid === pid));
  if (!proc) return res.status(404).json({ error: 'não encontrado' });
  const details = { ...proc, logs: `Logs simulados para ${proc.processo} on ${proc.servidor}\nLinha1\nLinha2`, metrics: { cpu: Math.round(Math.random()*50), memoryMB: Math.round(Math.random()*200) } };
  res.json({ details });
});

// Hosts and centrais endpoints (simulation or proxy)
app.get('/api/processo/configuracao/hosts', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/configuracao/hosts');
  // simulate 64 hosts
  const hosts = Array.from({length:64}, (_,i)=>`host${String(i+1).padStart(2,'0')}`);
  res.json({ servidores: hosts });
});

app.get('/api/processo/configuracao/centrais', (req, res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/configuracao/centrais');
  // simulated centrais
  const centrais = [{nome:'HBBH', servidor:'host01'},{nome:'ERIC', servidor:'host02'},{nome:'ZTE', servidor:'host03'}];
  res.json({ centrais });
});

// Expor pasta client estática
app.use('/', express.static(path.join(process.cwd(), 'client')));

// Server start
const port = 3000;
app.listen(port, ()=> console.log('Server listening on', port, 'mode=', cfg.mode)); 
