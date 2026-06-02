import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import "../styles/administracao.css";
import IconLogoutHover from "../assets/icons/logout-h.png";
import dashboardService from "../services/dashboardService";

const chartColors = ["#3370EB", "#F2A900", "#20B68A", "#6D65F6"];

const periodos = ["Hoje", "Mensal", "Anual"];

const periodoMap = {
  Hoje: "Diario",
  Mensal: "Mensal",
  Anual: "Anual",
};

const emptyPeriodo = {
  cards: [
    { titulo: "Total Agendamentos", valor: "0", detalhe: "no período", tipo: "azul" },
    { titulo: "Cancelamento", valor: "0", detalhe: "cancelados", tipo: "amarelo" },
    { titulo: "Finalizados", valor: "0", detalhe: "agendamentos", tipo: "verde" },
    { titulo: "Entregues", valor: "0", detalhe: "pets enviados", tipo: "roxo" },
  ],
  fluxo: [],
  fluxoLabels: [],
  servicos: [],
  servicosLabels: [],
  statusPorColaborador: [],
  agendaHoje: [],
  atividadesRecentes: [],
};

const menu = [
  { nome: "Dashboard", rota: "/admin" },
  { nome: "Agendamentos", rota: "/admin/agendamentos" },
  { nome: "Serviços", rota: "/admin/servicos" },
  { nome: "Clientes", rota: "/admin/clientes" },
  { nome: "Pets", rota: "/admin/pets" },
  { nome: "Status", rota: "/admin/status" },
];

function getStatusClass(status) {
  const normalizado = String(status || "").toLowerCase();

  if (normalizado === "confirmado") return "admin-status admin-status-confirmado";
  if (normalizado === "finalizado") return "admin-status admin-status-finalizado";
  if (normalizado === "entregue") return "admin-status admin-status-entregue";
  if (normalizado === "cancelado") return "admin-status admin-status-cancelado";
  return "admin-status admin-status-cancelado";
}

function parseValor(valor) {
  const num = Number(valor);
  return Number.isFinite(num) ? num : 0;
}

function mergePeriodo(periodo = {}) {
  return {
    ...emptyPeriodo,
    ...periodo,
    cards: periodo.cards || emptyPeriodo.cards,
    fluxo: periodo.fluxo || [],
    fluxoLabels: periodo.fluxoLabels || [],
    servicos: periodo.servicos || [],
    servicosLabels: periodo.servicosLabels || [],
    statusPorColaborador: periodo.statusPorColaborador || [],
    agendaHoje: periodo.agendaHoje || [],
    atividadesRecentes: periodo.atividadesRecentes || [],
  };
}

function getCardValue(cards, titulo) {
  const card = (cards || []).find((item) => item.titulo === titulo);
  return card?.valor ?? "0";
}

export default function Administracao() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoverLogout, setHoverLogout] = useState(false);
  const [periodoAtivo, setPeriodoAtivo] = useState("Hoje");
  const [dashboardData, setDashboardData] = useState({
    Diario: mergePeriodo(),
    Mensal: mergePeriodo(),
    Anual: mergePeriodo(),
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let mounted = true;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setErro("");

        const response = await dashboardService.buscarDashboard();
        const data = response.data || {};

        if (!mounted) return;

        setDashboardData({
          Diario: mergePeriodo(data.Diario),
          Mensal: mergePeriodo(data.Mensal),
          Anual: mergePeriodo(data.Anual),
        });
      } catch (error) {
        if (!mounted) return;
        setErro("Não foi possível carregar os dados do dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    carregarDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const dados = useMemo(() => {
    const chave = periodoMap[periodoAtivo] || "Diario";
    return dashboardData[chave] || mergePeriodo();
  }, [dashboardData, periodoAtivo]);

  const agendaResumo = useMemo(
    () => ({
      atendimentos: getCardValue(dados.cards, "Total Agendamentos"),
      cancelados: getCardValue(dados.cards, "Cancelamento"),
      finalizados: getCardValue(dados.cards, "Finalizados"),
      entregues: getCardValue(dados.cards, "Entregues"),
      confirmados: "0",
    }),
    [dados.cards]
  );

  const colaboradoresData = useMemo(() => {
    const labels = (dados.statusPorColaborador || []).map((item) => item.nome);
    const values = (dados.statusPorColaborador || []).map((item) =>
      parseValor(item.agendados) +
      parseValor(item.confirmados) +
      parseValor(item.cancelados) +
      parseValor(item.finalizados) +
      parseValor(item.entregues)
    );

    return { labels, values };
  }, [dados.statusPorColaborador]);

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
        categories: dados.fluxoLabels || [],
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
    [dados.fluxoLabels]
  );

  const servicosOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "inherit",
      },
      labels: dados.servicosLabels || [],
      colors: chartColors,
      legend: { show: false },
      stroke: { width: 0 },
      dataLabels: { enabled: false },

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
                fontWeight: 800,
              },

              value: {
                show: true,
                color: "#17386F",
                fontSize: "24px",
                fontWeight: 900,
              },

              total: {
                show: true,
                label: "Total",
                color: "#7180A0",
                fontSize: "12px",
                fontWeight: 800,
              },
            },
          },
        },
      },

      tooltip: {
        theme: "light",
        y: {
          formatter: (value) => `${value} atendimentos`,
        },
      },
    }),
    [dados.servicosLabels]
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
        categories: colaboradoresData.labels,
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
    [colaboradoresData.labels]
  );

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/conta");
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="admin-page">
          <section className="admin-shell">
            <div style={{ padding: 24 }}>Carregando dashboard...</div>
          </section>
        </main>
      </>
    );
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
                  <strong>{agendaResumo.atendimentos}</strong>
                  <small>atendimentos</small>
                </div>

                <div>
                  <span>Cancelados</span>
                  <strong>{agendaResumo.cancelados}</strong>
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
                    src={IconLogoutHover}
                    alt=""
                    className="admin-logout-icon"
                  />
                  Sair
                </button>
              </div>
            </div>

            {erro ? <div style={{ marginBottom: 16 }}>{erro}</div> : null}

            <section className="admin-card-grid">
              {dados.cards.map((card) => {
                const cardTipo = card.titulo === "Cancelamento" ? "amarelo" : card.tipo;

                return (
                  <article
                    key={card.titulo}
                    className={`admin-main-card ${cardTipo}`}
                  >
                    <span>{card.titulo}</span>
                    <strong>{card.valor}</strong>
                    <small>{card.detalhe}</small>
                  </article>
                );
              })}
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
                    series={[{ name: "Agendamentos", data: dados.fluxo || [] }]}
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
                    <strong>{agendaResumo.atendimentos}</strong>
                  </div>

                  <div>
                    <span>Confirmados</span>
                    <strong>{agendaResumo.confirmados}</strong>
                  </div>

                  <div>
                    <span>Finalizados</span>
                    <strong>{agendaResumo.finalizados}</strong>
                  </div>

                  <div>
                    <span>Entregues</span>
                    <strong>{agendaResumo.entregues}</strong>
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  {(dados.agendaHoje || []).length > 0 ? (
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
                        {dados.agendaHoje.map((item, index) => (
                          <tr key={`${item.pet || "pet"}-${index}`}>
                            <td>{item.horario}</td>
                            <td>{item.pet}</td>
                            <td>{item.tutor}</td>
                            <td>{item.servico}</td>
                            <td>
                              <span className={getStatusClass(item.status)}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: 20 }}>
                      Nenhum agendamento carregado para este período.
                    </div>
                  )}
                </div>
              </section>

              <section className="admin-panel admin-panel-services">
                <div className="admin-panel-header">
                  <h2>Serviços mais buscados</h2>
                </div>

                <div className="admin-donut-wrapper">
                  <Chart
                    options={servicosOptions}
                    series={dados.servicos || []}
                    type="donut"
                    height={270}
                  />

                  <div className="admin-donut-legend">
                    {(dados.servicosLabels || []).map((label, index) => (
                      <div key={label}>
                        <span className={`dot dot-${index}`} />
                        <small>{label}</small>
                        <strong>{dados.servicos[index]}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="admin-panel admin-panel-collaborators">
                <div className="admin-panel-header">
                  <h2>Pets por colaborador</h2>
                </div>

                <div className="admin-chart-center">
                  <Chart
                    options={colaboradoresOptions}
                    series={[{ name: "Pets", data: colaboradoresData.values }]}
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
                  {(dados.atividadesRecentes || []).length > 0 ? (
                    dados.atividadesRecentes.map((item, index) => (
                      <div className="admin-activity-item" key={`${item.titulo || "item"}-${index}`}>
                        <div className="admin-activity-dot" />

                        <div>
                          <strong>{item.titulo}</strong>
                          <p>{item.texto}</p>
                          <small>{item.hora}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 20 }}>
                      Nenhuma atividade recente disponível.
                    </div>
                  )}
                </div>
              </section>
            </section>
          </section>
        </section>
      </main>
    </>
  );
}