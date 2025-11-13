import React, { useEffect, useState } from 'react'

export default function Configs() {
  const [configs, setConfigs] = useState([]);
  const [servs, setServs] = useState([]);
  const [centraisMap, setCentraisMap] = useState({});
  const [form, setForm] = useState({ id: null, nome: '', exe: '', servidor: '', central: '', argumentos: '' });

  useEffect(()=>{ fetchInitial() }, []);

  async function fetchInitial() {
    const cfgResp = await fetch('/api/configs/list');
    const cfgJson = await cfgResp.json();
    setConfigs(cfgJson.configs || []);

    const sResp = await fetch('/api/config/hosts');
    const sJson = await sResp.json();
    setServs(sJson.servidores || []);

    const cResp = await fetch('/api/config/centrais');
    const cJson = await cResp.json();
    const map = {};
    (cJson.centrais || []).forEach(c => {
      const key = c.servidor || 'default';
      if (!map[key]) map[key] = [];
      map[key].push(c.nome || c);
    });
    setCentraisMap(map);
  }

  function abrirForm(cfg = null) {
    if (!cfg) {
      setForm({ id: null, nome:'', exe:'', servidor:'', central:'', argumentos:'' });
    } else {
      setForm({...cfg});
    }
  }

  async function salvar(e) {
    e.preventDefault();
    const url = form.id ? '/api/configs/update' : '/api/configs/create';
    const resp = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(form)
    });
    const j = await resp.json();
    await fetchInitial();
    alert(j.message || 'Salvo');
  }

  async function excluir(id) {
    if (!confirm('Excluir configuração?')) return;
    const resp = await fetch('/api/configs/delete', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id })
    });
    const j = await resp.json();
    await fetchInitial();
    alert(j.message || 'Removido');
  }

  return (
    <div>
      <table className="table table-striped">
        <thead className="table-dark"><tr>
          <th>Nome</th><th>Processo</th><th>Servidor</th><th>Central</th><th>Argumentos</th><th>Ações</th>
        </tr></thead>
        <tbody>
          {configs.map(c=> (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.exe}</td>
              <td>{c.servidor}</td>
              <td>{c.central}</td>
              <td><small>{c.argumentos}</small></td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={()=>abrirForm(c)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={()=>excluir(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr/>
      <div style={{maxWidth:600}}>
        <h4>{form.id ? 'Editar' : 'Nova'} Configuração</h4>
        <form onSubmit={salvar}>
          <div className="mb-2">
            <label className="form-label">Nome</label>
            <input className="form-control" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} required />
          </div>
          <div className="mb-2">
            <label className="form-label">Processo (.exe)</label>
            <input className="form-control" value={form.exe} onChange={e=>setForm({...form,exe:e.target.value})} required />
          </div>
          <div className="mb-2">
            <label className="form-label">Servidor</label>
            <select className="form-select" value={form.servidor} onChange={e=>setForm({...form,servidor:e.target.value, central:''})} required>
              <option value="">Selecione</option>
              {servs.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Central</label>
            <select className="form-select" value={form.central} onChange={e=>setForm({...form,central:e.target.value})} disabled={!form.servidor}>
              <option value="">Selecione</option>
              {(centraisMap[form.servidor]||[]).map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Argumentos</label>
            <input className="form-control" value={form.argumentos} onChange={e=>setForm({...form,argumentos:e.target.value})} placeholder="--type=cdr --central=HBBH" />
          </div>
          <button className="btn btn-primary" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  )
}