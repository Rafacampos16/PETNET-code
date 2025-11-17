import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PataIcon from "../assets/icons/pata.png";
import PetsIcon from "../assets/icons/pets.png";
import ContaIcon from "../assets/icons/conta.png";

import HomeIcon from "../assets/icons/home.png"; 
import HomeIconHover from "../assets/icons/home-h.png"; 
import PetsIconHover from "../assets/icons/pets-h.png";
import PataIconHover from "../assets/icons/pata-h.png";
import ContaIconHover from "../assets/icons/conta-h.png";
import AgendamentoIcon from "../assets/icons/agendamento.png";
import AgendamentoIconHover from "../assets/icons/agendamento-h.png";
import ClienteIcon from "../assets/icons/clientes.png";
import ClienteIconHover from "../assets/icons/clientes-h.png";
import PetsAdmIcon from "../assets/icons/petsadm.png";
import PetsAdmIconHover from "../assets/icons/petsadm-h.png";
import StatusIcon from "../assets/icons/status.png";
import StatusIconHover from "../assets/icons/status-h.png";

import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  const [petsHover, setPetsHover] = useState(false);
  const [pataHover, setPataHover] = useState(false);
  const [contaHover, setContaHover] = useState(false);
  const [homeHover, setHomeHover] = useState(false);

  // Hovers da admin
  const [admPetsHover, setAdmPetsHover] = useState(false);
  const [admClientsHover, setAdmClientsHover] = useState(false);
  const [admAgendHover, setAdmAgendHover] = useState(false);
  const [admStatusHover, setAdmStatusHover] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">

          {/* LOGO CENTRAL */}
          <div
            className="logo-center"
            onClick={() => navigate(isAdminPage ? "/admin" : "/")}
            style={{ cursor: "pointer" }}
          >
            {isAdminPage ? "ADMINISTRAÇÃO" : "PETNET"}
          </div>

          {/* Menu Hamburger */}
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          </div>

          {/* ------- DESKTOP NAV ------- */}
          <div className={`header-right ${isAdminPage ? "admin-nav" : ""}`}>


            {/* NAVBAR ADMIN */}
            {isAdminPage && (
              <>
                <div
                  className="menu-item"
                  onMouseEnter={() => setHomeHover(true)}
                  onMouseLeave={() => setHomeHover(false)}
                  onClick={() => navigate("/")}
                >
                  <img
                    src={homeHover ? HomeIconHover : HomeIcon}
                    alt="Home"
                    className="icon-link"
                  />
                  <span style={{ color: homeHover ? "var(--petnet-yellow)" : "white" }}>
                    Home
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setAdmAgendHover(true)}
                  onMouseLeave={() => setAdmAgendHover(false)}
                  onClick={() => navigate("/admin/agendamentos")}
                >
                  <img
                    src={admAgendHover ? AgendamentoIconHover : AgendamentoIcon}
                    alt="Home"
                    className="icon-link"
                  />
                  <span style={{ color: admAgendHover ? "var(--petnet-yellow)" : "white" }}>
                    Agendar
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setAdmClientsHover(true)}
                  onMouseLeave={() => setAdmClientsHover(false)}
                  onClick={() => navigate("/admin/clientes")}
                >
                  <img
                    src={admClientsHover ? ClienteIconHover : ClienteIcon}
                    alt="Home"
                    className="icon-link"
                  />
                  <span style={{ color: admClientsHover ? "var(--petnet-yellow)" : "white" }}>
                    Clientes
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setAdmPetsHover(true)}
                  onMouseLeave={() => setAdmPetsHover(false)}
                  onClick={() => navigate("/admin/pets")}
                >
                    <img
                    src={admPetsHover ? PetsAdmIconHover : PetsAdmIcon}
                    alt="Home"
                    className="icon-link"
                  />
                  <span style={{ color: admPetsHover ? "var(--petnet-yellow)" : "white" }}>
                    Pets
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setAdmStatusHover(true)}
                  onMouseLeave={() => setAdmStatusHover(false)}
                  onClick={() => navigate("/admin/status")}
                >
                 <img
                    src={admStatusHover ? StatusIconHover : StatusIcon}
                    alt="Home"
                    className="icon-link"
                  />
                  <span style={{ color: admStatusHover ? "var(--petnet-yellow)" : "white" }}>
                    Status
                  </span>
                </div>
              </>
            )}

            {/* NAV NORMAL */}
            {!isAdminPage && (
              <>
              <div
                  className="menu-item"
                  onMouseEnter={() => setHomeHover(true)}
                  onMouseLeave={() => setHomeHover(false)}
                  onClick={() => navigate("/")}
                >
                  <img
                    src={homeHover ? HomeIconHover : HomeIcon}
                    alt="Home"
                    className="icon-link"
                  />
                  <span style={{ color: homeHover ? "var(--petnet-yellow)" : "white" }}>
                    Home
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setPetsHover(true)}
                  onMouseLeave={() => setPetsHover(false)}
                  onClick={() => navigate("/servicos")}
                >
                  <img
                    src={petsHover ? PetsIconHover : PetsIcon}
                    alt="Serviços"
                    className="icon-link"
                  />
                  <span style={{ color: petsHover ? "var(--petnet-yellow)" : "white" }}>
                    Serviços
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setPataHover(true)}
                  onMouseLeave={() => setPataHover(false)}
                  onClick={() => navigate("/pets")}
                >
                  <img
                    src={pataHover ? PataIconHover : PataIcon}
                    alt="Pets"
                    className="icon-link"
                  />
                  <span style={{ color: pataHover ? "var(--petnet-yellow)" : "white" }}>
                    Pets
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setContaHover(true)}
                  onMouseLeave={() => setContaHover(false)}
                  onClick={() => navigate("/conta")}
                >
                  <img
                    src={contaHover ? ContaIconHover : ContaIcon}
                    alt="Conta"
                    className="icon-link"
                  />
                  <span style={{ color: contaHover ? "var(--petnet-yellow)" : "white" }}>
                    Conta
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ------- MOBILE ------- */}
          <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
            {isAdminPage ? (
              <>
                <span onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</span>
                <span onClick={() => { navigate("/admin/agendamentos"); setMenuOpen(false); }}>Agendamentos</span>
                <span onClick={() => { navigate("/admin/clientes"); setMenuOpen(false); }}>Clientes</span>
                <span onClick={() => { navigate("/admin/pets"); setMenuOpen(false); }}>Pets</span>
                <span onClick={() => { navigate("/admin/status"); setMenuOpen(false); }}>Status</span>
              </>
            ) : (
              <>
                <span onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</span>
                <span onClick={() => { navigate("/servicos"); setMenuOpen(false); }}>Serviços</span>
                <span onClick={() => { navigate("/pets"); setMenuOpen(false); }}>Pets</span>
                <span onClick={() => { navigate("/conta"); setMenuOpen(false); }}>Conta</span>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
