// Validador de Formulários
const FormValidator = {
    // Validar ID da máquina
    validateMachineId(id) {
        if (!id.trim()) {
            return { 
                isValid: false, 
                message: 'ID da máquina é obrigatório' 
            };
        }
        
        if (id.length < 3) {
            return { 
                isValid: false, 
                message: 'ID deve ter pelo menos 3 caracteres' 
            };
        }
        
        if (!/^[a-zA-Z0-9\-_]+$/.test(id)) {
            return { 
                isValid: false, 
                message: 'ID deve conter apenas letras, números, hífens e underscores' 
            };
        }
        
        return { isValid: true };
    },
    
    // Validar tipo de processo
    validateProcessType(type) {
        if (!type) {
            return { 
                isValid: false, 
                message: 'Tipo de processo é obrigatório' 
            };
        }
        
        const validTypes = ['cdr_analysis', 'log_parsing', 'data_sync', 'report_generation'];
        if (!validTypes.includes(type)) {
            return { 
                isValid: false, 
                message: 'Tipo de processo inválido' 
            };
        }
        
        return { isValid: true };
    },
    
    // Validar parâmetros
    validateParameters(parameters) {
        if (!parameters.trim()) {
            return { isValid: true }; // Parâmetros são opcionais
        }
        
        // Tentar parsear como JSON
        if (parameters.trim().startsWith('{') || parameters.trim().startsWith('[')) {
            try {
                JSON.parse(parameters);
                return { isValid: true };
            } catch (e) {
                return { 
                    isValid: false, 
                    message: 'Parâmetros JSON inválidos' 
                };
            }
        }
        
        // Validar formato chave=valor
        const lines = parameters.split('\n').filter(line => line.trim());
        for (const line of lines) {
            if (!line.includes('=')) {
                return { 
                    isValid: false, 
                    message: 'Parâmetros devem estar no formato JSON ou chave=valor' 
                };
            }
        }
        
        return { isValid: true };
    },
    
    // Validar formulário completo
    validateForm(machineId, processType, parameters = '') {
        const machineValidation = this.validateMachineId(machineId);
        if (!machineValidation.isValid) {
            return machineValidation;
        }
        
        const processValidation = this.validateProcessType(processType);
        if (!processValidation.isValid) {
            return processValidation;
        }
        
        const parametersValidation = this.validateParameters(parameters);
        if (!parametersValidation.isValid) {
            return parametersValidation;
        }
        
        return { isValid: true };
    },
    
    // Mostrar erro no campo
    showFieldError(field, message) {
        this.hideFieldError(field);
        
        const errorElement = document.createElement('p');
        errorElement.className = 'text-error text-xs mt-1 flex items-center gap-1';
        errorElement.innerHTML = `
            <span class="material-symbols-outlined text-xs">error</span>
            ${message}
        `;
        
        field.parentNode.appendChild(errorElement);
        field.classList.add('border-error');
    },
    
    // Esconder erro do campo
    hideFieldError(field) {
        const existingError = field.parentNode.querySelector('.text-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('border-error');
    },
    
    // Limpar todos os erros
    clearAllErrors() {
        document.querySelectorAll('.text-error').forEach(error => error.remove());
        document.querySelectorAll('.border-error').forEach(field => {
            field.classList.remove('border-error');
        });
    }
};