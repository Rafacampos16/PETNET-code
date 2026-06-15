import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";

import "../styles/administracao.css";

import IconLogoutHover from "../assets/icons/logout-h.png";
import dashboardService from "../services/dashboardService";
import scheduleService from "../services/scheduleService";
import notificationService from "../services/notificationService";

import {
  CalendarX,
  ClipboardList,
  Clock3,
  Sparkles,
  TrendingUp,
  Scissors,
  UsersRound,
  PawPrint,
  CalendarDays,
  Bath,
} from "lucide-react";

const chartColors = ["#3370EB", "#F2A900", "#20B68A", "#6D65F6"];

const periodos = ["Hoje", "Mensal", "Anual"];

const periodoMap = {
  Hoje: "Diario",
  Mensal: "Mensal",
  Anual: "Anual",
};

const emptyPeriodo = {
  cards: [
    {
      titulo: "Total Agendamentos",
      valor: "0",
      detalhe: "no período",
      tipo: "azul",
    },
    {
      titulo: "Cancelamento",
      valor: "0",
      detalhe: "cancelados",
      tipo: "amarelo",
    },
    {
      titulo: "Finalizados",
      valor: "0",
      detalhe: "agendamentos",
      tipo: "verde",
    },
    {
      titulo: "Entregues",
      valor: "0",
      detalhe: "pets enviados",
      tipo: "roxo",
    },
  ],
  fluxo: [],
  fluxoLabels: [],
  servicos: [],
  servicosLabels: [],
  statusPorColaborador: [],
  agendaHoje: [],
  atividadesRecentes: [],
};

function getStatusClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "CONFIRMED" || s === "CONFIRMADO") return "admin-status admin-status-confirmado";
  if (s === "FINISHED" || s === "FINALIZED" || s === "FINALIZADO") return "admin-status admin-status-finalizado";
  if (s === "DELIVERED" || s === "ENTREGUE") return "admin-status admin-status-entregue";
  if (s === "CANCELLED" || s === "CANCELED" || s === "CANCELADO") return "admin-status admin-status-cancelado";
  if (s === "SCHEDULED" || s === "AGENDADO") return "admin-status admin-status-agendado";
  return "admin-status";
}

function parseValor(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : 0;
}

function temDadosNoGrafico(lista = []) {
  return (
    Array.isArray(lista) &&
    lista.some((item) => parseValor(item) > 0)
  );
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
  const card = (cards || []).find(
    (item) => item.titulo === titulo
  );

  return card?.valor ?? "0";
}

export default function Administracao() {
  const navigate = useNavigate();

  const [periodoAtivo, setPeriodoAtivo] = useState("Hoje");

  const [dashboardData, setDashboardData] = useState({
    Diario: mergePeriodo(),
    Mensal: mergePeriodo(),
    Anual: mergePeriodo(),
  });

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [agendaHoje, setAgendaHoje] = useState([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setErro("");

        const response =
          await dashboardService.buscarDashboard();

        const data = response.data || {};

        if (!mounted) {
          return;
        }

        setDashboardData({
          Diario: mergePeriodo(data.Diario),
          Mensal: mergePeriodo(data.Mensal),
          Anual: mergePeriodo(data.Anual),
        });
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          "Erro ao carregar dashboard:",
          error
        );

        setErro(
          "Não foi possível carregar os dados do dashboard."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    async function carregarAgendaHoje() {
      try {
        const hoje = new Date();
        const inicio = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate(), 3, 0, 0));
        const fim = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate() + 1, 2, 59, 59));

        const res = await scheduleService.listar(inicio.toISOString(), fim.toISOString());
        const lista = Array.isArray(res.data) ? res.data : [];

        const formatados = lista.map((s) => {
          const dt = new Date(s.date_time);
          return {
            horario: dt.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "America/Sao_Paulo",
            }),
            pet: s.pet?.name || "—",
            tutor: s.client?.name || "—",
            servico: s.services?.map((sv) => sv.name).join(", ") || "—",
            status: s.status || "—",
          };
        });

        formatados.sort((a, b) => a.horario.localeCompare(b.horario));
        setAgendaHoje(formatados);
      } catch (err) {
        console.error("Erro ao carregar agenda de hoje:", err);
      }
    }

    carregarAgendaHoje();
  }, []);

  useEffect(() => {
  async function carregarAtividades() {
    try {
      const res = await notificationService.listar();
      const lista = Array.isArray(res) ? res : [];

      const formatadas = lista.slice(0, 5).map((n) => ({
        titulo: n.topic,
        texto: n.message,
        hora: new Date(n.created_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        }),
      }));

      setAtividadesRecentes(formatadas);
    } catch (err) {
      console.error("Erro ao carregar atividades:", err);
    }
  }

  carregarAtividades();
}, []);

  const dados = useMemo(() => {
    const chave =
      periodoMap[periodoAtivo] || "Diario";

    return dashboardData[chave] || mergePeriodo();
  }, [dashboardData, periodoAtivo]);

  const agendaResumo = useMemo(
    () => ({
      atendimentos: getCardValue(
        dados.cards,
        "Total Agendamentos"
      ),
      cancelados: getCardValue(
        dados.cards,
        "Cancelamento"
      ),
      finalizados: getCardValue(
        dados.cards,
        "Finalizados"
      ),
      entregues: getCardValue(
        dados.cards,
        "Entregues"
      ),
      confirmados: "0",
    }),
    [dados.cards]
  );

  const colaboradoresData = useMemo(() => {
    const labels = (
      dados.statusPorColaborador || []
    ).map((item) => item.nome);

    const values = (
      dados.statusPorColaborador || []
    ).map(
      (item) =>
        parseValor(item.agendados) +
        parseValor(item.confirmados) +
        parseValor(item.cancelados) +
        parseValor(item.finalizados) +
        parseValor(item.entregues)
    );

    return {
      labels,
      values,
    };
  }, [dados.statusPorColaborador]);

  const temFluxoData = useMemo(
    () => temDadosNoGrafico(dados.fluxo),
    [dados.fluxo]
  );

  const temServicosData = useMemo(
    () => temDadosNoGrafico(dados.servicos),
    [dados.servicos]
  );

  const temColaboradoresData = useMemo(
    () =>
      temDadosNoGrafico(
        colaboradoresData.values
      ),
    [colaboradoresData.values]
  );

  const fluxoOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        fontFamily: "inherit",
        parentHeightOffset: 0,
      },

      colors: ["#3370EB"],

      dataLabels: {
        enabled: false,
      },

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
        xaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 18,
          right: 18,
          bottom: 8,
          left: 12,
        },
      },

      xaxis: {
        categories: dados.fluxoLabels || [],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#7A8AAA",
            fontWeight: 700,
          },
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: "#7A8AAA",
            fontWeight: 700,
          },
        },
      },

      tooltip: {
        theme: "light",
        y: {
          formatter: (value) =>
            `${value} agendamentos`,
        },
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

      legend: {
        show: false,
      },

      stroke: {
        width: 0,
      },

      dataLabels: {
        enabled: false,
      },

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
          formatter: (value) =>
            `${value} atendimentos`,
        },
      },
    }),
    [dados.servicosLabels]
  );

  const colaboradoresOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
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

      colors: [
        "#3370EB",
        "#12B76A",
        "#7C3AED",
        "#F5B942",
        "#2EC4B6",
        "#EF7A9B",
      ],

      dataLabels: {
        enabled: false,
      },

      grid: {
        borderColor: "#E6EEFF",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },

      xaxis: {
        categories: colaboradoresData.labels,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#7A8AAA",
            fontWeight: 700,
          },
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: "#30456F",
            fontWeight: 800,
          },
        },
      },

      legend: {
        show: false,
      },

      tooltip: {
        theme: "light",
        y: {
          formatter: (value) =>
            `${value} pets atendidos`,
        },
      },
    }),
    [colaboradoresData.labels]
  );

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isDev");
    localStorage.removeItem("token");

    navigate("/conta");
  }

  if (loading) {
    return (
      <>
        <Header />
        <AdminSidebar />

        <main className="admin-page">
          <section className="admin-loading-shell">
            <div className="admin-loading-card">
              <div className="admin-loading-brand">
                <span>PETNET</span>
                <strong>Administração</strong>
              </div>

              <div
                className="admin-loading-pet-animation"
                aria-hidden="true"
              >
                <div className="admin-loading-paw-main">
                  <PawPrint
                    size={36}
                    strokeWidth={2.5}
                  />
                </div>

                <div className="admin-loading-orbit admin-loading-orbit-calendar">
                  <CalendarDays
                    size={18}
                    strokeWidth={2.5}
                  />
                </div>

                <div className="admin-loading-orbit admin-loading-orbit-bath">
                  <Bath
                    size={18}
                    strokeWidth={2.5}
                  />
                </div>

                <div className="admin-loading-orbit admin-loading-orbit-scissors">
                  <Scissors
                    size={18}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <h1>Carregando dashboard</h1>

              <p>
                Estamos buscando os dados mais
                recentes de agendamentos, serviços e
                atividades do pet shop.
              </p>

              <div className="admin-loading-skeleton">
                <span />
                <span />
                <span />
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <AdminSidebar />

      <main className="admin-page">
        <section className="admin-shell">
          <section className="admin-content">
            <div className="admin-topbar">
              <div>
                <span className="admin-page-label">
                  Gerência
                </span>

                <h1>Dashboard Operacional</h1>
              </div>

              <div className="admin-actions">
                <div className="admin-period-filter">
                  {periodos.map((periodo) => (
                    <button
                      key={periodo}
                      type="button"
                      className={
                        periodoAtivo === periodo
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setPeriodoAtivo(periodo)
                      }
                    >
                      {periodo}
                    </button>
                  ))}
                </div>

                <button
                  className="admin-logout-btn"
                  onClick={handleLogout}
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

            {erro && (
              <div className="admin-error-message">
                {erro}
              </div>
            )}

            <section className="admin-card-grid">
              {dados.cards.map((card) => {
                const cardTipo =
                  card.titulo === "Cancelamento"
                    ? "amarelo"
                    : card.tipo;

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
                  {temFluxoData ? (
                    <Chart
                      options={fluxoOptions}
                      series={[
                        {
                          name: "Agendamentos",
                          data: dados.fluxo || [],
                        },
                      ]}
                      type="area"
                      height={390}
                    />
                  ) : (
                    <div className="admin-empty-chart admin-empty-chart-flow">
                      <div className="admin-empty-icon admin-empty-icon-blue">
                        <TrendingUp
                          size={30}
                          strokeWidth={2.4}
                        />
                      </div>

                      <span className="admin-empty-kicker">
                        Fluxo ainda vazio
                      </span>

                      <strong>
                        Nenhum agendamento no período
                      </strong>

                      <p>
                        Assim que novos agendamentos
                        forem registrados, a evolução
                        dos horários aparecerá neste
                        gráfico.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="admin-panel admin-panel-services">
                <div className="admin-panel-header">
                  <h2>Serviços mais buscados</h2>
                </div>

                <div className="admin-donut-wrapper">
                  {temServicosData ? (
                    <>
                      <Chart
                        options={servicosOptions}
                        series={dados.servicos || []}
                        type="donut"
                        height={270}
                      />

                      <div className="admin-donut-legend">
                        {(dados.servicosLabels || []).map(
                          (label, index) => (
                            <div key={label}>
                              <span
                                className={`dot dot-${index}`}
                              />

                              <small>{label}</small>

                              <strong>
                                {dados.servicos[index]}
                              </strong>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="admin-empty-chart admin-empty-chart-donut">
                      <div className="admin-empty-icon admin-empty-icon-yellow">
                        <Scissors
                          size={30}
                          strokeWidth={2.4}
                        />
                      </div>

                      <span className="admin-empty-kicker">
                        Serviços em espera
                      </span>

                      <strong>
                        Nenhum serviço buscado ainda
                      </strong>

                      <p>
                        Quando houver agendamentos, os
                        serviços mais procurados serão
                        organizados neste painel.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="admin-panel admin-panel-table">
                <div className="admin-panel-header admin-panel-header-agenda">
                  <div>
                    <h2>Agenda de hoje</h2>

                    <p>
                      Resumo do dia com horários,
                      tutor e serviço.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/admin/agendamentos")
                    }
                  >
                    Ver agenda
                  </button>
                </div>

                <div className="admin-agenda-summary">
                  <div>
                    <span>Total</span>
                    <strong>
                      {agendaResumo.atendimentos}
                    </strong>
                  </div>

                  <div>
                    <span>Confirmados</span>
                    <strong>
                      {agendaResumo.confirmados}
                    </strong>
                  </div>

                  <div>
                    <span>Finalizados</span>
                    <strong>
                      {agendaResumo.finalizados}
                    </strong>
                  </div>

                  <div>
                    <span>Entregues</span>
                    <strong>
                      {agendaResumo.entregues}
                    </strong>
                  </div>
                </div>

                <div className="admin-table-wrapper">
                  {(agendaHoje || []).length >
                    0 ? (
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
                        {agendaHoje.map(
                          (item, index) => (
                            <tr
                              key={`${item.pet || "pet"
                                }-${index}`}
                            >
                              <td>{item.horario}</td>
                              <td>{item.pet}</td>
                              <td>{item.tutor}</td>
                              <td>{item.servico}</td>

                              <td>
                                <span
                                  className={getStatusClass(
                                    item.status
                                  )}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="admin-empty-state admin-empty-state-agenda">
                      <div className="admin-empty-state-icon">
                        <CalendarX
                          size={30}
                          strokeWidth={2.4}
                        />
                      </div>

                      <strong>
                        Nenhum agendamento para exibir
                      </strong>

                      <p>
                        Ainda não há horários
                        registrados neste período.
                        Quando novos agendamentos forem
                        criados, eles aparecerão nesta
                        tabela.
                      </p>

                      <button
                        type="button"
                        className="admin-empty-state-button"
                        onClick={() =>
                          navigate(
                            "/admin/agendamentos"
                          )
                        }
                      >
                        <Clock3
                          size={17}
                          strokeWidth={2.5}
                        />

                        Abrir agenda
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <section className="admin-panel admin-panel-collaborators">
                <div className="admin-panel-header">
                  <h2>Pets por colaborador</h2>
                </div>

                <div className="admin-chart-center">
                  {temColaboradoresData ? (
                    <Chart
                      options={colaboradoresOptions}
                      series={[
                        {
                          name: "Pets",
                          data: colaboradoresData.values,
                        },
                      ]}
                      type="bar"
                      height={320}
                    />
                  ) : (
                    <div className="admin-empty-chart admin-empty-chart-collaborators">
                      <div className="admin-empty-icon admin-empty-icon-green">
                        <UsersRound
                          size={30}
                          strokeWidth={2.4}
                        />
                      </div>

                      <span className="admin-empty-kicker">
                        Equipe sem registros
                      </span>

                      <strong>
                        Nenhum atendimento por
                        colaborador
                      </strong>

                      <p>
                        Quando os atendimentos forem
                        concluídos, a distribuição por
                        colaborador aparecerá aqui.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="admin-panel admin-panel-activity">
                <div className="admin-panel-header">
                  <h2>Atividade recente</h2>
                </div>

                <div className="admin-activity-list">
                  {(atividadesRecentes || [])
                    .length > 0 ? (
                    atividadesRecentes.map(
                      (item, index) => (
                        <div
                          className="admin-activity-item"
                          key={`${item.titulo || "item"
                            }-${index}`}
                        >
                          <div className="admin-activity-dot" />

                          <div>
                            <strong>
                              {item.titulo}
                            </strong>

                            <p>{item.texto}</p>

                            <small>{item.hora}</small>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="admin-empty-state admin-empty-state-activity">
                      <div className="admin-empty-state-icon">
                        <ClipboardList
                          size={30}
                          strokeWidth={2.4}
                        />
                      </div>

                      <strong>
                        Nenhuma atividade recente
                      </strong>

                      <p>
                        As últimas movimentações do
                        sistema aparecerão aqui assim
                        que houver confirmações,
                        finalizações, entregas ou
                        cancelamentos.
                      </p>

                      <span className="admin-empty-state-chip">
                        <Sparkles
                          size={15}
                          strokeWidth={2.5}
                        />

                        Aguardando movimentações
                      </span>
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