import axios from "axios";

const apiLogs = axios.create({
  baseURL: import.meta.env.VITE_API_LOGS_BASE_URL,
  headers: {
    Authorization: import.meta.env.VITE_API_LOGS_TOKEN,
  },

});

export default apiLogs;

