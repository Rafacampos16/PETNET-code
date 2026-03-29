import api from "./api";

const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};

export default authService;
