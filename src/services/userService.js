import api from "./api"; // axios configurado

export const userService = {
  createUser: (data) => api.post("/users", data),
  listUsers: () => api.get("/users"),
  deleteUser: (cpf) => api.delete(`/users/${cpf}`),
  updateUser: (cpf, data) => api.patch(`/users/${cpf}`, data),
  updateAddress: (cpf, endId, data) => api.put(`/users/${cpf}/${endId}`, data),
};
