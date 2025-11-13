import React from "react";
import "../styles/DetalhesProcesso.css";

function DetalhesProcesso(){
    return(
        <div className="layout">
            <aside className="sidebar">
                <div className="logo">CDRView<br/>Manager</div>
                <nav>
                    <ul>
                        <li >📋 Listar Processos</li>
                        <li className="active">🔍 Detalhes do Processo</li>
                        <li>⚙️ Configurações</li>
                        
                    </ul>
                </nav>
            </aside>

            <main className="content">
                <header className="header">
                    <h1>Detalhes do Processo</h1>
                    <div className="actions">
                        <button className="back"><strong>Voltar à Lista</strong></button>
                        <button className="update"><strong>Atualizar</strong></button>
                    </div>
                </header>

                <section className="card info-card">
                    <p><strong>Máquina ID: </strong>maq-01-zulu</p>
                    <p><strong>Processo ID: </strong>proc-987-alpha</p>
                    <p><strong>Status: </strong><span className="status success">Concluído</span></p>
                    <p><strong>Início: </strong>18/07/2024 10:30:15</p>
                    <p><strong>Duração: </strong>3m 45s</p>
                </section>

                <section className="logs">
                    <h2>Logs do Processo</h2>

                    <div className="log success">
                        <span className="log-time">10:30:15</span>
                        <span className="log-text">Processo 987-alpha iniciado na máquina maq-01-zulu</span>
                    </div>

                    <div className="log">
                        <span className="log-time">10:31:02</span>
                        <span className="log-text">Análise de dados iniciada.</span>
                    </div>

                    <div className="log error">
                        <span className="log-time">10:32:50</span>
                        <span className="log-text">Erro ao acessar recurso X. Tentativa 1/3.</span>
                    </div>

                    <div className="log">
                        <span className="log-time">10:33:18</span>
                        <span className="log-text">Recurso X acessado com sucesso na tentativa 2.</span>
                    </div>

                    <div className="log success">
                        <span className="log-time">10:34:00</span>
                        <span className="log-text">Análise de dados concluída. Processo finalizado com sucesso.</span>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DetalhesProcesso;