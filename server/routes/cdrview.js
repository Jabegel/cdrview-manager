import { Router } from 'express';
import * as ctrl from '../controllers/cdrviewController.js';

const router = Router();

// configuration endpoints (GET, POST, DELETE)
router.get('/processo/configuracao/hosts', ctrl.listarHosts);
router.get('/processo/configuracao/centrais', ctrl.listarCentrais);
router.get('/processo/configuracao/centrais/:host', ctrl.listarCentraisPorHost);
router.get('/processo/configuracao', ctrl.getConfiguracoes);
router.post('/processo/configuracao', ctrl.salvarConfig);
router.delete('/processo/configuracao/:nome', ctrl.deletarConfig);

// process endpoints
router.post('/processo/iniciar', ctrl.iniciarProcesso);
router.post('/processo/listar', ctrl.listarProcessos);
router.post('/processo/parar', ctrl.pararProcesso);

export default router;
