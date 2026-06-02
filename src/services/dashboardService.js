import api from "./api";

const dashboardService = {
    buscarDashboard() {
        return api.get("/dashboard");
    },
};

export default dashboardService;