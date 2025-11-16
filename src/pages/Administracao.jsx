import React from "react";
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/Administracao.css";
import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard"; // IMPORTANDO DASHBOARD NOVA

export default function Administracao() {
  return (
    <div className="admin-container">

      {/* CARDS DA ADMIN */}
      <div className="cards-container">
        <Link to="/admin/agendamentos" className="card">AGENDAMENTOS</Link>
        <Link to="/admin/clientes" className="card">CLIENTES</Link>
        <Link to="/admin/pets" className="card">PETS</Link>
        <Link to="/admin/status" className="card">STATUS</Link>
      </div>

      {/* DASHBOARD COMPLETA */}
      <div className="dashboard-section">
        <Dashboard />
      </div>
    </div>
  );
}
