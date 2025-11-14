import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:4000/cdrview' });

export default {
  listarProcessos: async () => (await API.post('/processo/listar', {})).data,
  iniciarProcesso: async (body) => (await API.post('/processo/iniciar', body)).data,
  pararProcesso: async (body) => (await API.post('/processo/parar', body)).data,
  listarHosts: async () => (await API.get('/processo/configuracao/hosts')).data,
  listarCentrais: async (h) => (await API.get(`/processo/configuracao/centrais/${h}`)).data,
  getConfiguracoes: async () => (await API.get('/processo/configuracao')).data,
  salvarConfig: async (c) => (await API.post('/processo/configuracao', { configuracao: [c] })).data
};
