
import React, { useEffect, useState } from 'react';

export default function Start() {
  const [hosts, setHosts] = useState([]);
  const [selected, setSelected] = useState({}); // host -> boolean
  const [showModal, setShowModal] = useState(false);
  const [processo, setProcesso] = useState('parsergen.exe');
  const [argumentos, setArgumentos] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const resp = await fetch('/api/config/hosts');
        const j = await resp.json();
        const list = j.servidores || [];
        // if list is small, generate placeholders up to 64 to match PDF suggestion
        if (list.length < 64) {
          const generated = [];
          for (let i = 1; i <= 64; i++) {
            generated.push('host' + String(i).padStart(2, '0'));
          }
          setHosts(generated);
        } else {
          setHosts(list);
        }
      } catch (e) {
        // fallback generate
        const generated = [];
        for (let i = 1; i <= 64; i++) generated.push('host' + String(i).padStart(2,'0'));
        setHosts(generated);
      }
    }
    load();
  }, []);

  function toggleHost(h) {
    setSelected(prev => ({ ...prev, [h]: !prev[h] }));
  }

  function toggleAll(val) {
    const newSel = {};
    hosts.forEach(h => newSel[h] = val);
    setSelected(newSel);
  }

  async function confirmStart() {
    const chosen = hosts.filter(h => selected[h]);
    if (!chosen.length) { alert('Escolha ao menos uma máquina'); return; }
    // send to start-multiple
    const resp = await fetch('/api/processos/start-multiple', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ hosts: chosen, processo, argumentos })
    });
    const j = await resp.json();
    alert(JSON.stringify(j, null, 2));
    setShowModal(false);
  }

  return (
    <div>
      <h2>Iniciar Processos</h2>
      <div className="card p-3">
        <div className="d-flex justify-content-between mb-2">
          <div>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>toggleAll(true)}>Selecionar Todos</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={()=>toggleAll(false)}>Desmarcar Todos</button>
          </div>
          <div>
            <button className="btn btn-primary" onClick={()=>setShowModal(true)}>Iniciar Processo nas selecionadas</button>
          </div>
        </div>

        <div style={{maxHeight: '60vh', overflowY:'auto'}}>
          <table className="table table-sm table-hover">
            <thead><tr><th></th><th>Máquina</th></tr></thead>
            <tbody>
              {hosts.map(h => (
                <tr key={h}>
                  <td><input type="checkbox" checked={!!selected[h]} onChange={()=>toggleHost(h)} /></td>
                  <td>{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Parâmetros do processo</h5>
                <button type="button" className="btn-close" onClick={()=>setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2"><label>Processo (.exe)</label><input className="form-control" value={processo} onChange={e=>setProcesso(e.target.value)} /></div>
                <div className="mb-2"><label>Argumentos</label><input className="form-control" value={argumentos} onChange={e=>setArgumentos(e.target.value)} /></div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={confirmStart}>Confirmar e Iniciar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
