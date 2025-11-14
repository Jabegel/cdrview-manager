CDRView Manager — Rebuild from zero following the PDF and prototypes.

How to run (local):
1. Install server dependencies:
   cd server
   npm install
2. Start server (serves client on / and api on /api):
   npm run server
3. Open browser: http://localhost:3000/

Notes:
- Server runs in local mode by default (server/config/server-config.json).
- Client is a static SPA in client/index.html adapted from your prototype.
- Endpoints implemented: /api/configuracoes (GET/POST/PUT/DELETE), /api/processos (list/iniciar/parar), /api/processos/iniciar-multiplos, /api/processos/parar-multiplos, /api/processos/details, /api/processo/configuracao/hosts, /api/processo/configuracao/centrais
