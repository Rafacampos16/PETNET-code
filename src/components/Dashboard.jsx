import React, { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../styles/Dashboard.css";

const servicesData = [
  { name: "Banho", value: 120 },
  { name: "Tosa", value: 85 },
  { name: "Consulta", value: 60 },
  { name: "Vacina", value: 40 }
];

const monthlyData = {
  Banho: [
    { month: "Jan", value: 30 }, { month: "Fev", value: 22 }, { month: "Mar", value: 68 }
  ],
  Tosa: [
    { month: "Jan", value: 15 }, { month: "Fev", value: 44 }, { month: "Mar", value: 26 }
  ],
  Consulta: [
    { month: "Jan", value: 12 }, { month: "Fev", value: 30 }, { month: "Mar", value: 18 }
  ],
  Vacina: [
    { month: "Jan", value: 8 }, { month: "Fev", value: 12 }, { month: "Mar", value: 20 }
  ],
};

export default function Dashboard() {
  const [selectedService, setSelectedService] = useState("Banho");

  const colors = ["#3b82f6", "#6366f1", "#10b981", "#f97316"];

  return (
    <div className="dashboard-container">
      <h2 className="title">Dashboard Analítica</h2>

      <div className="cards-container">
        <div className="card"><span>Agendamentos</span><h3>87</h3></div>
        <div className="card"><span>Clientes</span><h3>136</h3></div>
        <div className="card"><span>Pets</span><h3>213</h3></div>
        <div className="card"><span>Status Finalizados</span><h3>64</h3></div>
      </div>

      <div className="charts">
        <div className="chart">
          <h3>Serviços mais realizados</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={servicesData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                onClick={data => setSelectedService(data.name)}
              >
                {servicesData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Quantidade / Mensal - {selectedService}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData[selectedService]}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
