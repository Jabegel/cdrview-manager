
import axios from "axios";

const apiBase = "/cdrview";

export default {
  async listarHosts() {
    const res = await axios.get(`${apiBase}/processo/configuracao/hosts`);
    return res.data;
  },
  async listarCentrais(host) {
    const res = await axios.get(`${apiBase}/processo/configuracao/centrais/${host}`);
    return res.data;
  },
  async getConfiguracoes() {
    const res = await axios.get(`${apiBase}/processo/configuracao`);
    return res.data;
  },
  async salvarConfig(conf) {
    return axios.post(`${apiBase}/processo/configuracao`, { configuracao: [conf] });
  },
  async deletarConfig(nome) {
    return axios.delete(`${apiBase}/processo/configuracao/${encodeURIComponent(nome)}`);
  },
  async iniciarProcesso(body) {
    const res = await axios.post(`${apiBase}/processo/iniciar`, body);
    return res.data;
  },
  async listarProcessos() {
    const res = await axios.post(`${apiBase}/processo/listar`, {});
    return res.data;
  },
  async pararProcesso(body) {
    const res = await axios.post(`${apiBase}/processo/parar`, body);
    return res.data;
  }
};
