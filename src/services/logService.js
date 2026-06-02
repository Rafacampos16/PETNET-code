import apiLogs from "./apiLogs";

const logService = {
  listar: () => apiLogs.get("/logs"),
};

export default logService;