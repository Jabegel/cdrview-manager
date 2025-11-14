import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const app = express();
app.use(express.json());

const cfgPath = path.join(process.cwd(), 'server', 'config', 'server-config.json');
let cfg = { mode: 'local', host: 'localhost', port: 3000 };
try { cfg = JSON.parse(fs.readFileSync(cfgPath)); } catch(e){ console.warn('no cfg'); }

const dbDir = path.join(process.cwd(), 'server', 'database');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const configsDb = path.join(dbDir, 'configs.json');
const processosDb = path.join(dbDir, 'processos.json');

function readJson(p){ try { return JSON.parse(fs.readFileSync(p)); } catch(e){ return []; } }
function writeJson(p,data){ fs.writeFileSync(p, JSON.stringify(data, null, 2)); }

if (!fs.existsSync(configsDb)) writeJson(configsDb, [{ "id": 1, "nome": "p_cfgHUAWEI", "exe": "parsergen.exe", "servidor": "Machine01", "central": "HBBH", "argumentos": "--type=cdr --central=HBBH" }]);
if (!fs.existsSync(processosDb)) writeJson(processosDb, [{ "id": 1, "configId": 1, "pid": 1234, "servidor": "Machine01", "status": "running", "inicio": "2025-10-10 10:00", "duracao":"2h", "configNome":"p_cfgHUAWEI", "processo":"parsergen.exe", "argumentos":"--type=cdr --central=HBBH" }]);

// Helper to proxy to remote CDRView endpoints when cfg.mode==='remote'
async function proxyToRemote(req, res, remotePath) {
  const url = `http://${cfg.host}:${cfg.port}${remotePath}`;
  try {
    const resp = await axios({ method: req.method.toLowerCase(), url, data: req.body, params: req.query, headers: {'Content-Type':'application/json'} });
    return res.status(resp.status).json(resp.data);
  } catch(err) {
    console.error('proxy error', err.message);
    return res.status(500).json({ error: err.message });
  }
}

// === Configs CRUD (local persistence) ===
app.get('/api/configs/list', (req,res)=> res.json({ configs: readJson(configsDb) }));

app.post('/api/configs/create', (req,res)=>{
  const body = req.body || {};
  const all = readJson(configsDb);
  const id = Date.now();
  const cfgObj = { id, nome: body.nome, exe: body.exe, servidor: body.servidor, central: body.central, argumentos: body.argumentos };
  all.push(cfgObj); writeJson(configsDb, all);
  const procs = readJson(processosDb); procs.push({ id: Date.now(), configId: cfgObj.id, pid: null, servidor: cfgObj.servidor, status: 'stopped', inicio: null, configNome: cfgObj.nome, processo: cfgObj.exe, argumentos: cfgObj.argumentos }); writeJson(processosDb, procs);
  res.json({ message: 'Criado', cfg: cfgObj });
});

app.post('/api/configs/update', (req,res)=>{ const body=req.body||{}; let all=readJson(configsDb); all = all.map(c=> c.id===body.id ? Object.assign(c, body) : c); writeJson(configsDb, all); res.json({ message: 'Atualizado' }); });
app.post('/api/configs/delete', (req,res)=>{ const body=req.body||{}; let all=readJson(configsDb); all=all.filter(c=> c.id!==body.id); writeJson(configsDb, all); let procs=readJson(processosDb); procs=procs.filter(p=> p.configId!==body.id); writeJson(processosDb, procs); res.json({ message: 'Removido' }); });

// === Processos (local) ===
app.get('/api/processos/list', (req,res)=> {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/listar');
  return res.json({ processos: readJson(processosDb) });
});

app.post('/api/processos/start', (req,res)=> {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/iniciar');
  const body = req.body || {};
  let procs = readJson(processosDb);
  let target = null;
  if (body.configId) target = procs.find(p=> p.configId === body.configId);
  if (!target && body.host) target = procs.find(p=> p.servidor === body.host);
  if (target) { target.status='running'; target.pid = Math.floor(Math.random()*90000)+1000; target.inicio = new Date().toLocaleString(); writeJson(processosDb, procs); return res.json({ message: 'Iniciado', target }); }
  res.status(404).json({ error: 'Não encontrado' });
});

app.post('/api/processos/stop', (req,res)=> {
  if (cfg.mode === 'remote') return proxyToRemote(req, res, '/cdrview/processo/parar');
  const body = req.body || {};
  let procs = readJson(processosDb);
  let target = null;
  if (body.configId) target = procs.find(p=> p.configId === body.configId);
  if (!target && body.host) target = procs.find(p=> p.servidor === body.host);
  if (target) { target.status='stopped'; target.pid = null; writeJson(processosDb, procs); return res.json({ message: 'Parado', target }); }
  res.status(404).json({ error: 'Não encontrado' });
});

// === Proxy endpoints used by front for direct remote actions ===
app.post('/api/proxy/iniciar', (req,res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req,res,'/cdrview/processo/iniciar');
  // emulate by calling local /api/processos/start
  return app.handle(req, res, ()=>{});
});
app.post('/api/proxy/parar', (req,res) => {
  if (cfg.mode === 'remote') return proxyToRemote(req,res,'/cdrview/processo/parar');
  return app.handle(req, res, ()=>{});
});

// === Helpers for config hosts/centrais (remote or derived locally) ===
app.get('/api/config/hosts', (req,res)=> {
  if (cfg.mode === 'remote') return proxyToRemote(req,res,'/cdrview/processo/configuracao/hosts');
  const all = readJson(configsDb); const hosts = [...new Set(all.map(c=> c.servidor).filter(Boolean))]; return res.json({ servidores: hosts.length ? hosts : ['Machine01','Machine02'] });
});
app.get('/api/config/centrais', (req,res)=> {
  if (cfg.mode === 'remote') return proxyToRemote(req,res,'/cdrview/processo/configuracao/centrais');
  const all = readJson(configsDb); const centrais = all.map(c => ({ nome: c.central, servidor: c.servidor })); return res.json({ centrais });
});

// === server init ===
const port = 3000;
app.listen(port, ()=> console.log(`Server listening on ${port} - mode=${cfg.mode}`));