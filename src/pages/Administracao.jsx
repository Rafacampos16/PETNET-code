import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import "../styles/administracao.css";

import IconLogout from "../assets/icons/logout.png";
import IconLogoutHover from "../assets/icons/logout-h.png";

const periodos = ["Hoje", "7 dias", "30 dias"];

const dadosPorPeriodo = {
  Hoje: {
    cards: [
      { titulo: "Agendamentos", valor: "18", detalhe: "+3 vs ontem", tipo: "azul" },
      { titulo: "Confirmação", valor: "89%", detalhe: "média do dia", tipo: "amarelo" },
      { titulo: "Clientes ativos", valor: "12", detalhe: "em atendimento", tipo: "verde" },
      { titulo: "Ocupação", valor: "75%", detalhe: "agenda preenchida", tipo: "roxo" }
    ],
    fluxo: [2, 5, 3, 4, 3, 1],
    fluxoLabels: ["08h", "10h", "12h", "14h", "16h", "18h"],
    servicos: [8, 5, 3, 2],
    servicosLabels: ["Banho", "Tosa", "Consulta", "Vacina"],
    status: [11, 5, 2],
    statusLabels: ["Confirmados", "Pendentes", "Cancelados"],
    agendaResumo: { atendimentos: 5, confirmados: 3, pendentes: 1 }
  },
  "7 dias": {
    cards: [
      { titulo: "Agendamentos", valor: "63", detalhe: "+9 na semana", tipo: "azul" },
      { titulo: "Confirmação", valor: "84%", detalhe: "média semanal", tipo: "amarelo" },
      { titulo: "Clientes ativos", valor: "37", detalhe: "últimos 7 dias", tipo: "verde" },
      { titulo: "Ocupação", valor: "71%", detalhe: "média semanal", tipo: "roxo" }
    ],
    fluxo: [8, 10, 9, 11, 13, 7, 5],
    fluxoLabels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    servicos: [28, 18, 10, 7],
    servicosLabels: ["Banho", "Tosa", "Consulta", "Vacina"],
    status: [50, 9, 4],
    statusLabels: ["Confirmados", "Pendentes", "Cancelados"],
    agendaResumo: { atendimentos: 23, confirmados: 18, pendentes: 3 }
  },
  "30 dias": {
    cards: [
      { titulo: "Agendamentos", valor: "214", detalhe: "+12% no mês", tipo: "azul" },
      { titulo: "Confirmação", valor: "82%", detalhe: "média mensal", tipo: "amarelo" },
      { titulo: "Clientes ativos", valor: "89", detalhe: "+5 nesta semana", tipo: "verde" },
      { titulo: "Ocupação", valor: "78%", detalhe: "média mensal", tipo: "roxo" }
    ],
    fluxo: [48, 52, 56, 58],
    fluxoLabels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    servicos: [92, 61, 34, 27],
    servicosLabels: ["Banho", "Tosa", "Consulta", "Vacina"],
    status: [176, 21, 8],
    statusLabels: ["Confirmados", "Pendentes", "Cancelados"],
    agendaResumo: { atendimentos: 88, confirmados: 71, pendentes: 12 }
  }
};

const agendaHoje = [
  { horario: "09:00", pet: "Thor", tutor: "Mariana Costa", servico: "Banho", status: "Confirmado" },
  { horario: "10:30", pet: "Luna", tutor: "Carlos Souza", servico: "Tosa", status: "Pendente" },
  { horario: "11:15", pet: "Mel", tutor: "Fernanda Lima", servico: "Consulta", status: "Confirmado" },
  { horario: "14:00", pet: "Nina", tutor: "Patrícia Alves", servico: "Vacina", status: "Cancelado" },
  { horario: "15:20", pet: "Bob", tutor: "Rafael Martins", servico: "Banho e tosa", status: "Confirmado" }
];

const atividadesRecentes = [
  { titulo: "Novo agendamento", texto: "Thor foi agendado para banho.", hora: "há 5 min" },
  { titulo: "Cadastro atualizado", texto: "Mariana Costa alterou o telefone.", hora: "há 18 min" },
  { titulo: "Serviço confirmado", texto: "Consulta da Mel confirmada pela tutora.", hora: "há 32 min" },
  { titulo: "Cancelamento registrado", texto: "Vacina da Nina foi cancelada.", hora: "há 1 h" }
];

const menu = [
  { nome: "Dashboard", rota: "/administracao", ativo: true },
  { nome: "Agendamentos", rota: "/agendamentos" },
  { nome: "Clientes", rota: "/clientes" },
  { nome: "Pets", rota: "/pets-cadastrados" },
  { nome: "Status", rota: "/status" }
];

function getStatusClass(status) {
  const normalizado = status.toLowerCase();

  if (normalizado === "confirmado") return "admin-status admin-status-confirmado";
  if (normalizado === "pendente") return "admin-status admin-status-pendente";
  return "admin-status admin-status-cancelado";
}

export default function Administracao() {
  const navigate = useNavigate();
  const [hoverLogout, setHoverLogout] = useState(false);
  const [periodoAtivo, setPeriodoAtivo] = useState("Hoje");

  const dados = useMemo(() => dadosPorPeriodo[periodoAtivo], [periodoAtivo]);

  const fluxoOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "inherit"
      },
      colors: ["#3370EB"],
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 4
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.34,
          opacityTo: 0.04,
          stops: [0, 90, 100]
        }
      },
      grid: {
        borderColor: "#E6EEFF",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: dados.fluxoLabels,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#7A8AAA", fontWeight: 700 } }
      },
      yaxis: {
        labels: { style: { colors: "#7A8AAA", fontWeight: 700 } }
      },
      tooltip: {
        theme: "light",
        y: { formatter: (value) => `${value} agendamentos` }
      }
    }),
    [dados]
  );

  const servicosOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 10,
          barHeight: "48%",
          distributed: true
        }
      },
      colors: ["#3370EB", "#6D7CF6", "#2EC4B6", "#F5B942"],
      dataLabels: { enabled: false },
      grid: {
        borderColor: "#E6EEFF",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: dados.servicosLabels,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#7A8AAA", fontWeight: 700 } }
      },
      yaxis: {
        labels: { style: { colors: "#30456F", fontWeight: 800 } }
      },
      legend: { show: false },
      tooltip: {
        theme: "light",
        y: { formatter: (value) => `${value} atendimentos` }
      }
    }),
    [dados]
  );

  const statusOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "inherit"
      },
      labels: dados.statusLabels,
      colors: ["#3370EB", "#F5D94E", "#EF7A9B"],
      legend: { show: false },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              name: {
                show: true,
                color: "#7180A0",
                fontSize: "12px",
                fontWeight: 800
              },
              value: {
                show: true,
                color: "#17386F",
                fontSize: "26px",
                fontWeight: 900
              },
              total: {
                show: true,
                label: "Total",
                color: "#7180A0",
                fontSize: "12px",
                fontWeight: 800
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: "light",
        y: { formatter: (value) => `${value} registros` }
      }
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
          <aside className="admin-sidebar">
            <div className="admin-brand">
              <span>PETNET</span>
              <strong>Admin</strong>
            </div>

            <nav className="admin-menu">
              {menu.map((item) => (
                <button
                  key={item.nome}
                  type="button"
                  className={item.ativo ? "active" : ""}
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
                <span>Pendentes</span>
                <strong>{dados.agendaResumo.pendentes}</strong>
                <small>na agenda</small>
              </div>
            </div>
          </aside>

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
                    src={hoverLogout ? IconLogoutHover : IconLogout}
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

                <Chart
                  options={fluxoOptions}
                  series={[{ name: "Agendamentos", data: dados.fluxo }]}
                  type="area"
                  height={300}
                />
              </section>

              <section className="admin-panel admin-panel-status">
                <div className="admin-panel-header">
                  <h2>Status</h2>
                </div>

                <Chart
                  options={statusOptions}
                  series={dados.status}
                  type="donut"
                  height={250}
                />

                <div className="admin-status-legend">
                  {dados.statusLabels.map((label, index) => (
                    <div key={label}>
                      <span className={`dot dot-${index}`} />
                      <small>{label}</small>
                      <strong>{dados.status[index]}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel admin-panel-table">
                <div className="admin-panel-header admin-panel-header-agenda">
                  <div>
                    <h2>Agenda de hoje</h2>
                    <p>Resumo do dia com horários, tutor e serviço.</p>
                  </div>
                  <button type="button" onClick={() => navigate("/agendamentos")}>
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
                    <span>Pendentes</span>
                    <strong>{dados.agendaResumo.pendentes}</strong>
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

                <Chart
                  options={servicosOptions}
                  series={[{ name: "Total", data: dados.servicos }]}
                  type="bar"
                  height={250}
                />
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
