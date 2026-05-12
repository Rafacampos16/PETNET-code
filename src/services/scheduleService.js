import api from "./api";
 
const scheduleService = {
  listar: (initialDate, finalDate) =>
    api.get("/schedules", {
      params: { initial_date: initialDate, final_date: finalDate },
    }),
 
  buscarPorId: (id) => api.get(`/schedules/${id}`),
 
  criar: (dados) => api.post("/schedules", dados),
 
  atualizar: (id, dados) => api.put(`/schedules/${id}`, dados),
 
  deletar: (id) => api.delete(`/schedules/${id}`),
};
 
export default scheduleService;
 