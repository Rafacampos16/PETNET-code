import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import "../styles/administracao.css";

import IconLogoutHover from "../assets/icons/logout-h.png";

const periodos = ["Hoje", "Mensal", "Anual"];

const dadosPorPeriodo = {
  Hoje: {
    cards: [
      { titulo: "Agendamentos", valor: "18", detalhe: "total do dia", tipo: "azul" },
      { titulo: "Cancelados", valor: "2", detalhe: "atendimentos cancelados", tipo: "amarelo" },
      { titulo: "Finalizados", valor: "7", detalhe: "serviços concluídos", tipo: "verde" },
      { titulo: "Entregues", valor: "4", detalhe: "pets entregues ao cliente", tipo: "roxo" },
    ],
    fluxo: [2, 5, 3, 4, 3, 1],
    fluxoLabels: ["08h", "10h", "12h", "14h", "16h", "18h"],
    servicos: [8, 5, 3, 2],
    servicosLabels: ["Banho", "Tosa", "Consulta", "Vacina"],
    colaboradoresPets: [6, 5, 4, 3],
    colaboradoresLabels: ["Ana", "Carlos", "Mariana", "João"],
    agendaResumo: {
      atendimentos: 18,
      confirmados: 9,
      cancelados: 2,
      finalizados: 7,
      entregues: 4,
    },
  },

  Mensal: {
    cards: [
      { titulo: "Agendamentos", valor: "214", detalhe: "total do mês", tipo: "azul" },
      { titulo: "Cancelados", valor: "8", detalhe: "cancelados no mês", tipo: "amarelo" },
      { titulo: "Finalizados", valor: "176", detalhe: "finalizados no mês", tipo: "verde" },
      { titulo: "Entregues", valor: "132", detalhe: "entregues no mês", tipo: "roxo" },
    ],
    fluxo: [48, 52, 56, 58],
    fluxoLabels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    servicos: [92, 61, 34, 27],
    servicosLabels: ["Banho", "Tosa", "Consulta", "Vacina"],
    colaboradoresPets: [54, 48, 43, 37, 32],
    colaboradoresLabels: ["Ana", "Carlos", "Mariana", "João", "Beatriz"],
    agendaResumo: {
      atendimentos: 214,
      confirmados: 30,
      cancelados: 8,
      finalizados: 176,
      entregues: 132,
    },
  },

  Anual: {
    cards: [
      { titulo: "Agendamentos", valor: "864", detalhe: "total no ano", tipo: "azul" },
      { titulo: "Cancelados", valor: "36", detalhe: "cancelados no ano", tipo: "amarelo" },
      { titulo: "Finalizados", valor: "702", detalhe: "finalizados no ano", tipo: "verde" },
      { titulo: "Entregues", valor: "511", detalhe: "entregues no ano", tipo: "roxo" },
    ],
    fluxo: [96, 118, 132, 145, 181, 192],
    fluxoLabels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    servicos: [364, 245, 146, 109],
    servicosLabels: ["Banho", "Tosa", "Consulta", "Vacina"],
    colaboradoresPets: [184, 160, 142, 118, 96, 82],
    colaboradoresLabels: ["Ana", "Carlos", "Mariana", "João", "Beatriz", "Lucas"],
    agendaResumo: {
      atendimentos: 864,
      confirmados: 126,
      cancelados: 36,
      finalizados: 702,
      entregues: 511,
    },
  },
};

const agendaHoje = [
  { horario: "09:00", pet: "Thor", tutor: "Mariana Costa", servico: "Banho", status: "Confirmado" },
  { horario: "10:30", pet: "Luna", tutor: "Carlos Souza", servico: "Tosa", status: "Finalizado" },
  { horario: "11:15", pet: "Mel", tutor: "Fernanda Lima", servico: "Consulta", status: "Confirmado" },
  { horario: "14:00", pet: "Nina", tutor: "Patrícia Alves", servico: "Vacina", status: "Cancelado" },
  { horario: "15:20", pet: "Bob", tutor: "Rafael Martins", servico: "Banho e tosa", status: "Entregue" },
];

const atividadesRecentes = [
  { titulo: "Novo agendamento", texto: "Thor foi agendado para banho.", hora: "há 5 min" },
  { titulo: "Status finalizado", texto: "Luna teve o atendimento finalizado.", hora: "há 18 min" },
  { titulo: "Serviço confirmado", texto: "Consulta da Mel confirmada pela tutora.", hora: "há 32 min" },
  { titulo: "Entrega registrada", texto: "Bob foi entregue ao cliente.", hora: "há 1 h" },
];

const menu = [
  { nome: "Dashboard", rota: "/admin" },
  { nome: "Agendamentos", rota: "/admin/agendamentos" },
  { nome: "Serviços", rota: "/admin/servicos" },
  { nome: "Clientes", rota: "/admin/clientes" },
  { nome: "Pets", rota: "/admin/pets" },
  { nome: "Status", rota: "/admin/status" },
];

function getStatusClass(status) {
  const normalizado = status.toLowerCase();

  if (normalizado === "confirmado") return "admin-status admin-status-confirmado";
  if (normalizado === "finalizado") return "admin-status admin-status-finalizado";
  if (normalizado === "entregue") return "admin-status admin-status-entregue";
  return "admin-status admin-status-cancelado";
}

export default function Administracao() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoverLogout, setHoverLogout] = useState(false);
  const [periodoAtivo, setPeriodoAtivo] = useState("Hoje");

  const dados = useMemo(() => dadosPorPeriodo[periodoAtivo], [periodoAtivo]);

  const fluxoOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit",
        parentHeightOffset: 0,
      },
      colors: ["#3370EB"],
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 4,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.34,
          opacityTo: 0.04,
          stops: [0, 90, 100],
        },
      },
      grid: {
        borderColor: "#E6EEFF",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: {
          top: 18,
          right: 18,
          bottom: 8,
          left: 12,
        },
      },
      xaxis: {
        categories: dados.fluxoLabels,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#7A8AAA", fontWeight: 700 } },
      },
      yaxis: {
        labels: { style: { colors: "#7A8AAA", fontWeight: 700 } },
      },
      tooltip: {
        theme: "light",
        y: { formatter: (value) => `${value} agendamentos` },
      },
    }),
    [dados]
  );

  const servicosOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 10,
          barHeight: "62%",
          distributed: true,
        },
      },
      colors: ["#3370EB", "#6D7CF6", "#2EC4B6", "#F5B942"],
      dataLabels: { enabled: false },
      grid: {
        borderColor: "#E6EEFF",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: dados.servicosLabels,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#7A8AAA", fontWeight: 700 } },
      },
      yaxis: {
        labels: { style: { colors: "#30456F", fontWeight: 800 } },
      },
      legend: { show: false },
      tooltip: {
        theme: "light",
        y: { formatter: (value) => `${value} atendimentos` },
      },
    }),
    [dados]
  );

  const colaboradoresOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 10,
          barHeight: "58%",
          distributed: true,
        },
      },
      colors: ["#3370EB", "#12B76A", "#7C3AED", "#F5B942", "#2EC4B6", "#EF7A9B"],
      dataLabels: { enabled: false },
      grid: {
        borderColor: "#E6EEFF",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: dados.colaboradoresLabels,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#7A8AAA", fontWeight: 700 } },
      },
      yaxis: {
        labels: { style: { colors: "#30456F", fontWeight: 800 } },
      },
      legend: { show: false },
      tooltip: {
        theme: "light",
        y: { formatter: (value) => `${value} pets atendidos` },
      },
    }),
    [dados]
  );

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/conta");
  }

  return (
    <>
      <Header />

      <main className="admin-page">
        <section className="admin-shell">
          <div className="admin-sidebar-track">
            <aside className="admin-sidebar">
              <div className="admin-brand">
                <span>PETNET</span>
                <strong>Administração</strong>
              </div>

              <nav className="admin-menu">
                {menu.map((item) => (
                  <button
                    key={item.nome}
                    type="button"
                    className={location.pathname === item.rota ? "active" : ""}
                    onClick={() => navigate(item.rota)}
                  >
                    {item.nome}
                  </button>
                ))}
              </nav>

              <div className="admin-sidebar-card">
                <span>Próximo atendimento</span>
                <strong>09:00</strong>
                <small>Thor • Banho</small>
              </div>

              <div className="admin-sidebar-mini-grid">
                <div>
                  <span>Hoje</span>
                  <strong>{dados.agendaResumo.atendimentos}</strong>
                  <small>atendimentos</small>
                </div>

                <div>
                  <span>Cancelados</span>
                  <strong>{dados.agendaResumo.cancelados}</strong>
                  <small>na agenda</small>
                </div>
              </div>
            </aside>
          </div>

          <section className="admin-content">
            <div className="admin-topbar">
              <div>
                <span className="admin-page-label">Gerência</span>
                <h1>Dashboard Operacional</h1>
              </div>

              <div className="admin-actions">
                <div className="admin-period-filter">
                  {periodos.map((periodo) => (
                    <button
                      key={periodo}
                      type="button"
                      className={periodoAtivo === periodo ? "active" : ""}
                      onClick={() => setPeriodoAtivo(periodo)}
                    >
                      {periodo}
                    </button>
                  ))}
                </div>

                <button
                  className="admin-logout-btn"
                  onClick={handleLogout}
                  onMouseEnter={() => setHoverLogout(true)}
                  onMouseLeave={() => setHoverLogout(false)}
                  type="button"
                >
                  <img
                    src={hoverLogout ? IconLogoutHover : IconLogoutHover}
                    alt=""
                    className="admin-logout-icon"
                  />
                  Sair
                </button>
              </div>
            </div>

            <section className="admin-card-grid">
              {dados.cards.map((card) => (
                <article key={card.titulo} className={`admin-main-card ${card.tipo}`}>
                  <span>{card.titulo}</span>
                  <strong>{card.valor}</strong>
                  <small>{card.detalhe}</small>
                </article>
              ))}
            </section>

            <section className="admin-layout-grid">
              <section className="admin-panel admin-panel-flow">
                <div className="admin-panel-header">
                  <h2>Fluxo de agendamentos</h2>
                  <span>{periodoAtivo}</span>
                </div>

                <div className="admin-chart-center admin-chart-flow">
                  <Chart
                    options={fluxoOptions}
                    series={[{ name: "Agendamentos", data: dados.fluxo }]}
                    type="area"
                    height={390}
                  />
                </div>
              </section>

              <section className="admin-panel admin-panel-table">
                <div className="admin-panel-header admin-panel-header-agenda">
                  <div>
                    <h2>Agenda de hoje</h2>
                    <p>Resumo do dia com horários, tutor e serviço.</p>
                  </div>

                  <button type="button" onClick={() => navigate("/admin/agendamentos")}>
                    Ver agenda
                  </button>
                </div>

                <div className="admin-agenda-summary">
                  <div>
                    <span>Total</span>
                    <strong>{dados.agendaResumo.atendimentos}</strong>
                  </div>

                  <div>
                    <span>Confirmados</span>
                    <strong>{dados.agendaResumo.confirmados}</strong>
                  </div>

                  <div>
                    <span>Finalizados</span>
                    <strong>{dados.agendaResumo.finalizados}</strong>
                  </div>

                  <div>
                    <span>Entregues</span>
                    <strong>{dados.agendaResumo.entregues}</strong>
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Horário</th>
                        <th>Pet</th>
                        <th>Tutor</th>
                        <th>Serviço</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {agendaHoje.map((item, index) => (
                        <tr key={`${item.pet}-${index}`}>
                          <td>{item.horario}</td>
                          <td>{item.pet}</td>
                          <td>{item.tutor}</td>
                          <td>{item.servico}</td>
                          <td>
                            <span className={getStatusClass(item.status)}>{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="admin-panel admin-panel-services">
                <div className="admin-panel-header">
                  <h2>Serviços mais buscados</h2>
                </div>

                <div className="admin-chart-center">
                  <Chart
                    options={servicosOptions}
                    series={[{ name: "Total", data: dados.servicos }]}
                    type="bar"
                    height={320}
                  />
                </div>
              </section>

              <section className="admin-panel admin-panel-collaborators">
                <div className="admin-panel-header">
                  <h2>Pets por colaborador</h2>
                </div>

                <div className="admin-chart-center">
                  <Chart
                    options={colaboradoresOptions}
                    series={[{ name: "Pets", data: dados.colaboradoresPets }]}
                    type="bar"
                    height={320}
                  />
                </div>
              </section>

              <section className="admin-panel admin-panel-activity">
                <div className="admin-panel-header">
                  <h2>Atividade recente</h2>
                </div>

                <div className="admin-activity-list">
                  {atividadesRecentes.map((item, index) => (
                    <div className="admin-activity-item" key={`${item.titulo}-${index}`}>
                      <div className="admin-activity-dot" />

                      <div>
                        <strong>{item.titulo}</strong>
                        <p>{item.texto}</p>
                        <small>{item.hora}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </section>
        </section>
      </main>
    </>
  );
}