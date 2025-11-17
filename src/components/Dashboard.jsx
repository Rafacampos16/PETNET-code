import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [servicoSelecionado, setServicoSelecionado] = useState("Banho");

  const dadosPizza = [
    { name: "Banho", value: 23.7 },
    { name: "Corte de unhas", value: 10.2 },
    { name: "Cronograma capilar", value: 6.8 },
    { name: "Escovação dental", value: 8.4 },
    { name: "Hidratação", value: 12.9 },
    { name: "Higiene dos ouvidos", value: 10.2 },
    { name: "Teste de porosidade", value: 6.8 },
    { name: "Tosa", value: 15.3 }
  ];

  // EXEMPLO — esses dados você pode substituir pelos seus dados reais de backend
  const dadosMensais = {
    "Banho":       [40, 52, 61, 48, 72, 65, 70, 80, 74, 69, 63, 55],
    "Corte de unhas": [20, 22, 18, 25, 30, 28, 31, 29, 24, 21, 20, 19],
    "Cronograma capilar": [10, 8, 12, 11, 15, 16, 12, 14, 13, 10, 9, 8],
    "Escovação dental": [14, 12, 16, 18, 20, 22, 19, 21, 20, 18, 16, 17],
    "Hidratação": [25, 28, 26, 30, 35, 38, 40, 42, 39, 36, 32, 29],
    "Higiene dos ouvidos": [18, 20, 22, 19, 23, 24, 26, 27, 25, 21, 20, 19],
    "Teste de porosidade": [8, 7, 6, 9, 10, 11, 12, 10, 9, 8, 7, 6],
    "Tosa": [30, 32, 35, 31, 45, 40, 44, 46, 42, 38, 35, 33]
  };

  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const dadosBarra = meses.map((mes, i) => ({
    mes,
    quantidade: dadosMensais[servicoSelecionado][i]
  }));

  const cores = ["#B59DF2", "#F7ABAE", "#8ED0F7", "#A7E2AA", "#FDBA89", "#A8C4FA", "#FF91A4", "#F8E88C"];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-charts">
        
       {/* ================= GRÁFICO DE PIZZA ================= */}
        <div className="chart-box">
          <h3 className="chart-title">Distribuição dos Serviços</h3>

          <div className="grafico-container">
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
               <Pie
                data={dadosPizza}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, value }) => `${((value / dadosPizza.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1)}%`}
                labelStyle={{ fontSize: "12px", fill: "#333" }}
                onClick={(data) => setServicoSelecionado(data.name)}
              >
                {dadosPizza.map((entry, index) => (
                  <Cell key={index} fill={cores[index]} style={{ cursor: "pointer" }} />
                ))}
              </Pie>


                <Tooltip />
                <Legend verticalAlign="middle" layout="vertical" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* ================= GRÁFICO DE BARRAS DINÂMICO ================= */}
        <div className="chart-box">
          <h3 className="chart-title" style={{ textAlign: "center", marginBottom: 10 }}>
            Quantidade mensal — <span style={{ color: "var(--petnet-blue)" }}>{servicoSelecionado}</span>
          </h3>

          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={dadosBarra}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3370EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
