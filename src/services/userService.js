import api from "./api"; // axios configurado

export const userService = {
  showUser: (cpf) => api.get(`/users/${cpf}`),
  createUser: (data) => api.post("/users", data),
  listUsers: () => api.get("/users"),
  deleteUser: (cpf) => api.delete(`/users/${cpf}`),
  updateUser: (cpf, data) => api.put(`/users/${cpf}`, data),
  removerFoto: async (cpf) => {
    const response = await api.delete(`/users/${cpf}/picture`);
    return response.data;
  },
};
