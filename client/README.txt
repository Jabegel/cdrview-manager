CDRView Manager - React + Express (server/client)
------------------------------------------------
Structure:

/server  -> Express server that proxies to real CDRView API or serves mock data
/client  -> React app (minimal, created with CRA conventions)

Quick start (server):
- cd server
- npm install
- set env vars if needed:
    SERVER_USE_MOCK=true  (default true)
    CDRVIEW_BASE=http://host:6869/cdrview
  then: npm start (server runs on 4000)

Quick start (client):
- cd client
- npm install
- npm start (starts React dev server on 3000)
The client calls the server at http://localhost:4000/cdrview by default.
