// Aplicação Principal
class CDRViewApp {
    constructor() {
        this.init();
    }
    
    // Inicializar aplicação
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeManagers();
            this.setupEventListeners();
            this.loadInitialData();
            
            console.log('CDRView Manager inicializado com sucesso!');
        });
    }
    
    // Inicializar gerenciadores
    initializeManagers() {
        ThemeManager.init();
        StateManager.updateUI();
    }
    
    // Configurar event listeners
    setupEventListeners() {
        this.setupNavigation();
        this.setupProcessForm();
        this.setupKeyboardShortcuts();
    }
    
    // Configurar navegação
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });
    }
    
    // Manipular navegação
    handleNavigation(clickedItem) {
        // Remover classe active de todos os itens
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active', 'bg-primary/30');
        });
        
        // Adicionar classe active ao item clicado
        clickedItem.classList.add('active', 'bg-primary/30');
        
        const page = clickedItem.dataset.page;
        this.navigateToPage(page);
    }
    
    // Navegar para página
    navigateToPage(page) {
        const pages = {
            start: 'Iniciar Processos',
            stop: 'Parar Processos', 
            list: 'Listar Processos'
        };
        
        const pageTitle = pages[page] || 'CDRView Manager';
        document.title = `CDRView Manager - ${pageTitle}`;
        
        NotificationSystem.info(`Navegando para ${pageTitle}`, 1500);
        
        // Aqui você pode adicionar lógica para carregar conteúdo específico da página
    }
    
    // Configurar formulário de processo
    setupProcessForm() {
        const startButton = document.getElementById('start-process-btn');
        const machineIdInput = document.getElementById('machine-id');
        const processTypeSelect = document.getElementById('process-type');
        const parametersTextarea = document.getElementById('parameters');
        
        if (!startButton) return;
        
        startButton.addEventListener('click', () => {
            this.handleProcessStart();
        });
        
        // Validação em tempo real
        if (machineIdInput) {
            machineIdInput.addEventListener('input', () => {
                FormValidator.hideFieldError(machineIdInput);
            });
        }
        
        if (parametersTextarea) {
            parametersTextarea.addEventListener('input', () => {
                FormValidator.hideFieldError(parametersTextarea);
            });
        }
        
        // Submissão com Enter no campo de ID
        if (machineIdInput) {
            machineIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleProcessStart();
                }
            });
        }
    }
    
    // Manipular início de processo
    handleProcessStart() {
        const machineId = document.getElementById('machine-id')?.value.trim();
        const processType = document.getElementById('process-type')?.value;
        const parameters = document.getElementById('parameters')?.value.trim();
        const startButton = document.getElementById('start-process-btn');
        
        // Limpar erros anteriores
        FormValidator.clearAllErrors();
        
        // Validar formulário
        const validation = FormValidator.validateForm(machineId, processType, parameters);
        if (!validation.isValid) {
            NotificationSystem.error(validation.message);
            
            // Destacar campo com erro
            if (validation.message.includes('máquina')) {
                const machineInput = document.getElementById('machine-id');
                FormValidator.showFieldError(machineInput, validation.message);
                machineInput.classList.add('shake');
                setTimeout(() => machineInput.classList.remove('shake'), 500);
            }
            
            return;
        }
        
        // Mostrar loading
        this.showLoading(startButton);
        
        // Simular requisição assíncrona
        setTimeout(() => {
            this.completeProcessStart(machineId, processType, parameters, startButton);
        }, 2000);
    }
    
    // Mostrar estado de loading
    showLoading(button) {
        if (!button) return;
        
        button.innerHTML = '<div class="loading-spinner"></div><span>Iniciando...</span>';
        button.disabled = true;
    }
    
    // Completar início de processo
    completeProcessStart(machineId, processType, parameters, button) {
        // Adicionar processo ao histórico
        const process = StateManager.addProcess({
            machineId,
            type: document.getElementById('process-type').options[document.getElementById('process-type').selectedIndex].text,
            parameters
        });
        
        // Mostrar notificação de sucesso
        NotificationSystem.success(`Processo iniciado com sucesso na máquina ${machineId}`);
        
        // Resetar formulário
        this.resetProcessForm();
        
        // Restaurar botão
        this.restoreButton(button);
        
        // Log para debug
        console.log('Processo iniciado:', process);
    }
    
    // Restaurar botão ao estado normal
    restoreButton(button) {
        if (!button) return;
        
        button.innerHTML = '<span>Iniciar Processo</span>';
        button.disabled = false;
    }
    
    // Resetar formulário de processo
    resetProcessForm() {
        const machineIdInput = document.getElementById('machine-id');
        const parametersTextarea = document.getElementById('parameters');
        const processTypeSelect = document.getElementById('process-type');
        
        if (machineIdInput) machineIdInput.value = '';
        if (parametersTextarea) parametersTextarea.value = '';
        if (processTypeSelect) processTypeSelect.selectedIndex = 0;
        
        FormValidator.clearAllErrors();
    }
    
    // Configurar atalhos de teclado
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Enter para iniciar processo
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.handleProcessStart();
            }
            
            // Ctrl + , para alternar tema
            if (e.ctrlKey && e.key === ',') {
                e.preventDefault();
                ThemeManager.toggleTheme();
            }
            
            // Escape para limpar notificações
            if (e.key === 'Escape') {
                NotificationSystem.clearAll();
            }
        });
    }
    
    // Carregar dados iniciais
    loadInitialData() {
        // Carregar processos recentes
        StateManager.updateUI();
        
        // Mostrar estatísticas iniciais
        const stats = StateManager.getStats();
        if (stats.total > 0) {
            console.log(`Estatísticas: ${stats.running} processos em execução, ${stats.stopped} parados`);
        }
    }
    
    // Método para parar processo (para futura implementação)
    stopProcess(processId) {
        StateManager.stopProcess(processId);
        NotificationSystem.warning('Processo parado com sucesso');
    }
    
    // Método para limpar histórico (para futura implementação)
    clearProcessHistory() {
        StateManager.clearHistory();
        NotificationSystem.info('Histórico de processos limpo');
    }
}

// Inicializar aplicação
const app = new CDRViewApp();