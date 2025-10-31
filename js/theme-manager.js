// Gerenciador de Tema
const ThemeManager = {
    // Inicializar tema
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Observar mudanças de preferência do sistema
        this.watchSystemPreference();
    },
    
    // Definir tema
    setTheme(theme) {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
        
        this.updateThemeIcon(theme);
        this.dispatchThemeChange(theme);
    },
    
    // Alternar tema
    toggleTheme() {
        const currentTheme = document.documentElement.className;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        NotificationSystem.info(`Modo ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 2000);
    },
    
    // Atualizar ícone do tema
    updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle .material-symbols-outlined');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    },
    
    // Observar preferência do sistema
    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },
    
    // Disparar evento de mudança de tema
    dispatchThemeChange(theme) {
        const event = new CustomEvent('themeChange', { 
            detail: { theme } 
        });
        document.dispatchEvent(event);
    },
    
    // Obter tema atual
    getCurrentTheme() {
        return document.documentElement.className;
    },
    
    // Resetar para tema do sistema
    resetToSystemTheme() {
        localStorage.removeItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.setTheme(systemTheme);
    }
};