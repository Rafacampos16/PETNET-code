import api from "./api";

const serviceService = {
  listar: async () => {
    const res = await api.get("/services");
    return res.data;
  },

  criar: async (dados) => {
    const res = await api.post("/services", dados);
    return res.data;
  },

  atualizar: async (id, dados) => {
    const res = await api.put(`/services/${id}`, dados);
    return res.data;
  },

  deletar: async (id) => {
    const res = await api.delete(`/services/${id}`);
    return res.data;
  },

  reativar: async (id) => {
    const res = await api.patch(`/services/${id}/reactivate`);
    return res.data;
  },
};

export default serviceService;