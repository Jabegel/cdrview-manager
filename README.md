# cdrview-manager (Complete - matches PDF)

Projeto completo com telas Iniciar, Parar, Listar, Detalhes e Configurações.
Backend local com JSON persistence e modo `remote` que faz proxy para os endpoints reais do CDRView.

Endpoints reais esperados (conforme PDF):
- POST http://{host}:{port}/cdrview/processo/iniciar
- POST http://{host}:{port}/cdrview/processo/parar
- POST http://{host}:{port}/cdrview/processo/listar
- GET  http://{host}:{port}/cdrview/processo/configuracao
- GET  http://{host}:{port}/cdrview/processo/configuracao/hosts
- GET  http://{host}:{port}/cdrview/processo/configuracao/centrais

Como rodar:
1. npm install
2. npm run server
3. npm run dev