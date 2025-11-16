📘 CDRView Manager — Projeto Completo

Sistema completo de gerenciamento de processos do CDRView, com interface moderna, responsiva e integração com endpoints reais do sistema (/cdrview/processo/...).

Permite:

Iniciar processos

Parar processos

Listar processos

Visualizar detalhes

Gerenciar configurações

🚀 Tecnologias
Backend

Node.js + Express

CORS habilitado

Proxy automático para o servidor real do CDRView

Persistência local via JSON (modo local)

Alternância entre modo local e remote via arquivo de configuração (server-config.json)

Frontend

React + Vite

Bootstrap 5

Sidebar responsiva com tema escuro (cores ajustadas)

DataTable responsivo (react-data-table-component)

React Router

Comunicação via API REST

📁 Estrutura do Projeto
cdrview-manager/
├── server/                     # Backend Node.js + Express
│   ├── server.js               # Servidor principal
│   ├── config/
│   │   └── server-config.json  # Configuração do modo local ou remote
│   └── database/
│       ├── processos.json      # Dados locais
│       └── configs.json        # Configurações locais
│
└── src/                        # Frontend React + Vite
    ├── main.jsx                # App + Sidebar
    ├── pages/
    │   ├── Start/Start.jsx     # Iniciar processos
    │   ├── Stop/Stop.jsx       # Parar processos
    │   ├── List/List.jsx       # Listar processos
    │   ├── Details/Details.jsx # Tela de detalhes
    │   └── Config/Configuracoes.jsx # CRUD de configurações
    ├── index.html
    ├── vite.config.js          # Proxy + ajustes do Vite
    └── package.json

🔧 Instalação
1. Instalar dependências
npm install

▶️ Executar o Projeto
Opção 1 — Executar separadamente
Backend
npm run server
# http://localhost:3000

Frontend
npm run dev
# http://localhost:5173

Opção 2 — Executar em background
Backend:
nohup npm run server > server.log 2>&1 &

Frontend:
nohup npm run dev > client.log 2>&1 &

🌐 Modo Local vs Remote

Configuração em:

server/config/server-config.json

Modo Local
{
  "mode": "local",
  "host": "localhost",
  "port": 3000
}

Modo Remote
{
  "mode": "remote",
  "host": "SERVIDOR_REAL",
  "port": 6869
}


Quando remoto está ativo, todas as rotas /api/... são redirecionadas automaticamente para:

http://{host}:{port}/cdrview/processo/*

🌐 Endpoints da API
📌 Listar Processos

Frontend:

GET /api/processos/list


Local:
Lê processos.json

Remote:

GET http://{host}:{port}/cdrview/processo/listar

▶️ Iniciar Processo

Rota:

POST /api/proxy/iniciar


Body:

{
  "host": "Machine01",
  "processo": "parsergen.exe",
  "argumentos": "--type=cdr"
}


Remote:
Encaminha para /cdrview/processo/iniciar

⏹️ Parar Processo

Rota:

POST /api/proxy/parar


Body:

{
  "host": "Machine01",
  "processo": "parsergen.exe"
}


Remote:
Encaminha para /cdrview/processo/parar

⚙️ Gerenciar Configurações (CRUD)
Listar
GET /api/configs/list

Criar
POST /api/configs/create

Editar
POST /api/configs/update

Excluir
POST /api/configs/delete

🎨 Funcionalidades da Interface
1. Iniciar Processos

Formulário simples e direto

Integração com /api/proxy/iniciar

Feedback visual de sucesso/erro

2. Parar Processos

Formulário com Host + Processo

Botão para parada imediata

3. Lista de Processos

DataTable com:

Paginação

Busca

Ordenação

Ações na linha

Acesso direto aos detalhes

4. Detalhes

Exibe:

Host

PID

Argumentos

Status

Tempo de execução

5. Configurações

CRUD completo

Modal de criação/edição

Tabela responsiva

🎨 Personalização de Cores (Sidebar)

Arquivo:

src/main.jsx


Exemplo:

backgroundColor:'#2F3640'


Alterar para tema claro:

backgroundColor:'#FFFFFF',
color:'#000'

🛠️ Desenvolvimento
Backend
npm run server

Frontend
npm run dev
npm run build
npm run preview

📄 Licença

ISC