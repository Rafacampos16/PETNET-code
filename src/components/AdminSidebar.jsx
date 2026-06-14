// src/components/AdminSidebar.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  PawPrint,
  Scissors,
  ScrollText,
  UsersRound,
  FileClock
} from "lucide-react";

import "../styles/adminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuAberto, setMenuAberto] = useState(false);

  const isDev = localStorage.getItem("isDev") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const itensMenu = [
    {
      nome: "Home",
      rota: "/",
      icon: Home,
    },
    {
      nome: "Gerência",
      rota: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      nome: "Agendar",
      rota: "/admin/agendamentos",
      icon: CalendarDays,
    },
    {
      nome: "Serviços",
      rota: "/admin/servicos",
      icon: Scissors,
    },
    {
      nome: "Clientes",
      rota: "/admin/clientes",
      icon: UsersRound,
    },
    {
      nome: "Pets",
      rota: "/admin/pets",
      icon: PawPrint,
    },
    {
      nome: "Status",
      rota: "/admin/status",
      icon: ClipboardList,
    },
    ...(isAdmin || isDev
  ? [
      {
        nome: "Logs",
        rota: "/logs",
        icon: FileClock,
      },
    ]
  : []),
  ];

  function estaAtivo(item) {
    if (item.exact) {
      return location.pathname === item.rota;
    }

    if (item.rota === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(item.rota);
  }

  function navegar(rota) {
    navigate(rota);

    if (window.innerWidth <= 900) {
      setMenuAberto(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`admin-sidebar-mobile-trigger ${
          menuAberto ? "is-open" : ""
        }`}
        onClick={() => setMenuAberto((estadoAtual) => !estadoAtual)}
        aria-label={menuAberto ? "Fechar menu administrativo" : "Abrir menu administrativo"}
        aria-expanded={menuAberto}
      >
        {menuAberto ? (
          <ChevronLeft size={22} strokeWidth={2.6} />
        ) : (
          <ChevronRight size={22} strokeWidth={2.6} />
        )}
      </button>

      {menuAberto && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu administrativo"
        />
      )}

      <aside
        className={`admin-floating-sidebar ${
          menuAberto ? "is-open" : ""
        }`}
        onMouseEnter={() => setMenuAberto(true)}
        onMouseLeave={() => setMenuAberto(false)}
      >
        <div className="admin-floating-sidebar-brand">
          <span className="admin-floating-sidebar-logo">
            <PawPrint size={23} strokeWidth={2.5} />
          </span>

          <div className="admin-floating-sidebar-brand-text">
            <small>PETNET</small>
            <strong>Administração</strong>
          </div>
        </div>

        <nav
          className="admin-floating-sidebar-menu"
          aria-label="Menu administrativo"
        >
          {itensMenu.map((item) => {
            const Icon = item.icon;
            const ativo = estaAtivo(item);

            return (
              <button
                key={item.rota}
                type="button"
                className={ativo ? "active" : ""}
                onClick={() => navegar(item.rota)}
                title={!menuAberto ? item.nome : undefined}
              >
                <span className="admin-floating-sidebar-icon">
                  <Icon size={21} strokeWidth={2.4} />
                </span>

                <span className="admin-floating-sidebar-label">
                  {item.nome}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;