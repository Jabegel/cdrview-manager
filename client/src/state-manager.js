// Gerenciador de Estado da Aplicação
const StateManager = {
    processes: JSON.parse(localStorage.getItem('recentProcesses')) || [],
    
    // Adicionar novo processo
    addProcess(process) {
        this.processes.unshift({
            id: Date.now(),
            ...process,
            timestamp: new Date().toLocaleString('pt-BR'),
            status: 'running'
        });
        
        // Manter apenas os últimos 5 processos
        this.processes = this.processes.slice(0, 5);
        this.saveToLocalStorage();
        this.updateUI();
        
        return this.processes[0];
    },
    
    // Parar processo
    stopProcess(processId) {
        const process = this.processes.find(p => p.id === processId);
        if (process) {
            process.status = 'stopped';
            this.saveToLocalStorage();
            this.updateUI();
        }
    },
    
    // Salvar no localStorage
    saveToLocalStorage() {
        localStorage.setItem('recentProcesses', JSON.stringify(this.processes));
    },
    
    // Atualizar interface
    updateUI() {
        const container = document.getElementById('recent-processes');
        if (!container) return;
        
        if (this.processes.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4 text-slate-500 dark:text-slate-400">
                    <span class="material-symbols-outlined text-4xl mb-2">inbox</span>
                    <p class="text-sm">Nenhum processo recente</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.processes.map(process => `
            <div class="process-card flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer" data-process-id="${process.id}">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-sm ${process.status === 'running' ? 'text-success animate-pulse' : 'text-slate-400'}">
                        ${process.status === 'running' ? 'play_arrow' : 'check'}
                    </span>
                    <div>
                        <p class="text-sm font-medium text-slate-800 dark:text-slate-200">${process.machineId}</p>
                        <p class="text-xs text-slate-500">${process.type} • ${process.timestamp}</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </div>
        `).join('');
        
        // Adicionar event listeners para os cards
        container.querySelectorAll('.process-card').forEach(card => {
            card.addEventListener('click', () => {
                const processId = parseInt(card.dataset.processId);
                const process = this.processes.find(p => p.id === processId);
                if (process) {
                    NotificationSystem.show(`Processo ${process.machineId} - ${process.status === 'running' ? 'Em execução' : 'Parado'}`, 'info');
                }
            });
        });
    },
    
    // Limpar histórico
    clearHistory() {
        this.processes = [];
        this.saveToLocalStorage();
        this.updateUI();
    },
    
    // Obter estatísticas
    getStats() {
        const running = this.processes.filter(p => p.status === 'running').length;
        const stopped = this.processes.filter(p => p.status === 'stopped').length;
        
        return {
            total: this.processes.length,
            running,
            stopped
        };
    }
};