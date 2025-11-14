import axios from 'axios';

// Environment-driven behavior:
// If SERVER_USE_MOCK is "true" (default), endpoints return mock data.
// Otherwise, they forward requests to the real CDRView API configured in CDRVIEW_BASE.
const USE_MOCK = (process.env.SERVER_USE_MOCK || 'true').toLowerCase() === 'true';
const CDRVIEW_BASE = process.env.CDRVIEW_BASE || 'http://host:6869/cdrview';

// In-memory mock storage
let mock_configuracoes = [
  { nome: 'p_cfgHUAWEI', central: 'HBBH', servidor: 'host1', processo: 'parsergen_Huawei.exe', argumentos: '--type=cdr --central=HBBH' },
  { nome: 'p_cfgERIC', central: 'ERIC', servidor: 'host2', processo: 'parsergen_Ericsson.exe', argumentos: '--type=cdr --central=ERIC' }
];

let mock_processos = [
  { id: 1, processo: 'parsergen_Huawei.exe', pid: 1234, maquina: 'host1', status: 'running', inicio: '2025-10-31 10:00' },
  { id: 2, processo: 'parsergen_Ericsson.exe', pid: null, maquina: 'host2', status: 'stopped', inicio: null }
];

const mock_servidores = ['host1','host2','host3','host4'];
const mock_centrais = [
  { nome: 'central_x', servidor: 'host1' },
  { nome: 'central_y', servidor: 'host2' },
  { nome: 'central_z', servidor: 'host3' }
];

// Helpers to proxy to real CDRView API
async function proxyGet(path) {
  const url = `${CDRVIEW_BASE}${path}`;
  const res = await axios.get(url);
  return res.data;
}
async function proxyPost(path, body) {
  const url = `${CDRVIEW_BASE}${path}`;
  const res = await axios.post(url, body);
  return res.data;
}

export async function listarHosts(req, res) {
  if (USE_MOCK) {
    return res.json({ servidores: mock_servidores });
  }
  try {
    const data = await proxyGet('/processo/configuracao/hosts');
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy hosts', details: err.message });
  }
}

export async function listarCentrais(req, res) {
  if (USE_MOCK) {
    return res.json({ centrais: mock_centrais });
  }
  try {
    const data = await proxyGet('/processo/configuracao/centrais');
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy centrais', details: err.message });
  }
}

export async function listarCentraisPorHost(req, res) {
  const host = req.params.host;
  if (USE_MOCK) {
    const cent = [
      { nome: `${host}_01`, servidor: host },
      { nome: `${host}_02`, servidor: host },
      { nome: `${host}_03`, servidor: host }
    ];
    return res.json({ centrais: cent });
  }
  try {
    const data = await proxyGet(`/processo/configuracao/centrais/${host}`);
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy centrais por host', details: err.message });
  }
}

export async function getConfiguracoes(req, res) {
  if (USE_MOCK) {
    return res.json({ configuracoes: mock_configuracoes });
  }
  try {
    const data = await proxyGet('/processo/configuracao');
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy configuracoes', details: err.message });
  }
}

export async function salvarConfig(req, res) {
  const body = req.body;
  if (USE_MOCK) {
    if (body && body.configuracao) {
      const arr = Array.isArray(body.configuracao) ? body.configuracao : [body.configuracao];
      arr.forEach(c => mock_configuracoes.push(c));
      return res.json({ status: 'salvo' });
    }
    return res.status(400).json({ error: 'payload inválido' });
  }
  try {
    const data = await proxyPost('/processo/configuracao', body);
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy salvar configuracao', details: err.message });
  }
}

export async function iniciarProcesso(req, res) {
  const body = req.body || {};
  if (USE_MOCK) {
    const newPid = Math.floor(Math.random()*9000)+1000;
    const rec = { id: Date.now(), processo: body.processo || 'unknown', pid: newPid, maquina: body.host || 'mock', status: 'running', inicio: new Date().toLocaleString() };
    mock_processos.push(rec);
    return res.json({ status: 'ok', pid: newPid, criado: rec });
  }
  try {
    const data = await proxyPost('/processo/iniciar', body);
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy iniciar', details: err.message });
  }
}

export async function listarProcessos(req, res) {
  if (USE_MOCK) {
    return res.json({ processos: mock_processos });
  }
  try {
    const data = await proxyPost('/processo/listar', req.body || {});
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy listar', details: err.message });
  }
}

export async function pararProcesso(req, res) {
  const body = req.body || {};
  if (USE_MOCK) {
    // naive: mark all matching processos as stopped
    if (body && body.parar && Array.isArray(body.parar)) {
      body.parar.forEach(p => {
        mock_processos.forEach(mp => {
          if (!p.processo || mp.processo.includes(p.processo)) {
            mp.status = 'stopped';
            mp.pid = null;
          }
        });
      });
    } else {
      mock_processos.forEach(mp => { mp.status = 'stopped'; mp.pid = null; });
    }
    return res.json({ status: 'ok' });
  }
  try {
    const data = await proxyPost('/processo/parar', body);
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Erro proxy parar', details: err.message });
  }
}
