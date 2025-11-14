# cdrview-manager (Bootstrap + DataTable)

Projeto com layout claro usando Bootstrap 5, React + Vite e backend Node/Express com persistência em JSON.
Tabelas usam react-data-table-component (DataTable estilo React).

## Como rodar
1. `npm install`
2. `npm run server`  (backend em http://localhost:3000)
3. `npm run dev`     (frontend em http://localhost:5173)

## Páginas
- /processos - lista de processos (DataTable), ações Iniciar/Parar
- /configuracoes - CRUD de configurações (DataTable + modal)

Dados persistidos em `server/database/*.json`.