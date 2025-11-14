import axios from 'axios';

const USE_MOCK = (process.env.SERVER_USE_MOCK || 'true').toLowerCase() === 'true';
const CDRVIEW_BASE = process.env.CDRVIEW_BASE || 'http://host:6869/cdrview';

// In-memory mock storage
let mock_configuracoes = [
  { nome: 'p_cfgHUAWEI', central: 'central_x', servidor: 'host1', processo: 'parsergen_Huawei.exe', argumentos: '--type=cdr --central=central_x', iniciar: { host: 'host1', processo: 'parsergen_Huawei.exe', argumento: '--type=cdr --central=central_x' } },
  { nome: 'p_cfgERIC', central: 'central_y', servidor: 'host2', processo: 'parsergen_Ericsson.exe', argumentos: '--type=cdr --central=central_y', iniciar: { host: 'host2', processo: 'parsergen_Ericsson.exe', argumento: '--type=cdr --central=central_y' } }
];

let mock_processos = [
  { id: 1, processo: 'parsergen_Huawei.exe', pid: 3778, maquina: 'host1', status: 'running', inicio: '2025-10-31 10:00' },
  { id: 2, processo: 'parsergen_Ericsson.exe', pid: null, maquina: 'host2', status: 'stopped', inicio: null }
];

const mock_servidores = Array.from({length:6}).map((_,i)=>`host${i+1}`);
const mock_centrais = [ { nome: 'central_x', servidor: 'host1' }, { nome: 'central_y', servidor: 'host2' } ];

async function proxyGet(path){ const url = `${CDRVIEW_BASE}${path}`; const res = await axios.get(url); return res.data; }
async function proxyPost(path, body){ const url = `${CDRVIEW_BASE}${path}`; const res = await axios.post(url, body); return res.data; }

// Hosts
export async function listarHosts(req,res){
  if(USE_MOCK) return res.json({ servidores: mock_servidores.map(h => ({ label: h, value: h })) });
  try{ const data = await proxyGet('/processo/configuracao/hosts'); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy hosts', details: e.message }); }
}

// Centrais
export async function listarCentrais(req,res){
  if(USE_MOCK) return res.json({ centrais: mock_centrais });
  try{ const data = await proxyGet('/processo/configuracao/centrais'); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy centrais', details: e.message }); }
}

export async function listarCentraisPorHost(req,res){
  const host = req.params.host;
  if(USE_MOCK){ const cent = [ { nome: `${host}_01`, servidor: host }, { nome: `${host}_02`, servidor: host } ]; return res.json({ centrais: cent }); }
  try{ const data = await proxyGet(`/processo/configuracao/centrais/${host}`); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy centrais por host', details: e.message }); }
}

// Configurações
export async function getConfiguracoes(req,res){
  if(USE_MOCK) return res.json({ configuracoes: mock_configuracoes });
  try{ const data = await proxyGet('/processo/configuracao'); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy configuracoes', details: e.message }); }
}

export async function salvarConfig(req,res){
  const body = req.body;
  if(!body || !body.configuracao) return res.status(400).json({ error: 'payload inválido' });
  if(USE_MOCK){
    const arr = Array.isArray(body.configuracao) ? body.configuracao : [body.configuracao];
    arr.forEach(c => {
      // avoid duplicates
      const exists = mock_configuracoes.find(x => x.nome === c.nome);
      if(!exists) mock_configuracoes.push(c);
      else Object.assign(exists, c);
    });
    return res.json({ status: 'salvo' });
  }
  try{ const data = await proxyPost('/processo/configuracao', body); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy salvar configuracao', details: e.message }); }
}

export async function deletarConfig(req,res){
  const nome = req.params.nome;
  if(USE_MOCK){
    const idx = mock_configuracoes.findIndex(c => c.nome === nome);
    if(idx === -1) return res.status(404).json({ error: 'não encontrado' });
    mock_configuracoes.splice(idx,1);
    return res.json({ status: 'excluido' });
  }
  try{ const data = await proxyPost('/processo/configuracao/delete',{ nome }); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy delete', details: e.message }); }
}

// Processos
export async function iniciarProcesso(req,res){
  const body = req.body || {};
  if(USE_MOCK){
    const found = mock_processos.find(mp => mp.maquina === (body.host || '') && mp.processo === (body.processo || ''));
    if(found){ found.status = 'running'; found.pid = Math.floor(Math.random()*9000)+1000; found.inicio = new Date().toLocaleString(); return res.json({ status: 'ok', restarted: found }); }
    const newPid = Math.floor(Math.random()*9000)+1000;
    const rec = { id: Date.now(), processo: body.processo || 'unknown', pid: newPid, maquina: body.host || 'mock', status: 'running', inicio: new Date().toLocaleString() };
    mock_processos.push(rec);
    return res.json({ status: 'ok', criado: rec });
  }
  try{ const data = await proxyPost('/processo/iniciar', body); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy iniciar', details: e.message }); }
}

export async function listarProcessos(req,res){
  if(USE_MOCK) return res.json({ processos: mock_processos });
  try{ const data = await proxyPost('/processo/listar', req.body || {}); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy listar', details: e.message }); }
}

export async function pararProcesso(req,res){
  const body = req.body || {};
  if(USE_MOCK){
    if(body && body.parar && Array.isArray(body.parar)){
      body.parar.forEach(p => {
        mock_processos.forEach(mp => {
          if(!p.processo || mp.processo.includes(p.processo)){
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
  try{ const data = await proxyPost('/processo/parar', body); return res.json(data); }catch(e){ return res.status(502).json({ error: 'Erro proxy parar', details: e.message }); }
}
