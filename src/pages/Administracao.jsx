import React from "react";
import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard.jsx";  // <-- CORRETO
import "../styles/administracao.css";

const Administracao = () => {
  return (
    <div className="admin-container">
    

      <div className="cards-container">
        <Link to="/agendamentos" className="admin-card">
          <span>AGENDAMENTOS</span>
        </Link>

        <Link to="/clientes" className="admin-card">
          <span>CLIENTES</span>
        </Link>

        <Link to="/pets" className="admin-card">
          <span>PETS</span>
        </Link>

        <Link to="/status" className="admin-card">
          <span>STATUS</span>
        </Link>
      </div>

    <Dashboard />
      
    </div>
  );
};

export default Administracao;
