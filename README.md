# CDRView Manager

Sistema de gerenciamento de processos CDRView com interface web moderna.

## 🚀 Tecnologias

### Backend
- **Node.js** com **Express 5**
- CORS habilitado
- Variáveis de ambiente com dotenv
- Nodemon para desenvolvimento

### Frontend
- **React 19** com **Vite 7**
- Interface moderna e responsiva
- Tema escuro na sidebar
- Comunicação com backend via API REST

## 📁 Estrutura do Projeto

```
cdrview-manager/
├── server/              # Backend Node.js + Express
│   ├── index.js         # Servidor principal
│   ├── .env             # Configurações
│   └── package.json
│
└── client/              # Frontend React + Vite
    ├── src/
    │   ├── App.jsx      # Componente principal
    │   ├── App.css      # Estilos
    │   ├── index.css    # Estilos globais
    │   └── main.jsx     # Entry point
    ├── vite.config.js   # Configuração do Vite
    └── package.json
```

## 🔧 Instalação

### 1. Instalar dependências do servidor

```bash
cd server
npm install
```

### 2. Instalar dependências do cliente

```bash
cd client
npm install
```

## ▶️ Executar o Projeto

### Opção 1: Executar separadamente

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Servidor rodando em http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend rodando em http://localhost:3000
```

### Opção 2: Executar em background

**Backend:**
```bash
cd server
nohup node index.js > server.log 2>&1 &
```

**Frontend:**
```bash
cd client
nohup npm run dev > client.log 2>&1 &
```

## 🌐 Endpoints da API

### Status do Sistema
```
GET /api/status
```

Retorna o status do sistema e estatísticas dos processos.

**Resposta:**
```json
{
  "success": true,
  "status": "online",
  "processosAtivos": 0,
  "totalProcessos": 0,
  "cdrviewHost": "localhost:6869"
}
```

### Iniciar Processo
```
POST /api/processo/iniciar
Content-Type: application/json
```

**Body:**
```json
{
  "machineId": "MACH-001",
  "processType": "CDR Analysis",
  "parameters": {
    "chave": "valor"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Processo iniciado com sucesso",
  "processo": {
    "id": 1,
    "machineId": "MACH-001",
    "processType": "CDR Analysis",
    "parameters": { "chave": "valor" },
    "status": "iniciado",
    "createdAt": "2025-11-09T17:34:13.342Z",
    "cdrviewUrl": "http://localhost:6869/cdrview/processo/iniciar"
  }
}
```

### Listar Processos
```
GET /api/processos
```

Retorna lista de todos os processos.

### Parar Processo
```
POST /api/processo/parar/:id
```

Para um processo específico pelo ID.

## 🎨 Funcionalidades da Interface

### 1. Iniciar Processos
- Formulário para iniciar novos processos
- Campos: ID da Máquina, Tipo de Processo, Parâmetros
- Validação de dados
- Feedback visual de sucesso/erro

### 2. Parar Processos
- Lista de processos em execução
- Botão para parar cada processo
- Atualização em tempo real

### 3. Listar Processos
- Visualização de todos os processos
- Status de cada processo (iniciado/parado)
- Informações detalhadas (ID, máquina, timestamps, parâmetros)

### 4. Status do Sistema
- Indicador visual na sidebar
- Status online/offline
- Atualização automática

## ⚙️ Configuração

### Variáveis de Ambiente (server/.env)

```env
PORT=4000
CDRVIEW_HOST=localhost:6869
```

### Proxy do Vite

O Vite está configurado para fazer proxy das requisições `/api` para o backend em `http://localhost:4000`.

## 🔗 Integração com CDRView

O sistema está preparado para se integrar com o endpoint CDRView:

```
http://host:6869/cdrview/processo/iniciar
```

Para habilitar a integração real, descomente as linhas no arquivo `server/index.js`:

```javascript
// Linha ~50-55
const response = await fetch(cdrviewUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
const data = await response.json();
```

## 📝 Notas

- O backend armazena processos em memória. Para produção, use um banco de dados.
- Certifique-se de que as portas 3000 e 4000 estão disponíveis.
- Para alterar o host do CDRView, edite o arquivo `server/.env`.

## 🛠️ Desenvolvimento

### Scripts Disponíveis

**Backend:**
- `npm run dev` - Inicia com nodemon (hot reload)
- `npm start` - Inicia em modo produção

**Frontend:**
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter

## 📄 Licença

ISC
