// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   withCredentials: true
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
  withCredentials: true
});

export default api;

//alterar quando for para produção, para o endereço do backend, e retirar o proxy do package.json