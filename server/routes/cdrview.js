
import { Router } from 'express';
import * as c from '../controllers/cdrviewController.js';
const r=Router();

r.get('/processo/configuracao/hosts',c.listarHosts);
r.get('/processo/configuracao',c.getConfiguracoes);
r.post('/processo/iniciar',c.iniciarProcesso);
r.post('/processo/listar',c.listarProcessos);
r.post('/processo/parar',c.pararProcesso);

export default r;
