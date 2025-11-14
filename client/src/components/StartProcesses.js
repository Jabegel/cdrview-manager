import React, { useEffect, useState } from "react";
import api from "../api/api";

/**
 * StartProcesses.js
 * - Lista configurações
 * - Permite iniciar por configuração (botão Iniciar em cada linha)
 * - Permite iniciar processo manual (host + processo + args)
 * - Após iniciar, recarrega a lista de processos e mostra abaixo
 *
 * Observações:
 * - Aceita hosts retornados como ["host1","host2"] ou [{label,value},...]
 * - Usa api.iniciarProcesso(...) e api.listarProcessos()
 */

export default function StartProcesses() {
  const [configs, setConfigs] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [processos, setProcessos] = useState([]);
  const [manual, setManual] = useState({ host: "", processo: "", argumento: "" });
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [loadingProcs, setLoadingProcs] = useState(false);

  useEffect(() => {
    loadConfigsAndHosts();
    loadProcessos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadConfigsAndHosts() {
    setLoadingConfigs(true);
    try {
      const c = await api.getConfiguracoes();
      setConfigs(c?.configuracoes || []);

      const h = await api.listarHosts();
      // aceitar ambos formatos: {servidores: ["host1"]} ou {servidores:[{label,value}]}
      const raw = h?.servidores || [];
      if (raw.length > 0 && typeof raw[0] === "object") {
        // já objeto {label,value}
        setHosts(raw);
      } else {
        // strings -> transformar em objetos
        setHosts(raw.map((s) => ({ label: s, value: s })));
      }
    } catch (e) {
      console.error("Erro carregar configs/hosts", e);
      setConfigs([]);
      setHosts([]);
    } finally {
      setLoadingConfigs(false);
    }
  }

  async function loadProcessos() {
    setLoadingProcs(true);
    try {
      const r = await api.listarProcessos();
      setProcessos(r?.processos || []);
    } catch (e) {
      console.error("Erro listar processos", e);
      setProcessos([]);
    } finally {
      setLoadingProcs(false);
    }
  }

  async function handleStartConfig(cfg) {
    // cfg pode ter campo iniciar { host, processo, argumento }
    const payload = (cfg && cfg.iniciar) ? cfg.iniciar : {
      host: cfg?.servidor || "",
      processo: cfg?.processo || "",
      argumento: cfg?.argumentos || ""
    };
    if (!payload.host || !payload.processo) {
      return alert("Configuração inválida: host ou processo ausente.");
    }

    try {
      const res = await api.iniciarProcesso(payload);
      // opcional: mostrar resposta
      // console.log("iniciar resposta:", res);
      await loadProcessos();
      alert(`Solicitação de início enviada para ${payload.processo} em ${payload.host}`);
    } catch (e) {
      console.error("Erro ao iniciar via config", e);
      alert("Erro ao iniciar processo (ver console).");
    }
  }

  async function handleStartManual() {
    if (!manual.host || !manual.processo) {
      return alert("Preencha host e processo.");
    }
    const payload = { host: manual.host, processo: manual.processo, argumento: manual.argumento || "" };
    try {
      await api.iniciarProcesso(payload);
      await loadProcessos();
      alert(`Processo ${payload.processo} iniciado em ${payload.host}`);
      setManual({ host: "", processo: "", argumento: "" });
    } catch (e) {
      console.error("Erro iniciar manual", e);
      alert("Erro ao iniciar processo manual.");
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Iniciar Processos</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => loadConfigsAndHosts()} disabled={loadingConfigs}>
            Atualizar
          </button>
        </div>
      </div>

      <h5>Por Configurações</h5>
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Processo</th>
            <th>Servidor</th>
            <th>Central</th>
            <th>Args</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {configs.length === 0 && (
            <tr><td colSpan={6}>{loadingConfigs ? "Carregando..." : "Nenhuma configuração encontrada."}</td></tr>
          )}
          {configs.map((c) => (
            <tr key={c.nome}>
              <td>{c.nome}</td>
              <td>{c.processo || c.iniciar?.processo || "-"}</td>
              <td>{c.servidor || c.iniciar?.host || "-"}</td>
              <td>{c.central || "-"}</td>
              <td><small>{c.argumentos || c.iniciar?.argumento || "-"}</small></td>
              <td>
                <button className="btn btn-sm btn-success" onClick={() => handleStartConfig(c)}>Iniciar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h5>Manual</h5>
      <div className="row g-2 align-items-center mb-3">
        <div className="col-md-4">
          <select className="form-select" value={manual.host} onChange={(e) => setManual({...manual, host: e.target.value})}>
            <option value="">Selecione host</option>
            {hosts.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="processo.exe" value={manual.processo} onChange={(e) => setManual({...manual, processo: e.target.value})} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="argumentos (opcional)" value={manual.argumento} onChange={(e) => setManual({...manual, argumento: e.target.value})} />
        </div>
      </div>
      <div className="mb-4">
        <button className="btn btn-success" onClick={handleStartManual}>Iniciar Manual</button>
      </div>

      <hr />

      <h5>Processos (lista)</h5>
      <table className="table table-striped">
        <thead className="table-dark"><tr><th>Processo</th><th>PID</th><th>Máquina</th><th>Status</th><th>Início</th></tr></thead>
        <tbody>
          {processos.length === 0 && (<tr><td colSpan={5}>{loadingProcs ? "Carregando..." : "Nenhum processo encontrado."}</td></tr>)}
          {processos.map(p => (
            <tr key={p.id || `${p.processo}_${p.maquina}_${p.pid || "na"}`}>
              <td>{p.processo}</td>
              <td>{p.pid || "-"}</td>
              <td>{p.maquina || "-"}</td>
              <td>{p.status || "-"}</td>
              <td>{p.inicio || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
