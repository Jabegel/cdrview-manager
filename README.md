# cdrview-manager

Projeto unificado (Frontend React + Backend Node/Express) que reúne as funcionalidades Start, Stop, List e Configurações.

Backend roda na porta 3000 por padrão. Frontend (Vite) roda na porta 5173 e está configurado para proxar `/api` para o backend local.

Persistência local em JSON: `server/database/configs.json` e `server/database/processos.json`.