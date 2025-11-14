import express from 'express';
import fs from 'fs';
import path from 'path';

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

// ensure files
if (!fs.existsSync(configsDb)) writeJson(configsDb, [{ "id": 1, "nome": "p_cfgHUAWEI", "exe": "parsergen.exe", "servidor": "host1", "central": "HBBH", "argumentos": "--type=cdr --central=HBBH" }]);
if (!fs.existsSync(processosDb)) writeJson(processosDb, [{ "id": 1, "configId": 1, "pid": 1234, "servidor": "host1", "status": "running", "inicio": "2025-10-31 10:00", "configNome":"p_cfgHUAWEI", "processo":"parsergen.exe", "argumentos":"--type=cdr --central=HBBH" }] );

// configs CRUD
app.get('/api/configs/list', (req,res)=> res.json({ configs: readJson(configsDb) }));

app.post('/api/configs/create', (req,res)=>{
  const body = req.body || {};
  const all = readJson(configsDb);
  const id = Date.now();
  const cfg = { id, nome: body.nome, exe: body.exe, servidor: body.servidor, central: body.central, argumentos: body.argumentos };
  all.push(cfg); writeJson(configsDb, all);
  // add process stub
  const procs = readJson(processosDb);
  procs.push({ id: Date.now(), configId: cfg.id, pid: null, servidor: cfg.servidor, status: 'stopped', inicio: null, configNome: cfg.nome, processo: cfg.exe, argumentos: cfg.argumentos });
  writeJson(processosDb, procs);
  res.json({ message: 'Criado', cfg });
});

app.post('/api/configs/update', (req,res)=>{
  const body = req.body || {};
  let all = readJson(configsDb);
  all = all.map(c=> c.id === body.id ? Object.assign(c, body) : c);
  writeJson(configsDb, all);
  res.json({ message: 'Atualizado' });
});

app.post('/api/configs/delete', (req,res)=>{
  const body = req.body || {};
  let all = readJson(configsDb); all = all.filter(c=> c.id !== body.id); writeJson(configsDb, all);
  let procs = readJson(processosDb); procs = procs.filter(p=> p.configId !== body.id); writeJson(processosDb, procs);
  res.json({ message: 'Removido' });
});

// processos endpoints
app.get('/api/processos/list', (req,res)=> res.json({ processos: readJson(processosDb) }));

app.post('/api/processos/start', (req,res)=>{
  const body = req.body || {};
  const procs = readJson(processosDb);
  let target = null;
  if (body.configId) target = procs.find(p=> p.configId === body.configId);
  if (!target && body.host) target = procs.find(p=> p.servidor === body.host);
  if (target) { target.status='running'; target.pid = Math.floor(Math.random()*90000)+1000; target.inicio = new Date().toLocaleString(); writeJson(processosDb, procs); return res.json({ message: 'Iniciado', target }); }
  return res.status(404).json({ error: 'Não encontrado' });
});

app.post('/api/processos/stop', (req,res)=>{
  const body = req.body || {};
  const procs = readJson(processosDb);
  let target = null;
  if (body.configId) target = procs.find(p=> p.configId === body.configId);
  if (!target && body.host) target = procs.find(p=> p.servidor === body.host);
  if (target) { target.status='stopped'; target.pid = null; writeJson(processosDb, procs); return res.json({ message: 'Parado', target }); }
  return res.status(404).json({ error: 'Não encontrado' });
});

// helpers
app.get('/api/config/hosts', (req,res)=>{
  const all = readJson(configsDb);
  const hosts = [...new Set(all.map(c=> c.servidor).filter(Boolean))];
  res.json({ servidores: hosts.length ? hosts : ['host1','host2','host3'] });
});
app.get('/api/config/centrais', (req,res)=>{
  const all = readJson(configsDb);
  const centrais = all.map(c => ({ nome: c.central, servidor: c.servidor }));
  res.json({ centrais });
});

const port = 3000;
app.listen(port, ()=> console.log(`Server running on ${port}`));