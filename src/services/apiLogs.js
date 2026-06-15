import axios from "axios";

const apiLogs = axios.create({
  baseURL: import.meta.env.VITE_API_LOGS_BASE_URL,
  withCredentials: true, // envia o cookie JWT automaticamente
});

export default apiLogs;