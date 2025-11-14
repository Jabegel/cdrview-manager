
import axios from 'axios';

const USE_MOCK = true;

let mock_processos = [
  { id: 1, processo: "parser.exe", pid: 1111, maquina: "host1", status:"running", inicio:"2025-01-01" }
];

let mock_hosts = ["host1","host2","host3"];

export async function listarHosts(req,res){ res.json({servidores:mock_hosts}); }

export async function getConfiguracoes(req,res){
  res.json({configuracoes:[
    {nome:"p_cfgHUAWEI",processo:"parserH.exe",servidor:"host1",central:"c1",
     iniciar:{host:"host1",processo:"parserH.exe",argumento:""}}
  ]});
}

export async function iniciarProcesso(req,res){
  const b=req.body;
  const rec={ id:Date.now(), processo:b.processo, pid:Math.floor(Math.random()*9000), maquina:b.host, status:"running", inicio:new Date().toLocaleString() };
  mock_processos.push(rec);
  res.json({status:"ok", criado:rec});
}

export async function listarProcessos(req,res){ res.json({processos:mock_processos}); }

export async function pararProcesso(req,res){
  mock_processos.forEach(p=>{p.status="stopped";p.pid=null});
  res.json({status:"ok"});
}
