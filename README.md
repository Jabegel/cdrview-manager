
# CDRView Manager — Projeto Completo

Sistema completo de gerenciamento de processos do **CDRView**, com interface web moderna, responsiva e integração com os endpoints reais do sistema (`/cdrview/processo/...`).

Permite:
- Iniciar processos  
- Parar processos  
- Listar processos  
- Visualizar detalhes  
- Gerenciar configurações  

---

# Tecnologias

## **Backend**
- Node.js + Express  
- CORS habilitado  
- Proxy automático para o servidor real do CDRView  
- Persistência local via JSON (modo local)  
- Alternância entre **modo local** e **remote** via arquivo de configuração  

## **Frontend**
- React 18 + Vite  
- Bootstrap 5  
- Sidebar moderna tema escuro  
- DataTable responsivo (react-data-table-component)  
- Comunicação com backend via API REST  
- Navegação SPA (React Router)

---

# Estrutura do Projeto

```
cdrview-manager-complete/
├── server/                     # Backend Node.js + Express
│   ├── server.js               # Servidor principal
│   ├── config/
│   │   └── server-config.json  # Define modo local/remote e host
│   └── database/
│       ├── configs.json        # Persistência local
│       └── processos.json      # Persistência local
│
└── src/                        # Frontend React + Vite
    ├── main.jsx                # Entry point + Sidebar
    ├── pages/
    │   ├── Start/Start.jsx     # Tela de iniciar processos
    │   ├── Stop/Stop.jsx       # Tela de parar processos
    │   ├── List/List.jsx       # Tela de listar processos
    │   ├── Details/Details.jsx # Detalhes do processo
    │   └── Config/Configuracoes.jsx  # CRUD de configurações
    ├── index.html
    ├── vite.config.js          # Configuração do Vite + Proxy
    └── package.json
```

---

# Instalação

### **1. Instalar dependências do projeto**
```bash
npm install
```

---

# Executar o Projeto

## **Opção 1 — Executar separadamente**

### **Terminal 1 — Backend**
```bash
npm run server
# Servidor rodando em http://localhost:3000
```

### **Terminal 2 — Frontend**
```bash
npm run dev
# Frontend rodando em http://localhost:5173
```

---

## **Opção 2 — Backend e Frontend juntos em background**

### Backend:
```bash
nohup npm run server > server.log 2>&1 &
```

### Frontend:
```bash
nohup npm run dev > client.log 2>&1 &
```

---

# Modo Local vs Remote

A configuração para usar o servidor externo fica em:

```
server/config/server-config.json
```

### **Modo Local (default)**
```json
{
  "mode": "local",
  "host": "localhost",
  "port": 3000
}
```

### **Modo Remote (para acessar o CDRView real)**
```json
{
  "mode": "remote",
  "host": "MEU_HOST_REAL",
  "port": 6869
}
```

No modo **remote**, TODAS as rotas `/api/...` são encaminhadas automaticamente para:

```
http://{host}:{port}/cdrview/processo/*
```

---

# Endpoints da API

## **Listar Processos**

### Frontend →  
```
GET /api/processos/list
```

### Backend Local →  
Lê `processos.json`

### Backend Remote →  
```
GET http://{host}:{port}/cdrview/processo/listar
```

---

## **Iniciar Processo**

### Rota (frontend):
```
POST /api/proxy/iniciar
```

### Body:
```json
{
  "host": "Machine01",
  "processo": "parsergen.exe",
  "argumentos": "--type=cdr"
}
```

### Se remote está ativo →  
Proxy para:
```
POST http://{host}:{port}/cdrview/processo/iniciar
```

---

## **Parar Processo**

### Rota (frontend):
```
POST /api/proxy/parar
```

### Body:
```json
{
  "host": "Machine01",
  "processo": "parsergen.exe"
}
```

### Se remote está ativo →  
Proxy para:
```
POST http://{host}:{port}/cdrview/processo/parar
```

---

# Gerenciar Configurações (CRUD)

### **Listar**
```
GET /api/configs/list
```

### **Criar**
```
POST /api/configs/create
```

### **Editar**
```
POST /api/configs/update
```

### **Excluir**
```
POST /api/configs/delete
```

---

# Funcionalidades da Interface

## **1. Iniciar Processos**
- Formulário com Host / Processo / Argumentos  
- Integração com `/api/proxy/iniciar`  
- Feedback de sucesso/erro  

## **2. Parar Processos**
- Formulário simples  
- Botão de parada  
- Proxy automático no modo remote  

## **3. Listar Processos**
- DataTable responsiva  
- Busca  
- Paginação  
- Status (Running / Stopped)  
- Botão **"Ver Detalhes"**

## **4. Detalhes do Processo**
Exibe:
- Host  
- PID  
- Status  
- Início  
- Duração  
- Argumentos  

## **5. Configurações**
- CRUD completo  
- Campos: Nome, Processo, Servidor, Central, Argumentos  
- Botões **Editar / Excluir** lado a lado  
- Tabela DataTable paginada  

---

# Configuração Adicional

### **Alterar cor da sidebar**

No arquivo:

```
src/main.jsx
```

Altere:

```jsx
backgroundColor:'#2F3640'
```

Para exemplo branco:

```jsx
backgroundColor:'#FFFFFF'
color:'#000'
```

---

# Desenvolvimento

### Backend
```bash
npm run server
```

### Frontend
```bash
npm run dev
npm run build
npm run preview
```

---

# Licença
ISC
