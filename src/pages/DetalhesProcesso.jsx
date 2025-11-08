import React from "react";
import "../styles/DetalhesProcesso.css";

function DetalhesProcesso(){
    return(
        <div className="detalhes-container">
            <h1>Detalhes do Processo</h1>

            <section className="info-card">
                <p><strong>Máquina ID:</strong>maq-01-zulu</p>
                <p><strong>Processo ID:</strong>proc-987-alpha</p>
                <p><strong>Status:</strong> <span className="status success">Concluído</span></p>
                <p><strong>Inicio:</strong>18/07/2024 10:30:15</p>
                <p><strong>Duração:</strong>3m 45s</p>
            </section>

            <section className="logs">
                <h2>Logs do Processo</h2>
                <ul>
                    <li>10:30:15 - Processo Iniciado na máquina maq-01-zulu</li>
                    <li>10:31:02 - Análise de dados iniciada.</li>
                    <li className="error">10:32:50 - Erro ao acessar recurso X. Tentativa 1/3</li>
                    <li> 10:33:18 Recurso X acessado com sucesso na tentativa 2.</li>
                    <li className="success">10:34:00 - Processo finalizado com sucesso.</li>
                </ul>
            </section>
        </div>
    );
}

export default DetalhesProcesso;