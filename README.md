# 📘 CDRView Manager — Projeto Completo

Sistema completo de gerenciamento de processos do **CDRView**, com interface moderna, responsiva e integração com endpoints reais do sistema (`/cdrview/processo/...`).

Permite:

- ▶️ Iniciar processos
- ⏹️ Parar processos
- 📋 Listar processos
- 🔍 Visualizar detalhes
- ⚙️ Gerenciar configurações

## 🚀 Tecnologias

### Backend
- Node.js + Express
- CORS habilitado
- Proxy para servidor real
- Persistência via JSON
- Modo local/remote via server-config.json

### Frontend
- React + Vite
- Bootstrap 5
- React Router
- DataTable
- Sidebar responsiva

## 📁 Estrutura do Projeto

```
cdrview-manager/
├── server/
│   ├── server.js
│   ├── config/server-config.json
│   └── database/
│       ├── processos.json
│       └── configs.json
└── src/
    ├── main.jsx
    ├── pages/
    │   ├── Start/Start.jsx
    │   ├── Stop/Stop.jsx
    │   ├── List/List.jsx
    │   ├── Details/Details.jsx
    │   └── Config/Configuracoes.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔧 Instalação
```bash
npm install
```

## ▶️ Execução

### Backend
```bash
npm run server
```

### Frontend
```bash
npm run dev
```

## 🌐 Modo Local/Remote

Arquivo:
```
server/config/server-config.json
```

## 📄 Licença
ISC
