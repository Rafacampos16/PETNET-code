import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Cat,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dog,
  Home,
  Info,
  PackageCheck,
  PawPrint,
  Search,
  Scissors,
  Timer,
  UserRound,
  XCircle,
} from "lucide-react";
import "../styles/status.css";
import scheduleService from "../services/scheduleService";

const ScheduleStatus = {
  SCHEDULED: "SCHEDULED",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  FINISHED: "FINISHED",
  DELIVERED: "DELIVERED",
};

const statusConfig = {
  SCHEDULED: {
    label: "Agendado",
    className: "status-cinza",
    dot: "gray",
    description: "Criado automaticamente",
  },
  CONFIRMED: {
    label: "Confirmado",
    className: "status-azul",
    dot: "blue",
    description: "Atendimento confirmado",
  },
  FINISHED: {
    label: "Finalizado",
    className: "status-verde",
    dot: "green",
    description: "Serviço concluído",
  },
  DELIVERED: {
    label: "Entregue",
    className: "status-roxo",
    dot: "purple",
    description: "Pet entregue ao cliente",
  },
  CANCELED: {
    label: "Cancelado",
    className: "status-vermelho",
    dot: "red",
    description: "Atendimento cancelado",
  },
};

function normalizar(item) {
  return {
    ...item,
    pet: item.pet?.name || "—",
    tutor: item.pet?.tutor?.name || "—",
    especie: item.pet?.species || "—",
    porte: item.pet?.size || "—",
    tipo: item.pet?.species === "cat" ? "cat" : "dog",
    servicosNomes: item.services?.map((s) => s.name) || [],
    colaborador: item.collaborator?.name || "—",
    status: item.status_code || item.status,
    duration: item.duration_code || item.duration,
  };
}

const PetIcon = ({ tipo, large = false }) => {
  const Icon = tipo === "cat" ? Cat : Dog;

  return (
    <div className={`pet-icon ${large ? "large" : ""}`}>
      <Icon size={large ? 34 : 24} strokeWidth={2.4} />
    </div>
  );
};

const Status = () => {
  const hoje = new Date().toISOString().split("T")[0];

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [dataAtual, setDataAtual] = useState(hoje);
  const [mensagem, setMensagem] = useState("");

  const inputDataRef = useRef(null);

  useEffect(() => {
    if (!dataAtual) return;

    setCarregando(true);
    setSelecionado(null);
    setMensagem("");

    const [ano, mes, dia] = dataAtual.split("-").map(Number);
    const inicioDia = new Date(ano, mes - 1, dia).toISOString();
    const fimDia = new Date(ano, mes - 1, dia, 23, 59, 59).toISOString();

    scheduleService
      .listar(inicioDia, fimDia)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAgendamentos(data.map(normalizar));
      })
      .catch((err) => console.error("Erro ao carregar agendamentos:", err))
      .finally(() => setCarregando(false));
  }, [dataAtual]);

  const agendamentosFiltrados = useMemo(() => {
    return agendamentos
      .filter((item) => {
        const texto = `
          ${item.tutor}
          ${item.pet}
          ${item.colaborador}
          ${item.status}
          ${getStatusLabel(item.status)}
          ${item.servicosNomes.join(" ")}
          ${item.observation}
        `.toLowerCase();

        return texto.includes(filtro.toLowerCase());
      })
      .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
  }, [agendamentos, filtro]);

  const resumo = useMemo(
    () => ({
      total: agendamentos.length,
      agendados: agendamentos.filter((i) => i.status === ScheduleStatus.SCHEDULED).length,
      confirmados: agendamentos.filter((i) => i.status === ScheduleStatus.CONFIRMED).length,
      finalizados: agendamentos.filter((i) => i.status === ScheduleStatus.FINISHED).length,
      entregues: agendamentos.filter((i) => i.status === ScheduleStatus.DELIVERED).length,
      cancelados: agendamentos.filter((i) => i.status === ScheduleStatus.CANCELED).length,
    }),
    [agendamentos]
  );

  function formatarData(data) {
    const date = new Date(`${data}T00:00:00`);
    const texto = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function formatarHorario(dateTime) {
    return new Date(dateTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatarDuracao(duration) {
    const duracoes = {
      THIRTY_MIN: "30 minutos",
      FORTY_FIVE_MIN: "45 minutos",
      ONE_HOUR: "1 hora",
      ONE_HALF_HOUR: "1h30",
      TWO_HOURS: "2 horas",
      TWO_HALF_HOURS: "2h30",
      THREE_HOURS: "3 horas",
    };

    return duracoes[duration] || duration || "—";
  }

  function alterarData(dias) {
    const novaData = new Date(`${dataAtual}T00:00:00`);
    novaData.setDate(novaData.getDate() + dias);
    setDataAtual(novaData.toISOString().split("T")[0]);
  }

  function abrirCalendario() {
    if (inputDataRef.current?.showPicker) {
      inputDataRef.current.showPicker();
    } else {
      inputDataRef.current?.click();
    }
  }

  async function alterarStatus(novoStatus) {
    if (!selecionado) {
      alert("Selecione um agendamento primeiro.");
      return;
    }

    try {
      await scheduleService.atualizar(selecionado.id, { status: novoStatus });

      const atualizado = { ...selecionado, status: novoStatus };

      setAgendamentos((prev) =>
        prev.map((item) => (item.id === selecionado.id ? atualizado : item))
      );

      setSelecionado(atualizado);
      setMensagem(
        `Status de ${atualizado.pet} alterado para ${statusConfig[novoStatus].label}.`
      );
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao atualizar status.");
    }
  }

  function getStatusClass(status) {
    return statusConfig[status]?.className || "status-cinza";
  }

  function getStatusLabel(status) {
    return statusConfig[status]?.label || status || "—";
  }

  function getStatusDescription(status) {
    return statusConfig[status]?.description || "Status do atendimento";
  }

  return (
    <div className="status-admin-page">
      <div className="status-admin-shell">
        <header className="status-admin-hero">
          <div className="status-admin-hero-text">
            <span className="status-admin-badge">
              <PawPrint size={16} />
              Controle de status
            </span>

            <h1>Status dos agendamentos</h1>

            <p>
              Atualize a situação dos atendimentos do dia e acompanhe cada etapa
              do fluxo do petshop.
            </p>
          </div>

          <div className="status-date-card">
            <button type="button" className="status-date-btn" onClick={() => alterarData(-1)}>
              <ChevronLeft size={22} />
            </button>

            <button type="button" className="status-date-display" onClick={abrirCalendario}>
              <CalendarDays size={19} />
              <span>{formatarData(dataAtual)}</span>

              <input
                ref={inputDataRef}
                type="date"
                value={dataAtual}
                onChange={(e) => setDataAtual(e.target.value)}
                className="calendar-hidden"
              />
            </button>

            <button type="button" className="status-date-btn" onClick={() => alterarData(1)}>
              <ChevronRight size={22} />
            </button>
          </div>
        </header>

        {mensagem && (
          <div className="status-feedback">
            <CheckCircle2 size={18} />
            <span>{mensagem}</span>
          </div>
        )}

        {carregando ? (
          <div className="status-loading">
            <PawPrint size={28} />
            <p>Carregando agendamentos...</p>
          </div>
        ) : (
          <>
            <section className="status-admin-stats">
              <div className="status-stat-card total">
                <small>Total do dia</small>
                <strong>{resumo.total}</strong>
              </div>

              <div className="status-stat-card">
                <small>Agendados</small>
                <strong>{resumo.agendados}</strong>
              </div>

              <div className="status-stat-card blue">
                <small>Confirmados</small>
                <strong>{resumo.confirmados}</strong>
              </div>

              <div className="status-stat-card green">
                <small>Finalizados</small>
                <strong>{resumo.finalizados}</strong>
              </div>

              <div className="status-stat-card purple">
                <small>Entregues</small>
                <strong>{resumo.entregues}</strong>
              </div>
            </section>

            <section className="status-workspace">
              <div className="status-list-panel">
                <div className="status-panel-header">
                  <div>
                    <h2>Agendamentos</h2>
                    <p>Selecione um atendimento para ver detalhes e alterar o status.</p>
                  </div>

                  <span>{agendamentosFiltrados.length}</span>
                </div>

                <div className="status-search">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Buscar por pet, tutor, serviço, colaborador ou status"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </div>

                <div className="status-list">
                  {agendamentosFiltrados.length > 0 ? (
                    agendamentosFiltrados.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`status-appointment-card ${
                          selecionado?.id === item.id ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelecionado(item);
                          setMensagem("");
                        }}
                      >
                        <PetIcon tipo={item.tipo} />

                        <div className="status-appointment-info">
                          <div className="status-appointment-title">
                            <h3>{item.pet}</h3>
                            <span className={getStatusClass(item.status)}>
                              {getStatusLabel(item.status)}
                            </span>
                          </div>

                          <p>{item.tutor}</p>

                          <div className="status-appointment-meta">
                            <span>
                              <Clock size={14} />
                              {formatarHorario(item.date_time)}
                            </span>

                            <span>
                              <Scissors size={14} />
                              {item.servicosNomes.join(", ") || "—"}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="status-empty">
                      <Info size={28} />
                      <strong>Nenhum agendamento encontrado</strong>
                      <p>
                        Não existem atendimentos para esta data ou o filtro não
                        encontrou resultados.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <aside className={`status-details-panel ${selecionado ? "open" : ""}`}>
                {selecionado ? (
                  <>
                    <div className="status-details-top">
                      <div className="status-details-pet">
                        <PetIcon tipo={selecionado.tipo} large />

                        <div>
                          <span className={getStatusClass(selecionado.status)}>
                            {getStatusLabel(selecionado.status)}
                          </span>
                          <h2>{selecionado.pet}</h2>
                          <p>{selecionado.servicosNomes.join(", ") || "—"}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="status-close-mobile"
                        onClick={() => setSelecionado(null)}
                        aria-label="Fechar detalhes"
                      >
                        ×
                      </button>
                    </div>

                    <div className="status-current-box">
                      <div>
                        <small>Status atual</small>
                        <strong>{getStatusLabel(selecionado.status)}</strong>
                        <p>{getStatusDescription(selecionado.status)}</p>
                      </div>
                    </div>

                    <div className="status-actions-box">
                      <button
                        type="button"
                        className="status-action-btn blue"
                        onClick={() => alterarStatus(ScheduleStatus.CONFIRMED)}
                      >
                        <CheckCircle2 size={20} />
                        Confirmar
                      </button>

                      <button
                        type="button"
                        className="status-action-btn green"
                        onClick={() => alterarStatus(ScheduleStatus.FINISHED)}
                      >
                        <CheckCircle2 size={20} />
                        Finalizar
                      </button>

                      <button
                        type="button"
                        className="status-action-btn purple"
                        onClick={() => alterarStatus(ScheduleStatus.DELIVERED)}
                      >
                        <PackageCheck size={20} />
                        Entregue
                      </button>

                      <button
                        type="button"
                        className="status-action-btn red"
                        onClick={() => alterarStatus(ScheduleStatus.CANCELED)}
                      >
                        <XCircle size={20} />
                        Cancelar
                      </button>
                    </div>

                    <div className="status-details-grid">
                      <div>
                        <UserRound size={17} />
                        <span>Tutor</span>
                        <strong>{selecionado.tutor}</strong>
                      </div>

                      <div>
                        <Clock size={17} />
                        <span>Horário</span>
                        <strong>{formatarHorario(selecionado.date_time)}</strong>
                      </div>

                      <div>
                        <Timer size={17} />
                        <span>Duração</span>
                        <strong>{formatarDuracao(selecionado.duration)}</strong>
                      </div>

                      <div>
                        <Scissors size={17} />
                        <span>Serviço</span>
                        <strong>{selecionado.servicosNomes.join(", ") || "—"}</strong>
                      </div>

                      <div>
                        <UserRound size={17} />
                        <span>Colaborador</span>
                        <strong>{selecionado.colaborador}</strong>
                      </div>

                      <div>
                        <Info size={17} />
                        <span>Observação</span>
                        <strong>{selecionado.observation || "Sem observações."}</strong>
                      </div>
                    </div>

                    <div className="status-legend-card">
                      <h3>Legenda</h3>

                      <div className="status-legend-grid">
                        <div><span className="dot gray"></span> Agendado</div>
                        <div><span className="dot blue"></span> Confirmado</div>
                        <div><span className="dot green"></span> Finalizado</div>
                        <div><span className="dot purple"></span> Entregue</div>
                        <div><span className="dot red"></span> Cancelado</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="status-no-selection">
                    <div>
                      <Home size={34} />
                    </div>
                    <h2>Selecione um atendimento</h2>
                    <p>
                      Os detalhes e botões de alteração aparecem aqui quando um
                      agendamento for escolhido.
                    </p>
                  </div>
                )}
              </aside>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Status;