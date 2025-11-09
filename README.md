# CDRView Manager

Interface Web para Gerenciamento de Processos do CDRView.

## Estrutura do Projeto
- **client/**: Aplicacao React (interface web).
- **server/**: Servidor Node.js com mock local para testes.

## Modos de Operacao
No arquivo `client/src/App.jsx`, voce pode alternar entre os modos:
```js
const MODE = 'local'; // 'local' ou 'external'
```
- **local**: usa o backend simulado (`http://localhost:4000/api`).
- **external**: conecta ao servidor real (`http://localhost:6869/cdrview`).

## Como Executar

### 1. Backend (Mock Local)
```bash
cd server
npm install
npm run dev
```
Executa o backend local com endpoints simulados para iniciar, parar e listar processos.

### 2. Frontend (React)
```bash
cd client
npm install
npm run dev
```
O projeto sera executado em `http://localhost:5173`.

### 3. Configuracao no Frontend
No campo **Backend**, utilize o endereco:
```
http://localhost:4000/api
```

## Endpoints Disponiveis (Modo Local)
- `GET /api/status`
- `POST /api/processo/iniciar`
- `POST /api/processo/listar`
- `POST /api/processo/parar`

---
Desenvolvido para testes locais e integracao com o servidor real CDRView.