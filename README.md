# CDRView Manager (React + Express) - Configurations Update

Projeto final para gerenciamento de processos do CDRView. Esta versão inclui a tela de Configurações completa (CRUD) integrada ao mock do backend.

## Estrutura
- server/ -> Express backend (porta 4000 por padrão)
- client/ -> React frontend (porta 3000 por padrão)

## Como rodar (desenvolvimento)
1. Backend
   ```bash
   cd server
   npm install
   cp .env.example .env   # editar se desejar
   npm start
   ```

2. Frontend
   ```bash
   cd client
   npm install
   npm start
   ```

O client chama o server em http://localhost:4000/cdrview por padrão. Para usar a API real, altere `SERVER_USE_MOCK=false` e `CDRVIEW_BASE` no `.env` do server.

## Notas
- Tela de Configurações implementada conforme o protótipo e PDF fornecido.
- O mock persiste alterações em memória (reiniciar o server reseta o mock).
