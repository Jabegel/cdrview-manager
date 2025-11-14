
import axios from 'axios';
const API = axios.create({baseURL:"http://localhost:4000/cdrview"});

export default {
 listarProcessos:async()=> (await API.post('/processo/listar',{})).data,
 iniciar:async(b)=> (await API.post('/processo/iniciar',b)).data,
 parar:async(b)=> (await API.post('/processo/parar',b)).data,
 listarHosts:async()=> (await API.get('/processo/configuracao/hosts')).data,
 listarConfigs:async()=> (await API.get('/processo/configuracao')).data
};
