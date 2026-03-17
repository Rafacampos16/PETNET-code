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
  Tooltip,
  Legend
} from "recharts";
import "../styles/administracao.css";

import IconLogout from "../assets/icons/logout.png";
import IconLogoutHover from "../assets/icons/logout-h.png";

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

const COLORS = ["#4F8CFF", "#FFD966", "#FF8FB1", "#8ED1B2"];

const Administracao = () => {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);

  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/conta");
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="admin-header">
          <span className="admin-badge">Painel Administrativo</span>
          <h1 className="admin-title">Gerenciamento PetNet</h1>
          <p className="admin-subtitle">
            Acompanhe indicadores, acessos rapidos e desempenho geral da plataforma.
          </p>
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

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">📅</div>
          <div>
            <h3>Agendamentos</h3>
            <strong>57</strong>
            <p>+12% este mes</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">🐶</div>
          <div>
            <h3>Pets cadastrados</h3>
            <strong>124</strong>
            <p>+8 novos esta semana</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">👩‍💼</div>
          <div>
            <h3>Clientes ativos</h3>
            <strong>89</strong>
            <p>Alta estabilidade</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">✅</div>
          <div>
            <h3>Taxa de confirmacao</h3>
            <strong>84%</strong>
            <p>Bom desempenho</p>
          </div>
        </div>
      </section>

      {/* atalhos */}
      <section className="admin-shortcuts">
        <div className="section-header">
          <h2>Acessos rapidos</h2>
          <span>Modulos principais</span>
        </div>

        <div className="cards-container">
          <Link to="/admin/agendamentos" className="admin-card">
            <span>AGENDAMENTOS</span>
            <small>Controle de horarios e reservas</small>
          </Link>

          <Link to="/admin/clientes" className="admin-card">
            <span>CLIENTES</span>
            <small>Cadastro e acompanhamento</small>
          </Link>

          <Link to="/admin/pets" className="admin-card">
            <span>PETS</span>
            <small>Dados dos pets atendidos</small>
          </Link>

          <Link to="/admin/status" className="admin-card">
            <span>STATUS</span>
            <small>Fluxo e situacao dos atendimentos</small>
          </Link>
        </div>
      </section>

      {/* dashboard */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Visao geral</h2>
          <span>Indicadores do sistema</span>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-panel panel-large">
            <div className="panel-head">
              <h3>Agendamentos por mes</h3>
              <p>Evolucao dos ultimos meses</p>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={agendamentosMes}>
                  <defs>
                    <linearGradient id="colorAgendamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#4F8CFF"
                    strokeWidth={3}
                    fill="url(#colorAgendamento)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-head">
              <h3>Servicos mais procurados</h3>
              <p>Distribuicao atual</p>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicos}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {servicos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-head">
              <h3>Status dos atendimentos</h3>
              <p>Resumo operacional</p>
            </div>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="#ffd966" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-panel insights-panel">
            <div className="panel-head">
              <h3>Insights rapidos</h3>
              <p>Leitura visual do momento</p>
            </div>

            <div className="insight-list">
              <div className="insight-item">
                <span className="insight-dot blue"></span>
                <div>
                  <strong>Pico de agendamentos</strong>
                  <p>Junho foi o melhor mes ate agora.</p>
                </div>
              </div>

              <div className="insight-item">
                <span className="insight-dot yellow"></span>
                <div>
                  <strong>Servico líder</strong>
                  <p>Banho continua como o servico mais procurado.</p>
                </div>
              </div>

              <div className="insight-item">
                <span className="insight-dot pink"></span>
                <div>
                  <strong>Atenção</strong>
                  <p>Existem atendimentos pendentes que podem exigir confirmacao.</p>
                </div>
              </div>

              <div className="insight-item">
                <span className="insight-dot green"></span>
                <div>
                  <strong>Base crescendo</strong>
                  <p>Cadastro de pets segue em crescimento constante.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Administracao;