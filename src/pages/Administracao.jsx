import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard.jsx";
import "../styles/administracao.css";

import IconLogout from "../assets/icons/logout.png";
import IconLogoutHover from "../assets/icons/logout-h.png";

const Administracao = () => {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/conta");
  }

  return (
    <div className="admin-container">

      {/* BOTÃO SAIR NOVO */}
      <div className="admin-logout-wrapper">
        <button
          className="admin-logout-btn"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleLogout}
        >
          <img
            src={hover ? IconLogout : IconLogoutHover}
            alt="Sair"
            className="logout-icon"
          />
          <span>Sair</span>
        </button>
      </div>

      <div className="cards-container">
        <Link to="/admin/agendamentos" className="admin-card">
          <span>AGENDAMENTOS</span>
        </Link>

        <Link to="/admin/clientes" className="admin-card">
          <span>CLIENTES</span>
        </Link>

        <Link to="/admin/pets" className="admin-card">
          <span>PETS</span>
        </Link>

        <Link to="/admin/status" className="admin-card">
          <span>STATUS</span>
        </Link>
      </div>

     {/*  <Dashboard /> EM DESENVOLVIMENTO */}

    </div>
  );
};

export default Administracao;
