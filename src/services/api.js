import axios from "axios";

const api = axios.create({
  baseURL: "https://entire-reeba-petnet-fd3e30b7.koyeb.app/api",
});

export default api;
