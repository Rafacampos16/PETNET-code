import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import "../styles/administracao.css";

import IconLogout from "../assets/icons/logout.png";
import IconLogoutHover from "../assets/icons/logout-h.png";

const periodos = ["Hoje", "7 dias", "30 dias", "6 meses"];

const agendamentosMes = [
  { mes: "Jan", total: 28 },
  { mes: "Fev", total: 35 },
  { mes: "Mar", total: 42 },
  { mes: "Abr", total: 38 },
  { mes: "Mai", total: 50 },
  { mes: "Jun", total: 57 }
];

const servicos = [
  { name: "Banho", value: 45 },
  { name: "Tosa", value: 30 },
  { name: "Consulta", value: 15 },
  { name: "Vacina", value: 10 }
];

const statusData = [
  { name: "Confirmados", total: 32 },
  { name: "Pendentes", total: 11 },
  { name: "Cancelados", total: 6 }
];

const ocupacaoHorarios = [
  { horario: "08h", total: 2 },
  { horario: "09h", total: 4 },
  { horario: "10h", total: 6 },
  { horario: "11h", total: 5 },
  { horario: "12h", total: 2 },
  { horario: "13h", total: 3 },
  { horario: "14h", total: 7 },
  { horario: "15h", total: 6 },
  { horario: "16h", total: 5 },
  { horario: "17h", total: 4 }
];

const ultimosAgendamentos = [
  {
    cliente: "Mariana Costa",
    pet: "Thor",
    servico: "Banho",
    horario: "09:00",
    status: "Confirmado"
  },
  {
    cliente: "Carlos Souza",
    pet: "Luna",
    servico: "Tosa",
    horario: "10:30",
    status: "Pendente"
  },
  {
    cliente: "Fernanda Lima",
    pet: "Mel",
    servico: "Consulta",
    horario: "11:15",
    status: "Confirmado"
  },
  {
    cliente: "Patrícia Alves",
    pet: "Nina",
    servico: "Vacina",
    horario: "14:00",
    status: "Cancelado"
  },
  {
    cliente: "Rafael Martins",
    pet: "Bob",
    servico: "Banho e tosa",
    horario: "15:20",
    status: "Confirmado"
  }
];

const kpis = [
  {
    title: "Agendamentos",
    value: "57",
    desc: "+12% este mês",
    icon: "calendar"
  },
  {
    title: "Pets cadastrados",
    value: "124",
    desc: "+8 novos esta semana",
    icon: "pet"
  },
  {
    title: "Clientes ativos",
    value: "89",
    desc: "Alta estabilidade",
    icon: "users"
  },
  {
    title: "Taxa de confirmação",
    value: "84%",
    desc: "Bom desempenho",
    icon: "check"
  }
];

const COLORS = ["#3370EB", "#F9EE7C", "#FF8FB1", "#8ED1B2"];

const totalServicos = servicos.reduce((acc, item) => acc + item.value, 0);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      {label && <p className="tooltip-label">{label}</p>}
      <p className="tooltip-value">{payload[0].value}</p>
    </div>
  );
};

function DashboardIcon({ type }) {
  const icons = {
    calendar: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M8 3V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 3V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M4 9H20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  pet: (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M8 7L6.2 4.8C5.8 4.3 5 4.6 5 5.2V10.3C4.4 11.2 4 12.3 4 13.5C4 17.6 7.6 21 12 21C16.4 21 20 17.6 20 13.5C20 12.3 19.6 11.2 19 10.3V5.2C19 4.6 18.2 4.3 17.8 4.8L16 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M9.5 14.2C9.5 14.8 9.1 15.2 8.5 15.2C7.9 15.2 7.5 14.8 7.5 14.2C7.5 13.6 7.9 13.2 8.5 13.2C9.1 13.2 9.5 13.6 9.5 14.2Z"
      fill="currentColor"
    />
    <path
      d="M16.5 14.2C16.5 14.8 16.1 15.2 15.5 15.2C14.9 15.2 14.5 14.8 14.5 14.2C14.5 13.6 14.9 13.2 15.5 13.2C16.1 13.2 16.5 13.6 16.5 14.2Z"
      fill="currentColor"
    />
    <path
      d="M10.2 17C10.8 17.5 11.4 17.8 12 17.8C12.6 17.8 13.2 17.5 13.8 17"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M11.5 15.5H12.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
),
    users: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M4 19C4 16.7909 6.23858 15 9 15C11.7614 15 14 16.7909 14 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M15.5 18.5C15.9 17 17.3 16 19 16C20.7 16 22 17 22 18.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M8.5 12.5L10.8 14.8L15.8 9.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  };

  return <div className="svg-icon">{icons[type]}</div>;
}

const Administracao = () => {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);
  const [periodoAtivo, setPeriodoAtivo] = React.useState("30 dias");

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/conta");
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div className="admin-header">
            <span className="admin-badge">Painel Administrativo</span>
            <h1 className="admin-title">Gerenciamento PetNet</h1>
            <p className="admin-subtitle">
              Acompanhe indicadores, acessos rápidos e o desempenho geral da
              plataforma em uma visão moderna e estratégica.
            </p>
          </div>

          <div className="admin-actions">
            <div className="period-filter">
              {periodos.map((periodo) => (
                <button
                  key={periodo}
                  className={periodoAtivo === periodo ? "filter-btn active" : "filter-btn"}
                  onClick={() => setPeriodoAtivo(periodo)}
                >
                  {periodo}
                </button>
              ))}
            </div>

            <div className="admin-logout-wrapper">
              <button
                className="admin-logout-btn"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleLogout}
              >
                <img
                  src={hover ? IconLogout : IconLogoutHover}
                  alt="Sair"
                  className="logout-icon"
                />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        <section className="hero-summary">
          <div className="hero-summary-left">
            <span className="hero-mini-label">Resumo do período</span>
            <h2>Visão executiva do seu petshop</h2>
            <p>
              O período selecionado mostra crescimento consistente nos
              agendamentos, boa taxa de confirmação e evolução contínua da base
              de clientes e pets cadastrados.
            </p>
          </div>

          <div className="hero-summary-right">
            <div className="hero-highlight-card">
              <small>Melhor resultado</small>
              <strong>57 agendamentos</strong>
              <span>Maior volume registrado no período</span>
            </div>

            <div className="hero-highlight-card soft">
              <small>Período analisado</small>
              <strong>{periodoAtivo}</strong>
              <span>Indicadores atualizados para comparação</span>
            </div>
          </div>
        </section>

        <section className="kpi-grid">
          {kpis.map((item) => (
            <div className="kpi-card" key={item.title}>
              <div className="kpi-icon">
                <DashboardIcon type={item.icon} />
              </div>

              <div className="kpi-content">
                <div className="kpi-top">
                  <h3>{item.title}</h3>
                  <span className="kpi-compare">{item.compare}</span>
                </div>

                <strong>{item.value}</strong>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="admin-shortcuts">
          <div className="section-header">
            <div>
              <h2>Acessos rápidos</h2>
              <span>Módulos principais</span>
            </div>
          </div>

          <div className="cards-container">
            <Link to="/admin/agendamentos" className="admin-card">
              <div className="admin-card-top">
                <span>AGENDAMENTOS</span>
                <b>01</b>
              </div>
              <small>Controle de horários, reservas e fluxo diário.</small>
            </Link>

            <Link to="/admin/clientes" className="admin-card">
              <div className="admin-card-top">
                <span>CLIENTES</span>
                <b>02</b>
              </div>
              <small>Cadastro, histórico e acompanhamento dos clientes.</small>
            </Link>

            <Link to="/admin/pets" className="admin-card">
              <div className="admin-card-top">
                <span>PETS</span>
                <b>03</b>
              </div>
              <small>Dados dos pets atendidos e informações principais.</small>
            </Link>

            <Link to="/admin/status" className="admin-card">
              <div className="admin-card-top">
                <span>STATUS</span>
                <b>04</b>
              </div>
              <small>Situação dos atendimentos e controle operacional.</small>
            </Link>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Visão geral</h2>
              <span>Indicadores do sistema</span>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-panel panel-large">
              <div className="panel-head">
                <div>
                  <h3>Agendamentos por mês</h3>
                  <p>Evolução dos últimos meses</p>
                </div>
                <span className="panel-tag">Crescimento</span>
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={agendamentosMes}>
                    <defs>
                      <linearGradient id="colorAgendamento" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3370EB" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3370EB" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#dfe8fb" />
                    <XAxis dataKey="mes" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3370EB"
                      strokeWidth={3}
                      fill="url(#colorAgendamento)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h3>Serviços mais procurados</h3>
                  <p>Distribuição atual</p>
                </div>
                <span className="panel-tag soft-tag">Serviços</span>
              </div>

              <div className="chart-box chart-box-pie">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={servicos}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {servicos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pie-center-info">
                  <strong>{totalServicos}</strong>
                  <span>total</span>
                </div>
              </div>

              <div className="custom-legend">
                {servicos.map((item, index) => (
                  <div className="legend-item" key={item.name}>
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="legend-name">{item.name}</span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h3>Status dos atendimentos</h3>
                  <p>Resumo operacional</p>
                </div>
                <span className="panel-tag warning-tag">Operação</span>
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={statusData} barCategoryGap={28}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#dfe8fb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" radius={[14, 14, 6, 6]} fill="#F9EE7C" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-panel insights-panel">
              <div className="panel-head">
                <div>
                  <h3>Insights rápidos</h3>
                  <p>Leitura visual do momento</p>
                </div>
              </div>

              <div className="insight-list">
                <div className="insight-item">
                  <span className="insight-dot blue"></span>
                  <div>
                    <strong>Pico de agendamentos</strong>
                    <p>Junho foi o melhor mês até agora e mostra tendência positiva.</p>
                  </div>
                </div>

                <div className="insight-item">
                  <span className="insight-dot yellow"></span>
                  <div>
                    <strong>Serviço líder</strong>
                    <p>Banho permanece como o principal responsável pelo volume.</p>
                  </div>
                </div>

                <div className="insight-item">
                  <span className="insight-dot pink"></span>
                  <div>
                    <strong>Ponto de atenção</strong>
                    <p>Atendimentos pendentes podem exigir confirmação mais rápida.</p>
                  </div>
                </div>

                <div className="insight-item">
                  <span className="insight-dot green"></span>
                  <div>
                    <strong>Crescimento contínuo</strong>
                    <p>A base de pets cadastrados segue aumentando de forma estável.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h3>Ranking de serviços</h3>
                  <p>Desempenho por categoria</p>
                </div>
              </div>

              <div className="ranking-list">
                {servicos.map((item, index) => (
                  <div className="ranking-item" key={item.name}>
                    <div className="ranking-top">
                      <span>{item.name}</span>
                      <strong>{item.value}%</strong>
                    </div>
                    <div className="ranking-bar">
                      <span
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h3>Ocupação diária por horário</h3>
                  <p>Distribuição dos atendimentos ao longo do dia</p>
                </div>
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ocupacaoHorarios} barCategoryGap={14}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#dfe8fb" />
                    <XAxis dataKey="horario" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="#3370EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-panel panel-table">
              <div className="panel-head">
                <div>
                  <h3>Últimos agendamentos</h3>
                  <p>Movimentações recentes da agenda</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Pet</th>
                      <th>Serviço</th>
                      <th>Horário</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimosAgendamentos.map((item, index) => (
                      <tr key={index}>
                        <td>{item.cliente}</td>
                        <td>{item.pet}</td>
                        <td>{item.servico}</td>
                        <td>{item.horario}</td>
                        <td>
                          <span
                            className={`status-badge ${item.status
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Administracao;