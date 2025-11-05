// Sistema de Notificações
const NotificationSystem = {
    // Mostrar notificação
    show(message, type = 'success', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return null;
        
        const id = 'notification-' + Date.now();
        
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `flex items-center gap-3 rounded-lg border p-4 shadow-lg animate-fade-in notification-${type}`;
        notification.innerHTML = `
            <span class="material-symbols-outlined">${icons[type]}</span>
            <p class="text-sm font-medium flex-1">${message}</p>
            <button onclick="NotificationSystem.hide('${id}')" class="text-slate-400 hover:text-slate-600 transition-colors">
                <span class="material-symbols-outlined text-sm">close</span>
            </button>
        `;
        
        container.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }
        
        return id;
    },
    
    // Esconder notificação
    hide(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.animation = 'fadeIn 0.5s ease-in-out reverse';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 500);
        }
    },
    
    // Limpar todas as notificações
    clearAll() {
        const container = document.getElementById('notification-container');
        if (container) {
            container.innerHTML = '';
        }
    },
    
    // Notificação de sucesso
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    },
    
    // Notificação de erro
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    },
    
    // Notificação de aviso
    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    },
    
    // Notificação informativa
    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
};