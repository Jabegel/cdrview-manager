import React from 'react';

const mockProcesses = [
  {
    machineId: 'Machine01',
    processId: 'Proc123',
    status: 'Running',
    startTime: '2025-10-10 10:00',
    duration: '2h'
  },
  {
    machineId: 'Machine02',
    processId: 'Proc456',
    status: 'Stopped',
    startTime: '2025-10-09 15:00',
    duration: '1h'
  }
];

function ListProcesses() {
  return (
    <div className="list-processes-container">
      <h2>Listar Processos</h2>
      
      {/* barra de busca principal */}
      <input 
        type="text" 
        placeholder="Buscar Processo/Máquina" 
        className="main-search-bar" 
      />

      {/* controles da tabela (show entries e search) */}
      <div className="table-controls">
        <div className="show-entries">
          Show 
          <select name="entries" id="entries">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select> 
          entries
        </div>
        <div className="table-search">
          Search: 
          <input type="text" />
        </div>
      </div>

      {/* tabela de processos */}
      <table className="processes-table">
        <thead>
          <tr>
            <th>Máquina ID</th>
            <th>Processo ID</th>
            <th>Status</th>
            <th>Início</th>
            <th>Duração</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {mockProcesses.map((proc, index) => (
            <tr key={index}>
              <td>{proc.machineId}</td>
              <td>{proc.processId}</td>
              <td>
                {/* badge de status condicional */}
                <span className={`status-badge status-${proc.status.toLowerCase()}`}>
                  {proc.status}
                </span>
              </td>
              <td>{proc.startTime}</td>
              <td>{proc.duration}</td>
              <td>
                <button className="details-button">Ver Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* rodapé da tabela com paginação */}
      <div className="table-footer">
        <div>Showing 1 to 2 of 2 entries</div>
        <div className="pagination">
          <button disabled>Previous</button>
          <button className="active">1</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ListProcesses;