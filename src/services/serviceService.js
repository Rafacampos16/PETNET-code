import api from "./api";

const serviceService = {
  listar: async () => {
    const res = await api.get("/services");
    return res.data;
  },
};

export default serviceService;