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

import AdminIcon from "../assets/icons/admin.png";
import AdminIconHover from "../assets/icons/admin-hover.png";

import ColaboradorIcon from "../assets/icons/status.png";
import ColaboradorIconHover from "../assets/icons/status-h.png";

import CriarServicoIcon from "../assets/icons/criarServico.png";
import CriarServicoIconHover from "../assets/icons/criarServico-hover.png";

import AgendaColaboradorIcon from "../assets/icons/agendaColaborador.png";
import AgendaColaboradorIconHover from "../assets/icons/agendaColaborador-hover.png";

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
  const [adminHover, setAdminHover] = useState(false);
  const [admServicosHover, setAdmServicosHover] = useState(false);
  const [admColaboradorHover, setAdmColaboradorHover] = useState(false);

  const [colabAgendaHover, setColabAgendaHover] = useState(false);
  const [colabHomeHover, setColabHomeHover] = useState(false);
  const [colabContaHover, setColabContaHover] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (isAdminPage) {
      navigate("/admin");
      return;
    }

    if (isColaboradorPage) {
      navigate("/colaborador");
      return;
    }

    navigate("/");
  };

  const handleContaClick = () => {
    if (isAdmin || isColaborador || isUser) {
      navigate("/minhaconta");
    } else {
      navigate("/conta");
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div
            className="logo-center"
            onClick={handleLogoClick}
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

          <div
            className={`header-right ${isAdminPage || isColaboradorPage ? "admin-nav" : ""
              }`}
          >
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
                    style={{
                      color: homeHover ? "var(--petnet-yellow)" : "white",
                    }}
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
                    style={{
                      color: adminHover ? "var(--petnet-yellow)" : "white",
                    }}
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
                    style={{
                      color: admAgendHover ? "var(--petnet-yellow)" : "white",
                    }}
                  >
                    Agendar
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setAdmServicosHover(true)}
                  onMouseLeave={() => setAdmServicosHover(false)}
                  onClick={() => navigate("/admin/servicos")}
                >
                  <img
                    src={
                      admServicosHover
                        ? CriarServicoIconHover
                        : CriarServicoIcon
                    }
                    alt="Serviços"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: admServicosHover
                        ? "var(--petnet-yellow)"
                        : "white",
                    }}
                  >
                    Serviços
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
                    style={{
                      color: admClientsHover ? "var(--petnet-yellow)" : "white",
                    }}
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
                    style={{
                      color: admPetsHover ? "var(--petnet-yellow)" : "white",
                    }}
                  >
                    Pets
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setAdmColaboradorHover(true)}
                  onMouseLeave={() => setAdmColaboradorHover(false)}
                  onClick={() => navigate("/admin/colaborador")}
                >
                  <img
                    src={
                      admColaboradorHover
                        ? ColaboradorIconHover
                        : ColaboradorIcon
                    }
                    alt="Colaborador"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: admColaboradorHover
                        ? "var(--petnet-yellow)"
                        : "white",
                    }}
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
                  onMouseEnter={() => setColabHomeHover(true)}
                  onMouseLeave={() => setColabHomeHover(false)}
                  onClick={() => navigate("/")}
                >
                  <img
                    src={colabHomeHover ? HomeIconHover : HomeIcon}
                    alt="Home"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: colabHomeHover
                        ? "var(--petnet-yellow)"
                        : "white",
                    }}
                  >
                    Home
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setColabAgendaHover(true)}
                  onMouseLeave={() => setColabAgendaHover(false)}
                  onClick={() => navigate("/colaborador/agenda")}
                >
                  <img
                    src={
                      colabAgendaHover
                        ? AgendaColaboradorIconHover
                        : AgendaColaboradorIcon
                    }
                    alt="Agenda"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: colabAgendaHover
                        ? "var(--petnet-yellow)"
                        : "white",
                    }}
                  >
                    Agenda
                  </span>
                </div>

                <div
                  className="menu-item"
                  onMouseEnter={() => setColabContaHover(true)}
                  onMouseLeave={() => setColabContaHover(false)}
                  onClick={() => navigate("/minhaconta")}
                >
                  <img
                    src={colabContaHover ? ContaIconHover : ContaIcon}
                    alt="Conta"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: colabContaHover
                        ? "var(--petnet-yellow)"
                        : "white",
                    }}
                  >
                    Conta
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
                    style={{
                      color: homeHover ? "var(--petnet-yellow)" : "white",
                    }}
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
                    style={{
                      color: petsHover ? "var(--petnet-yellow)" : "white",
                    }}
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
                    src={pataHover ? PataIconHover : PataIcon}
                    alt="Pets"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: pataHover ? "var(--petnet-yellow)" : "white",
                    }}
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

                {isColaborador && (
                  <div
                    className="menu-item"
                    onMouseEnter={() => setColabAgendaHover(true)}
                    onMouseLeave={() => setColabAgendaHover(false)}
                    onClick={() => navigate("/colaborador/agenda")}
                  >
                    <img
                      src={
                        colabAgendaHover
                          ? AgendaColaboradorIconHover
                          : AgendaColaboradorIcon
                      }
                      alt="Agenda"
                      className="icon-link"
                    />
                    <span
                      style={{
                        color: colabAgendaHover
                          ? "var(--petnet-yellow)"
                          : "white",
                      }}
                    >
                      Agenda
                    </span>
                  </div>
                )}

                <div
                  className="menu-item"
                  onMouseEnter={() => setContaHover(true)}
                  onMouseLeave={() => setContaHover(false)}
                  onClick={handleContaClick}
                >
                  <img
                    src={contaHover ? ContaIconHover : ContaIcon}
                    alt="Conta"
                    className="icon-link"
                  />
                  <span
                    style={{
                      color: contaHover ? "var(--petnet-yellow)" : "white",
                    }}
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
                <span
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                >
                  Home
                </span>

                <span
                  onClick={() => {
                    navigate("/admin");
                    setMenuOpen(false);
                  }}
                >
                  Administração
                </span>

                <span
                  onClick={() => {
                    navigate("/admin/agendamentos");
                    setMenuOpen(false);
                  }}
                >
                  Agendamentos
                </span>

                <span
                  onClick={() => {
                    navigate("/admin/servicos");
                    setMenuOpen(false);
                  }}
                >
                  Serviços
                </span>

                <span
                  onClick={() => {
                    navigate("/admin/clientes");
                    setMenuOpen(false);
                  }}
                >
                  Clientes
                </span>

                <span
                  onClick={() => {
                    navigate("/admin/pets");
                    setMenuOpen(false);
                  }}
                >
                  Pets
                </span>

                <span
                  onClick={() => {
                    navigate("/admin/colaborador");
                    setMenuOpen(false);
                  }}
                >
                  Status
                </span>
              </>
            ) : isColaboradorPage ? (
              <>
                <span
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                >
                  Home
                </span>

                <span
                  onClick={() => {
                    navigate("/colaborador/agenda");
                    setMenuOpen(false);
                  }}
                >
                  Agenda
                </span>

                <span
                  onClick={() => {
                    navigate("/minhaconta");
                    setMenuOpen(false);
                  }}
                >
                  Conta
                </span>
              </>
            ) : (
              <>
                <span
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                >
                  Home
                </span>

                <span
                  onClick={() => {
                    navigate("/servicos");
                    setMenuOpen(false);
                  }}
                >
                  Serviços
                </span>

                <span
                  onClick={() => {
                    navigate("/pets");
                    setMenuOpen(false);
                  }}
                >
                  Pets
                </span>

                {isAdmin && (
                  <span
                    onClick={() => {
                      navigate("/admin");
                      setMenuOpen(false);
                    }}
                  >
                    Gerência
                  </span>
                )}

                {isColaborador && (
                  <span
                    onClick={() => {
                      navigate("/colaborador/agenda");
                      setMenuOpen(false);
                    }}
                  >
                    Agenda
                  </span>
                )}

                <span
                  onClick={() => {
                    handleContaClick();
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