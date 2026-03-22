import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import "../styles/administracao.css";

import IconLogout from "../assets/icons/logout.png";
import IconLogoutHover from "../assets/icons/logout-h.png";

const periodos = ["Hoje", "7 dias", "30 dias"];

const dadosPorPeriodo = {
  Hoje: {
    resumo: {
      agendamentosHoje: "18",
      taxaConfirmacao: "89%",
      servicoTop: "Banho",
      ocupacao: "75%"
    },
    kpis: [
      { titulo: "Agendamentos", valor: "18", detalhe: "+3 em relação a ontem" },
      { titulo: "Clientes ativos", valor: "12", detalhe: "movimento do dia" },
      { titulo: "Pets atendidos", valor: "16", detalhe: "até o momento" },
      { titulo: "Confirmação", valor: "89%", detalhe: "índice do dia" }
    ],
    agendamentosGrafico: [
      { mes: "08h", total: 2 },
      { mes: "10h", total: 5 },
      { mes: "12h", total: 3 },
      { mes: "14h", total: 4 },
      { mes: "16h", total: 3 },
      { mes: "18h", total: 1 }
    ],
    servicosGrafico: [
      { nome: "Banho", total: 8 },
      { nome: "Tosa", total: 5 },
      { nome: "Consulta", total: 3 },
      { nome: "Vacina", total: 2 }
    ]
  },

  "7 dias": {
    resumo: {
      agendamentosHoje: "63",
      taxaConfirmacao: "84%",
      servicoTop: "Banho",
      ocupacao: "71%"
    },
    kpis: [
      { titulo: "Agendamentos", valor: "63", detalhe: "+9 nesta semana" },
      { titulo: "Clientes ativos", valor: "37", detalhe: "últimos 7 dias" },
      { titulo: "Pets atendidos", valor: "54", detalhe: "fluxo semanal" },
      { titulo: "Confirmação", valor: "84%", detalhe: "média da semana" }
    ],
    agendamentosGrafico: [
      { mes: "Seg", total: 8 },
      { mes: "Ter", total: 10 },
      { mes: "Qua", total: 9 },
      { mes: "Qui", total: 11 },
      { mes: "Sex", total: 13 },
      { mes: "Sáb", total: 7 },
      { mes: "Dom", total: 5 }
    ],
    servicosGrafico: [
      { nome: "Banho", total: 28 },
      { nome: "Tosa", total: 18 },
      { nome: "Consulta", total: 10 },
      { nome: "Vacina", total: 7 }
    ]
  },

  "30 dias": {
    resumo: {
      agendamentosHoje: "214",
      taxaConfirmacao: "82%",
      servicoTop: "Banho",
      ocupacao: "78%"
    },
    kpis: [
      { titulo: "Agendamentos", valor: "214", detalhe: "+12% no mês" },
      { titulo: "Clientes ativos", valor: "89", detalhe: "+5 nesta semana" },
      { titulo: "Pets cadastrados", valor: "124", detalhe: "+8 novos" },
      { titulo: "Confirmação", valor: "82%", detalhe: "índice mensal" }
    ],
    agendamentosGrafico: [
      { mes: "Sem 1", total: 48 },
      { mes: "Sem 2", total: 52 },
      { mes: "Sem 3", total: 56 },
      { mes: "Sem 4", total: 58 }
    ],
    servicosGrafico: [
      { nome: "Banho", total: 92 },
      { nome: "Tosa", total: 61 },
      { nome: "Consulta", total: 34 },
      { nome: "Vacina", total: 27 }
    ]
  }
};

const agendaHoje = [
  {
    horario: "09:00",
    pet: "Thor",
    tutor: "Mariana Costa",
    servico: "Banho",
    status: "Confirmado"
  },
  {
    horario: "10:30",
    pet: "Luna",
    tutor: "Carlos Souza",
    servico: "Tosa",
    status: "Pendente"
  },
  {
    horario: "11:15",
    pet: "Mel",
    tutor: "Fernanda Lima",
    servico: "Consulta",
    status: "Confirmado"
  },
  {
    horario: "14:00",
    pet: "Nina",
    tutor: "Patrícia Alves",
    servico: "Vacina",
    status: "Cancelado"
  },
  {
    horario: "15:20",
    pet: "Bob",
    tutor: "Rafael Martins",
    servico: "Banho e tosa",
    status: "Confirmado"
  }
];

const atividadesRecentes = [
  {
    titulo: "Novo agendamento realizado",
    texto: "Thor foi agendado para banho às 09:00.",
    hora: "há 5 min"
  },
  {
    titulo: "Cadastro atualizado",
    texto: "Cliente Mariana Costa alterou telefone.",
    hora: "há 18 min"
  },
  {
    titulo: "Serviço confirmado",
    texto: "Consulta da Mel foi confirmada pela tutora.",
    hora: "há 32 min"
  },
  {
    titulo: "Cancelamento registrado",
    texto: "Vacina da Nina foi cancelada.",
    hora: "há 1 h"
  }
];

const abas = [
  {
    id: "visao-geral",
    titulo: "Visão geral",
    descricao: "Resumo principal"
  },
  {
    id: "graficos",
    titulo: "KPIs e gráficos",
    descricao: "Indicadores e desempenho"
  },
  {
    id: "agenda",
    titulo: "Agendamentos",
    descricao: "Agenda do dia"
  },
  {
    id: "atividade",
    titulo: "Atividade recente",
    descricao: "Últimas movimentações"
  }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="admin-tooltip">
      {label && <p className="admin-tooltip-label">{label}</p>}
      <p className="admin-tooltip-value">{payload[0].value}</p>
    </div>
  );
};

function getStatusClass(status) {
  const normalizado = status.toLowerCase();

  if (normalizado === "confirmado") return "status confirmado";
  if (normalizado === "pendente") return "status pendente";
  return "status cancelado";
}

export default function Administracao() {
  const navigate = useNavigate();
  const [hoverLogout, setHoverLogout] = useState(false);
  const [periodoAtivo, setPeriodoAtivo] = useState("30 dias");
  const [abaAtiva, setAbaAtiva] = useState("visao-geral");

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/conta");
  }

  const dadosAtuais = useMemo(() => {
    return dadosPorPeriodo[periodoAtivo];
  }, [periodoAtivo]);

  function renderConteudo() {
    if (abaAtiva === "visao-geral") {
      return (
        <div className="admin-content-stack">
          <section className="admin-hero-card">
            <div className="admin-hero-text">
              <span className="admin-chip">Resumo do painel</span>
              <h2>Uma visão clara da operação do petshop</h2>
              <p>
                Acompanhe os principais números do sistema, a agenda do dia e
                o desempenho dos serviços em um painel mais organizado e dentro
                do estilo do seu site.
              </p>
            </div>

            <div className="admin-hero-mini-grid">
              <div className="admin-mini-card">
                <span>Agendamentos</span>
                <strong>{dadosAtuais.resumo.agendamentosHoje}</strong>
                <small>no período selecionado</small>
              </div>

              <div className="admin-mini-card destaque-amarelo">
                <span>Confirmação</span>
                <strong>{dadosAtuais.resumo.taxaConfirmacao}</strong>
                <small>índice atual</small>
              </div>

              <div className="admin-mini-card">
                <span>Serviço em alta</span>
                <strong>{dadosAtuais.resumo.servicoTop}</strong>
                <small>mais procurado</small>
              </div>

              <div className="admin-mini-card">
                <span>Ocupação</span>
                <strong>{dadosAtuais.resumo.ocupacao}</strong>
                <small>capacidade do período</small>
              </div>
            </div>
          </section>

          <section className="admin-kpi-grid">
            {dadosAtuais.kpis.map((item) => (
              <div key={item.titulo} className="admin-kpi-card">
                <span>{item.titulo}</span>
                <strong>{item.valor}</strong>
                <small>{item.detalhe}</small>
              </div>
            ))}
          </section>

          <section className="admin-two-columns">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Agendamentos por período</h3>
                  <p>Visão resumida do desempenho</p>
                </div>
              </div>

              <div className="admin-chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dadosAtuais.agendamentosGrafico}>
                    <defs>
                      <linearGradient id="colorAgendamentos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3370EB" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3370EB" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#dbe7ff"
                    />
                    <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3370EB"
                      strokeWidth={3}
                      fill="url(#colorAgendamentos)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Agenda de hoje</h3>
                  <p>Próximos atendimentos</p>
                </div>
              </div>

              <div className="admin-compact-list">
                {agendaHoje.slice(0, 4).map((item, index) => (
                  <div className="admin-schedule-item" key={index}>
                    <div className="admin-schedule-time">{item.horario}</div>

                    <div className="admin-schedule-info">
                      <strong>{item.pet}</strong>
                      <span>{item.servico}</span>
                      <small>{item.tutor}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (abaAtiva === "graficos") {
      return (
        <div className="admin-content-stack">
          <section className="admin-kpi-grid">
            {dadosAtuais.kpis.map((item) => (
              <div key={item.titulo} className="admin-kpi-card">
                <span>{item.titulo}</span>
                <strong>{item.valor}</strong>
                <small>{item.detalhe}</small>
              </div>
            ))}
          </section>

          <section className="admin-two-columns">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Agendamentos por período</h3>
                  <p>Evolução do movimento</p>
                </div>
              </div>

              <div className="admin-chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dadosAtuais.agendamentosGrafico}>
                    <defs>
                      <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3370EB" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3370EB" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#dbe7ff"
                    />
                    <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3370EB"
                      strokeWidth={3}
                      fill="url(#colorFlow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Serviços mais procurados</h3>
                  <p>Distribuição atual</p>
                </div>
              </div>

              <div className="admin-chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosAtuais.servicosGrafico} layout="vertical" barSize={18}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#dbe7ff"
                    />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="nome"
                      tickLine={false}
                      axisLine={false}
                      width={75}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" fill="#3370EB" radius={[0, 12, 12, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      );
    }

    if (abaAtiva === "agenda") {
      return (
        <div className="admin-content-stack">
          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h3>Agendamentos do dia</h3>
                <p>Organização dos atendimentos</p>
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
                    <tr key={index}>
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
        </div>
      );
    }

    return (
      <div className="admin-content-stack">
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h3>Atividade recente</h3>
              <p>Últimas movimentações do sistema</p>
            </div>
          </div>

          <div className="admin-activity-list">
            {atividadesRecentes.map((item, index) => (
              <div className="admin-activity-item" key={index}>
                <div className="admin-activity-dot" />
                <div className="admin-activity-content">
                  <strong>{item.titulo}</strong>
                  <p>{item.texto}</p>
                </div>
                <span className="admin-activity-time">{item.hora}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="admin-page">
        <section className="admin-wrapper">
          <div className="admin-topbar">
            <div className="admin-topbar-text">
              <span className="admin-badge">Administração</span>
              <h1>Painel Administrativo</h1>
              <p>
                Gerencie indicadores, agenda e movimentações do sistema em uma
                estrutura mais organizada e integrada ao visual do site.
              </p>
            </div>

            <div className="admin-topbar-actions">
              <div className="admin-period-filter">
                {periodos.map((periodo) => (
                  <button
                    key={periodo}
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
              >
                <img
                  src={hoverLogout ? IconLogoutHover : IconLogoutHover}
                  alt="Sair"
                  className="admin-logout-icon"
                />
                Sair
              </button>
            </div>
          </div>

          <div className="admin-layout">
            <aside className="admin-sidebar">
              <div className="admin-sidebar-card">
                <h3>Menu interno</h3>
                <p>Escolha a área que deseja visualizar dentro da administração.</p>
              </div>

              <nav className="admin-sidebar-nav">
                {abas.map((aba) => (
                  <button
                    key={aba.id}
                    className={`admin-side-tab ${abaAtiva === aba.id ? "active" : ""}`}
                    onClick={() => setAbaAtiva(aba.id)}
                  >
                    <span className="admin-side-tab-dot"></span>

                    <span className="admin-side-tab-texts">
                      <strong>{aba.titulo}</strong>
                      <small>{aba.descricao}</small>
                    </span>
                  </button>
                ))}
              </nav>
            </aside>

            <section className="admin-main-content">{renderConteudo()}</section>
          </div>
        </section>
      </main>
    </>
  );
}