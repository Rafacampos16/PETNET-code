import axios from "axios";
 
const apiLogs = axios.create({
  baseURL: "http://localhost:8080/",
    headers: {
  Authorization: "seu-token-estatico-aqui",
},

});
 
export default apiLogs;
 
// import axios from "axios";
// const apiLogs = axios.create({
//   baseURL: "/api-logs",
//     headers: {
//    Authorization: "seu-token-estatico-aqui",
 // },

// });
// export default apiLogs;
// alterar quando for para produção, para o endereço do backend de logs, e configurar o proxy no package.json
 
