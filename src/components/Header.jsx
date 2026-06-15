import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";

import PataIcon from "../assets/icons/pata.png";
import PataIconHover from "../assets/icons/pata-h.png";

import PetsIcon from "../assets/icons/pets.png";
import PetsIconHover from "../assets/icons/pets-h.png";

import HomeIcon from "../assets/icons/home.png";
import HomeIconHover from "../assets/icons/home-h.png";

import AdminIcon from "../assets/icons/admin.png";
import AdminIconHover from "../assets/icons/admin-hover.png";

import AgendamentoIcon from "../assets/icons/agendamento.png";
import AgendamentoIconHover from "../assets/icons/agendamento-h.png";

import ClienteIcon from "../assets/icons/clientes.png";
import ClienteIconHover from "../assets/icons/clientes-h.png";

import PetsAdmIcon from "../assets/icons/petsadm.png";
import PetsAdmIconHover from "../assets/icons/petsadm-h.png";

import ColaboradorIcon from "../assets/icons/status.png";
import ColaboradorIconHover from "../assets/icons/status-h.png";

import CriarServicoIcon from "../assets/icons/criarServico.png";
import CriarServicoIconHover from "../assets/icons/criarServico-hover.png";

import AgendaColaboradorIcon from "../assets/icons/agendaColaborador.png";
import AgendaColaboradorIconHover from "../assets/icons/agendaColaborador-hover.png";

import AgendaClienteIcon from "../assets/icons/agendaCliente.png";
import AgendaClienteIconHover from "../assets/icons/agendaCliente-hover.png";

import logIcon from "../assets/icons/log.png";
import logHoverIcon from "../assets/icons/log-hover.png";

import SinoIcon from "../assets/icons/sininho-h.png";
import SinoIconHover from "../assets/icons/sininho.png";

import {
  listarNotificacoes,
  marcarNotificacaoComoLida,
} from "../utils/notificacoesLocal";

import notificationService from "../services/notificationService";

import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const contaDropdownRef = useRef(null);

  const isAdmin =
    localStorage.getItem("isAdmin") === "true";

  const isUser =
    localStorage.getItem("isUser") === "true";

  const isColaborador =
    localStorage.getItem("isColaborador") === "true";

  const isDev =
    localStorage.getItem("isDev") === "true";

  const isLogged =
    isAdmin || isUser || isColaborador || isDev;

  /*
    O header administrativo só aparece dentro das rotas
    administrativas.

    Ao entrar na Home, o título volta a ser PETNET e o menu
    administrativo não fica misturado com o menu público.
  */
  const isAdminPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/logs") ||
    ((isAdmin || isDev) &&
      location.pathname.startsWith("/minhaconta"));

  const isColaboradorPage =
    location.pathname.startsWith("/colaborador") ||
    (isColaborador &&
      location.pathname.startsWith("/minhaconta"));

  const [hoveredItem, setHoveredItem] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [contaDropdownOpen, setContaDropdownOpen] =
    useState(false);

  const [sinoHover, setSinoHover] = useState(false);

  const [modalNotificacoes, setModalNotificacoes] =
    useState(false);

  const [notificacoes, setNotificacoes] = useState([]);

  function obterNomeUsuario() {
    const nomesDiretos = [
      localStorage.getItem("nomeUsuario"),
      localStorage.getItem("userName"),
      localStorage.getItem("username"),
      localStorage.getItem("nome"),
    ];

    for (let i = 0; i < nomesDiretos.length; i++) {
      const nome = nomesDiretos[i];

      if (nome && nome.trim()) {
        return nome
          .replace(/^"|"$/g, "")
          .trim()
          .split(" ")[0];
      }
    }

    const usuariosSalvos = [
      localStorage.getItem("usuario"),
      localStorage.getItem("user"),
      localStorage.getItem("userData"),
      localStorage.getItem("usuarioLogado"),
    ];

    for (let i = 0; i < usuariosSalvos.length; i++) {
      const usuarioSalvo = usuariosSalvos[i];

      if (!usuarioSalvo) {
        continue;
      }

      try {
        const usuario = JSON.parse(usuarioSalvo);

        const nome =
          usuario?.name ||
          usuario?.nome ||
          usuario?.fullName ||
          usuario?.firstName ||
          usuario?.user_name ||
          usuario?.username;

        if (nome && nome.trim()) {
          return nome.trim().split(" ")[0];
        }
      } catch {
        continue;
      }
    }

    return "Conta";
  }

  const nomeUsuario = obterNomeUsuario();

  function normalizarNotificacao(n) {
    return {
      id: n.id,
      titulo: n.topic,
      descricao: n.message,
      lida: n.viewed,
    };
  }

  async function carregarNotificacoes() {
    if (!isLogged) {
      setNotificacoes([]);
      return;
    }
    try {
      const lista = await notificationService.listar();
      if (Array.isArray(lista)) {
        setNotificacoes(lista.map(normalizarNotificacao));
      } else {
        setNotificacoes([]);
      }
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  }

  function abrirModalNotificacoes() {
    carregarNotificacoes();
    setMenuOpen(false);
    setModalNotificacoes(true);
  }

  async function marcarComoLida(id) {
    try {
      await notificationService.marcarComoLida(id);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
    }
  }

  const totalNaoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  useEffect(() => {
    if (!isLogged) {
      setNotificacoes([]);
      return;
    }

    carregarNotificacoes();

    function handleFoco() {
      if (document.visibilityState === "visible") {
        carregarNotificacoes();
      }
    }

    window.addEventListener("focus", handleFoco);

    const intervalo = setInterval(() => {
      if (document.visibilityState === "visible") {
        carregarNotificacoes();
      }
    }, 3 * 60 * 1000);

    return () => {
      window.removeEventListener("focus", handleFoco);
      clearInterval(intervalo);
    };
  }, [isLogged, location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setContaDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function fecharAoClicarFora(event) {
      if (
        contaDropdownRef.current &&
        !contaDropdownRef.current.contains(event.target)
      ) {
        setContaDropdownOpen(false);
      }
    }

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setContaDropdownOpen(false);
        setModalNotificacoes(false);
      }
    }

    document.addEventListener(
      "mousedown",
      fecharAoClicarFora
    );

    document.addEventListener(
      "keydown",
      fecharComEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        fecharAoClicarFora
      );

      document.removeEventListener(
        "keydown",
        fecharComEscape
      );
    };
  }, []);

  const handleLogoClick = () => {
    if (isAdminPage) {
      navigate("/admin");
      return;
    }

    if (isColaboradorPage) {
      navigate("/colaborador/agenda");
      return;
    }

    navigate("/");
  };

  const navegar = (rota) => {
    setMenuOpen(false);
    setContaDropdownOpen(false);
    navigate(rota);
  };

  const handleContaClick = () => {
    if (!isLogged) {
      navegar("/conta");
      return;
    }

    setContaDropdownOpen(
      (estadoAtual) => !estadoAtual
    );
  };

  const handleLogout = () => {
    const chavesDeLogin = [
      "isAdmin",
      "isUser",
      "isColaborador",
      "isDev",
      "token",
      "accessToken",
      "access_token",
      "authToken",
      "refreshToken",
      "refresh_token",
      "nomeUsuario",
      "userName",
      "username",
      "nome",
      "usuario",
      "user",
      "userData",
      "usuarioLogado",
      "userCpf",
      "cpf",
      "userRole",
      "role",
    ];

    for (let i = 0; i < chavesDeLogin.length; i++) {
      localStorage.removeItem(chavesDeLogin[i]);
    }

    setMenuOpen(false);
    setContaDropdownOpen(false);
    setModalNotificacoes(false);

    navigate("/conta", {
      replace: true,
    });
  };

  const menuPublico = [
    {
      id: "home",
      label: "Home",
      rota: "/",
      icon: HomeIcon,
      hoverIcon: HomeIconHover,
    },
    {
      id: "servicos",
      label: "Serviços",
      rota: "/servicos",
      icon: PetsIcon,
      hoverIcon: PetsIconHover,
    },
    {
      id: "pets",
      label: "Pets",
      rota: "/pets",
      icon: PataIcon,
      hoverIcon: PataIconHover,
    },
  ];

  if (isAdmin) {
    const indicePets = menuPublico.findIndex(
      (item) => item.id === "pets"
    );

    if (indicePets !== -1) {
      menuPublico.splice(indicePets, 1);
    }
  }

  if (isUser) {
    menuPublico.push({
      id: "agenda-cliente",
      label: "Agenda",
      rota: "/meus-agendamentos",
      icon: AgendaClienteIcon,
      hoverIcon: AgendaClienteIconHover,
    });
  }

  if (isAdmin || isDev) {
    menuPublico.push({
      id: "gerencia",
      label: "Gerência",
      rota: "/admin",
      icon: AdminIcon,
      hoverIcon: AdminIconHover,
    });
  }

  if (isDev) {
    menuPublico.push({
      id: "logs-publico",
      label: "Logs",
      rota: "/logs",
      icon: logIcon,
      hoverIcon: logHoverIcon,
    });
  }

  if (isColaborador) {
    menuPublico.push({
      id: "agenda-colaborador-publica",
      label: "Agenda",
      rota: "/colaborador/agenda",
      icon: AgendaColaboradorIcon,
      hoverIcon: AgendaColaboradorIconHover,
    });
  }

  const menuColaborador = [
    {
      id: "home-colaborador",
      label: "Home",
      rota: "/",
      icon: HomeIcon,
      hoverIcon: HomeIconHover,
    },
    {
      id: "agenda-colaborador",
      label: "Agenda",
      rota: "/colaborador/agenda",
      icon: AgendaColaboradorIcon,
      hoverIcon: AgendaColaboradorIconHover,
    },
  ];

  const menuAdminMobile = [
    {
      id: "home-admin",
      label: "Home",
      rota: "/",
      icon: HomeIcon,
      hoverIcon: HomeIconHover,
    },
    {
      id: "administracao",
      label: "Administração",
      rota: "/admin",
      icon: AdminIcon,
      hoverIcon: AdminIconHover,
    },
    {
      id: "agendar",
      label: "Agendar",
      rota: "/admin/agendamentos",
      icon: AgendamentoIcon,
      hoverIcon: AgendamentoIconHover,
    },
    {
      id: "servicos-admin",
      label: "Serviços",
      rota: "/admin/servicos",
      icon: CriarServicoIcon,
      hoverIcon: CriarServicoIconHover,
    },
    {
      id: "clientes-admin",
      label: "Clientes",
      rota: "/admin/clientes",
      icon: ClienteIcon,
      hoverIcon: ClienteIconHover,
    },
    {
      id: "pets-admin",
      label: "Pets",
      rota: "/admin/pets",
      icon: PetsAdmIcon,
      hoverIcon: PetsAdmIconHover,
    },
    {
      id: "status-admin",
      label: "Status",
      rota: "/admin/status",
      icon: ColaboradorIcon,
      hoverIcon: ColaboradorIconHover,
    },
    {
      id: "logs-admin",
      label: "Logs",
      rota: "/logs",
      icon: logIcon,
      hoverIcon: logHoverIcon,
    },
  ];

  const menuDesktop = isColaboradorPage
    ? menuColaborador
    : menuPublico;

  const menuMobile = isAdminPage
    ? menuAdminMobile
    : isColaboradorPage
      ? menuColaborador
      : menuPublico;

  const renderizarItemDesktop = (item) => {
    const estaHover = hoveredItem === item.id;

    return (
      <div
        key={item.id}
        className="menu-item"
        onMouseEnter={() =>
          setHoveredItem(item.id)
        }
        onMouseLeave={() =>
          setHoveredItem("")
        }
        onClick={() => navegar(item.rota)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            navegar(item.rota);
          }
        }}
      >
        <img
          src={
            estaHover
              ? item.hoverIcon
              : item.icon
          }
          alt={item.label}
          className="icon-link"
        />

        <span
          style={{
            color: estaHover
              ? "var(--petnet-yellow)"
              : "#ffffff",
          }}
        >
          {item.label}
        </span>
      </div>
    );
  };

  const renderizarDropdownConta = () => {
    if (!isLogged || !contaDropdownOpen) {
      return null;
    }

    return (
      <div className="navbar-account-dropdown">
        <button
          type="button"
          onClick={() => navegar("/minhaconta")}
        >
          <UserRound size={18} />
          Minha conta
        </button>

        <div className="navbar-account-dropdown-divider" />

        <button
          type="button"
          className="navbar-account-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>
    );
  };

  const renderizarConta = ({
    admin = false,
  } = {}) => {
    return (
      <div
        className={`navbar-account-wrapper ${admin
          ? "navbar-account-wrapper-admin"
          : ""
          }`}
        ref={contaDropdownRef}
      >
        <button
          type="button"
          className={`navbar-account ${admin
            ? ""
            : "navbar-account-inline"
            }`}
          onClick={handleContaClick}
          aria-expanded={
            isLogged
              ? contaDropdownOpen
              : undefined
          }
          aria-label={
            isLogged
              ? "Abrir opções da conta"
              : "Fazer login"
          }
        >
          <UserRound
            size={21}
            strokeWidth={2.6}
          />

          {isLogged ? (
            <>
              <span className="navbar-account-text">
                <small>Olá,</small>
                <strong>{nomeUsuario}</strong>
              </span>

              <ChevronDown
                size={18}
                strokeWidth={3}
                className={`navbar-account-arrow ${contaDropdownOpen
                  ? "open"
                  : ""
                  }`}
              />
            </>
          ) : (
            <span className="navbar-login-text">
              Faça login
            </span>
          )}
        </button>

        {renderizarDropdownConta()}
      </div>
    );
  };

  return (
    <header className="header">
      <div className="container">
        <div
          className={`header-content ${isAdminPage
            ? "admin-header-content"
            : ""
            }`}
        >
          {isLogged && (
            <button
              type="button"
              className="navbar-notification-btn"
              onMouseEnter={() =>
                setSinoHover(true)
              }
              onMouseLeave={() =>
                setSinoHover(false)
              }
              onClick={abrirModalNotificacoes}
              aria-label="Abrir notificações"
            >
              <img
                src={
                  sinoHover
                    ? SinoIconHover
                    : SinoIcon
                }
                alt="Notificações"
                className="navbar-notification-icon"
              />

              {totalNaoLidas > 0 && (
                <span className="navbar-notification-badge">
                  {totalNaoLidas > 9
                    ? "9+"
                    : totalNaoLidas}
                </span>
              )}
            </button>
          )}

          <div
            className={`logo-center ${isAdminPage
              ? "admin-logo"
              : ""
              }`}
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                handleLogoClick();
              }
            }}
          >
            {isAdminPage
              ? "ADMINISTRAÇÃO"
              : isColaboradorPage
                ? "COLABORADOR"
                : "PETNET"}
          </div>

          <button
            type="button"
            className="hamburger"
            onClick={() =>
              setMenuOpen(
                (estadoAtual) => !estadoAtual
              )
            }
            aria-label={
              menuOpen
                ? "Fechar menu"
                : "Abrir menu"
            }
            aria-expanded={menuOpen}
          >
            <span
              className={`bar ${menuOpen ? "open" : ""
                }`}
            />

            <span
              className={`bar ${menuOpen ? "open" : ""
                }`}
            />

            <span
              className={`bar ${menuOpen ? "open" : ""
                }`}
            />
          </button>

          {isAdminPage ? (
            renderizarConta({
              admin: true,
            })
          ) : (
            <div
              className={`header-right ${isColaboradorPage
                ? "collaborator-nav"
                : ""
                }`}
            >
              {menuDesktop.map(
                renderizarItemDesktop
              )}

              {renderizarConta()}
            </div>
          )}

          {menuOpen && (
            <button
              type="button"
              className="mobile-menu-backdrop"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
            />
          )}

          <nav
            className={`mobile-menu ${menuOpen ? "show" : ""
              }`}
            aria-hidden={!menuOpen}
          >
            <div className="mobile-menu-header">
              <strong>
                {isAdminPage
                  ? "Menu administrativo"
                  : "Menu"}
              </strong>
            </div>

            {isAdminPage && isLogged && (
              <button
                type="button"
                className="mobile-menu-notification"
                onClick={abrirModalNotificacoes}
              >
                Notificações

                {totalNaoLidas > 0 && (
                  <span>
                    {totalNaoLidas > 9
                      ? "9+"
                      : totalNaoLidas}
                  </span>
                )}
              </button>
            )}

            {menuMobile.map((item) => (
              <button
                type="button"
                key={item.id}
                className={
                  location.pathname === item.rota
                    ? "active"
                    : ""
                }
                onClick={() =>
                  navegar(item.rota)
                }
              >
                {item.label}
              </button>
            ))}

            <div className="mobile-menu-divider" />

            <button
              type="button"
              onClick={() =>
                navegar(
                  isLogged
                    ? "/minhaconta"
                    : "/conta"
                )
              }
            >
              {isLogged
                ? "Minha conta"
                : "Faça login"}
            </button>

            {isLogged && (
              <button
                type="button"
                className="mobile-menu-logout"
                onClick={handleLogout}
              >
                Sair da conta
              </button>
            )}
          </nav>
        </div>
      </div>

      {modalNotificacoes && (
        <div
          className="navbar-notification-overlay"
          onClick={() =>
            setModalNotificacoes(false)
          }
        >
          <div
            className="navbar-notification-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="navbar-notification-top">
              <div>
                <span>
                  Central de notificações
                </span>

                <h2>Notificações</h2>
              </div>

              <button
                type="button"
                className="navbar-notification-close"
                onClick={() =>
                  setModalNotificacoes(false)
                }
                aria-label="Fechar notificações"
              >
                ×
              </button>
            </div>

            <div className="navbar-notification-list">
              {notificacoes.length === 0 ? (
                <div className="navbar-notification-empty">
                  <strong>
                    Nenhuma notificação por enquanto
                  </strong>

                  <p>
                    Quando houver novidades, elas
                    aparecerão aqui.
                  </p>
                </div>
              ) : (
                notificacoes.map(
                  (notificacao) => (
                    <div
                      key={notificacao.id}
                      className={`navbar-notification-item ${notificacao.lida
                        ? "lida"
                        : ""
                        }`}
                    >
                      <div>
                        <strong>
                          {notificacao.titulo}
                        </strong>

                        <p>
                          {notificacao.descricao}
                        </p>
                      </div>

                      {!notificacao.lida && (
                        <button
                          type="button"
                          onClick={() =>
                            marcarComoLida(
                              notificacao.id
                            )
                          }
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;