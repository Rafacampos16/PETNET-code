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
import AdminIcon from "../assets/icons/admin.png";
import AdminIconHover from "../assets/icons/admin-hover.png";
import ColaboradorIcon from "../assets/icons/colaborador.png";
import ColaboradorIconHover from "../assets/icons/colaborador-hover.png";

import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isColaboradorPage = location.pathname.startsWith("/colaborador");

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isUser = localStorage.getItem("isUser") === "true";
  const isColaborador = localStorage.getItem("isColaborador") === "true";

  const [petsHover, setPetsHover] = useState(false);
  const [pataHover, setPataHover] = useState(false);
  const [contaHover, setContaHover] = useState(false);
  const [homeHover, setHomeHover] = useState(false);

  const [admPetsHover, setAdmPetsHover] = useState(false);
  const [admClientsHover, setAdmClientsHover] = useState(false);
  const [admAgendHover, setAdmAgendHover] = useState(false);
  const [admStatusHover, setAdmStatusHover] = useState(false);
  const [adminHover, setAdminHover] = useState(false);

  const [colabAgendaHover, setColabAgendaHover] = useState(false);
  const [colabPetsHover, setColabPetsHover] = useState(false);
  const [colabStatusHover, setColabStatusHover] = useState(false);
  const [colabClientsHover, setColabClientsHover] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div
            className="logo-center"
            onClick={() =>
              navigate(
                isAdminPage
                  ? "/admin"
                  : isColaboradorPage
                    ? "/colaborador"
                    : "/"
              )
            }
            style={{ cursor: "pointer" }}
          >
            {isAdminPage
              ? "ADMINISTRAÇÃO"
              : isColaboradorPage
                ? "COLABORADOR"
                : "PETNET"}
          </div>

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          </div>

          <div className={`header-right ${isAdminPage ? "admin-nav" : ""}`}>
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
                  <span
                    style={{ color: homeHover ? "var(--petnet-yellow)" : "white" }}
                  >
                    Home
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setAdminHover(true)}
                  onMouseLeave={() => setAdminHover(false)}
                  onClick={() => navigate("/admin")}
                >
                  <img
                    src={adminHover ? AdminIconHover : AdminIcon}
                    alt="Administração"
                    className="icon-link"
                  />
                  <span
                    style={{ color: adminHover ? "var(--petnet-yellow)" : "white" }}
                  >
                    Gerência
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
                    alt="Agendamentos"
                    className="icon-link"
                  />
                  <span
                    style={{ color: admAgendHover ? "var(--petnet-yellow)" : "white" }}
                  >
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
                    alt="Clientes"
                    className="icon-link"
                  />
                  <span
                    style={{ color: admClientsHover ? "var(--petnet-yellow)" : "white" }}
                  >
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
                    alt="Pets"
                    className="icon-link"
                  />
                  <span
                    style={{ color: admPetsHover ? "var(--petnet-yellow)" : "white" }}
                  >
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
                    alt="Status"
                    className="icon-link"
                  />
                  <span
                    style={{ color: admStatusHover ? "var(--petnet-yellow)" : "white" }}
                  >
                    Status
                  </span>
                </div>
              </>
            )}

            {isColaboradorPage && (
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
                  <span
                    style={{ color: homeHover ? "var(--petnet-yellow)" : "white" }}
                  >
                    Home
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setColabAgendaHover(true)}
                  onMouseLeave={() => setColabAgendaHover(false)}
                  onClick={() => navigate("/colaborador")}
                >
                  <img
                    src={
                      colabAgendaHover ? ColaboradorIconHover : ColaboradorIcon
                    }
                    alt="Minha Agenda"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: colabAgendaHover ? "var(--petnet-yellow)" : "white",
                    }}
                  >
                    Agenda
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setColabClientsHover(true)}
                  onMouseLeave={() => setColabClientsHover(false)}
                  onClick={() => navigate("/admin/clientes")}
                >
                  <img
                    src={colabClientsHover ? ClienteIconHover : ClienteIcon}
                    alt="Clientes"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: colabClientsHover ? "var(--petnet-yellow)" : "white",
                    }}
                  >
                    Clientes
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setColabPetsHover(true)}
                  onMouseLeave={() => setColabPetsHover(false)}
                  onClick={() => navigate("/admin/pets")}
                >
                  <img
                    src={colabPetsHover ? PetsAdmIconHover : PetsAdmIcon}
                    alt="Pets"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: colabPetsHover ? "var(--petnet-yellow)" : "white",
                    }}
                  >
                    Pets
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setColabStatusHover(true)}
                  onMouseLeave={() => setColabStatusHover(false)}
                  onClick={() => navigate("/admin/status")}
                >
                  <img
                    src={colabStatusHover ? StatusIconHover : StatusIcon}
                    alt="Status"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: colabStatusHover ? "var(--petnet-yellow)" : "white",
                    }}
                  >
                    Status
                  </span>
                </div>
              </>
            )}

            {!isAdminPage && !isColaboradorPage && (
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
                  <span
                    style={{ color: homeHover ? "var(--petnet-yellow)" : "white" }}
                  >
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
                  <span
                    style={{ color: petsHover ? "var(--petnet-yellow)" : "white" }}
                  >
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
                    src={pataHover ? PetsAdmIconHover : PetsAdmIcon}
                    alt="Pets"
                    className="icon-link"
                  />
                  <span
                    style={{ color: pataHover ? "var(--petnet-yellow)" : "white" }}
                  >
                    Pets
                  </span>
                </div>

                {isAdmin && (
                  <div
                    className="menu-item"
                    onMouseEnter={() => setAdminHover(true)}
                    onMouseLeave={() => setAdminHover(false)}
                    onClick={() => navigate("/admin")}
                  >
                    <img
                      src={adminHover ? AdminIconHover : AdminIcon}
                      alt="Gerência"
                      className="icon-link"
                    />
                    <span
                      style={{
                        color: adminHover ? "var(--petnet-yellow)" : "white",
                      }}
                    >
                      Gerência
                    </span>
                  </div>
                )}

                <div
                  className="menu-item"
                  onMouseEnter={() => setContaHover(true)}
                  onMouseLeave={() => setContaHover(false)}
                  onClick={() => {
                    if (isAdmin) {
                      navigate("/minhaconta");
                    } else if (isColaborador) {
                      navigate("/colaborador");
                    } else if (isUser) {
                      navigate("/minhaconta");
                    } else {
                      navigate("/conta");
                    }
                  }}
                >
                  <img
                    src={contaHover ? ContaIconHover : ContaIcon}
                    alt="Conta"
                    className="icon-link"
                  />
                  <span
                    style={{ color: contaHover ? "var(--petnet-yellow)" : "white" }}
                  >
                    Conta
                  </span>
                </div>
              </>
            )}
          </div>

          <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
            {isAdminPage ? (
              <>
                <span onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</span>
                <span onClick={() => { navigate("/admin"); setMenuOpen(false); }}>Administração</span>
                <span onClick={() => { navigate("/admin/agendamentos"); setMenuOpen(false); }}>Agendamentos</span>
                <span onClick={() => { navigate("/admin/clientes"); setMenuOpen(false); }}>Clientes</span>
                <span onClick={() => { navigate("/admin/pets"); setMenuOpen(false); }}>Pets</span>
                <span onClick={() => { navigate("/admin/status"); setMenuOpen(false); }}>Status</span>
              </>
            ) : isColaboradorPage ? (
              <>
                <span onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</span>
                <span onClick={() => { navigate("/colaborador"); setMenuOpen(false); }}>Agenda</span>
                <span onClick={() => { navigate("/admin/clientes"); setMenuOpen(false); }}>Clientes</span>
                <span onClick={() => { navigate("/admin/pets"); setMenuOpen(false); }}>Pets</span>
                <span onClick={() => { navigate("/admin/status"); setMenuOpen(false); }}>Status</span>
              </>
            ) : (
              <>
                <span onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</span>
                <span onClick={() => { navigate("/servicos"); setMenuOpen(false); }}>Serviços</span>
                <span onClick={() => { navigate("/pets"); setMenuOpen(false); }}>Pets</span>

                {isAdmin && (
                  <span onClick={() => { navigate("/admin"); setMenuOpen(false); }}>
                    Gerência
                  </span>
                )}

                <span
                  onClick={() => {
                    if (isAdmin) {
                      navigate("/minhaconta");
                    } else if (isColaborador) {
                      navigate("/colaborador");
                    } else if (isUser) {
                      navigate("/minhaconta");
                    } else {
                      navigate("/conta");
                    }
                    setMenuOpen(false);
                  }}
                >
                  Conta
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;