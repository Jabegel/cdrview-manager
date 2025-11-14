import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function ConfigForm({ setScreen }) {
  const [servidores, setServidores] = useState([]);
  const [centrais, setCentrais] = useState([]);
  const [form, setForm] = useState({ nome: '', processo: '', servidor: '', central: '', argumentos: '' });

  useEffect(() => { (async ()=>{ const h = await api.listarHosts(); setServidores(h.servidores || []); })(); }, []);

  async function handleServerChange(host) {
    setForm({ ...form, servidor: host, central: '' });
    try {
      const res = await api.listarCentrais(host);
      setCentrais(res.centrais || []);
    } catch (err) {
      console.error(err);
      setCentrais([]);
    }
  }

  async function save(e) {
    e.preventDefault();
    try {
      await api.salvarConfig(form);
      alert('Salvo');
      setScreen('configs');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar');
    }
  }

  return (
    <div className="card p-3">
      <h4>Nova Configuração</h4>
      <form onSubmit={save}>
        <div className="mb-2">
          <label>Nome</label>
          <input className="form-control" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
        </div>
        <div className="mb-2">
          <label>Processo (.exe)</label>
          <input className="form-control" value={form.processo} onChange={e => setForm({ ...form, processo: e.target.value })} required />
        </div>
        <div className="mb-2">
          <label>Servidor</label>
          <select className="form-select" value={form.servidor} onChange={e => handleServerChange(e.target.value)} required>
            <option value="">Selecione</option>
            {servidores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Central</label>
          <select className="form-select" value={form.central} onChange={e => setForm({ ...form, central: e.target.value })} required>
            <option value="">Selecione</option>
            {centrais.map(c => <option key={c.nome || c} value={c.nome || c}>{c.nome || c}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Argumentos</label>
          <input className="form-control" value={form.argumentos} onChange={e => setForm({ ...form, argumentos: e.target.value })} />
        </div>
        <div className="mt-3">
          <button className="btn btn-primary me-2" type="submit">Salvar</button>
          <button type="button" className="btn btn-secondary" onClick={() => setScreen('configs')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
