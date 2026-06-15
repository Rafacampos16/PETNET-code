import api from "./api";

const notificationService = {
  listar: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },

  marcarComoLida: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },
};

export default notificationService;