import api from "./api";

const petService = {
  criar: async (dados) => {
    const res = await api.post("/pets", dados);
    return res.data;
  },

  listar: async () => {
    const res = await api.get("/pets");
    return res.data;
  },

  buscarPorId: async (id) => {
    const res = await api.get(`/pets/${id}`);
    return res.data;
  },

  atualizar: async (id, dados) => {
    const res = await api.put(`/pets/${id}`, dados);
    return res.data;
  },

  deletar: async (id) => {
    const res = await api.delete(`/pets/${id}`);
    return res.data;
  },
};

export default petService;
