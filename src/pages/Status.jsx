import React, { useEffect, useMemo, useState } from "react";
import "../styles/status.css";
import scheduleService from "../services/scheduleService";

const ScheduleStatus = {
  SCHEDULED: "SCHEDULED",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  FINISHED: "FINISHED",
};

const statusMap = {
  [ScheduleStatus.SCHEDULED]: {
    label: "AGENDADOS",
    subtitle: "Atendimentos criados e aguardando confirmação",
    className: "scheduled",
  },
  [ScheduleStatus.CONFIRMED]: {
    label: "CONFIRMADOS",
    subtitle: "Atendimentos confirmados para execução",
    className: "confirmed",
  },
  [ScheduleStatus.FINISHED]: {
    label: "FINALIZADOS",
    subtitle: "Atendimentos já concluídos",
    className: "finished",
  },
  [ScheduleStatus.CANCELED]: {
    label: "CANCELADOS",
    subtitle: "Atendimentos cancelados",
    className: "canceled",
  },
};

const speciesMap = {
  dog: "Cachorro",
  cat: "Gato",
};

const sizeMap = {
 S: 'Pequeno',
  M: 'Médio',
  L: 'Grande',
  XL: 'Gigante'
};

// Transforma o objeto da API no formato que o componente usa
function normalizar(item) {
  return {
    ...item,
    pet: item.pet?.name || "—",
    tutor: item.pet?.tutor?.name || "—",
    especie: speciesMap[item.pet?.species] || "—",
    porte: sizeMap[item.pet?.size] || "—",
    servico: item.services?.map((s) => s.name).join(", ") || "—",
    colaborador: item.collaborator?.name || "—",
    status: item.status_code || item.status,
    duration: item.duration_code || item.duration,
  };
}

const StatusPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [search, setSearch] = useState("");
  const hoje = new Date();
  const hojeFormatado = hoje.toISOString().split("T")[0];
  const [diaSelecionado, setDiaSelecionado] = useState(hojeFormatado);

  // Carrega agendamentos do dia atual
  useEffect(() => {
    if (!diaSelecionado) return;
    setCarregando(true);

    const [ano, mes, dia] = diaSelecionado.split("-").map(Number);
    const inicioDia = new Date(ano, mes - 1, dia).toISOString();
    const fimDia = new Date(ano, mes - 1, dia, 23, 59, 59).toISOString();

    scheduleService.listar(inicioDia, fimDia)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAgendamentos(data.map(normalizar));
      })
      .catch((err) => console.error("Erro ao carregar agendamentos:", err))
      .finally(() => setCarregando(false));
  }, [diaSelecionado]);



  // Aplica filtro de colaborador + busca por texto
  const agendamentosFiltrados = useMemo(() => {
    return agendamentos.filter((item) => {
      const texto = `
      ${item.pet} ${item.tutor} ${item.especie}
      ${item.servico} ${item.porte} ${item.colaborador}
      ${item.observation} ${statusMap[item.status]?.label}
    `.toLowerCase();
      return texto.includes(search.toLowerCase());
    });
  }, [agendamentos, search]);

  function formatarHorario(dateTime) {
    return new Date(dateTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatarData(dateTime) {
    return new Date(dateTime).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
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
    return duracoes[duration] || duration;
  }

  function getAgendamentosPorStatus(status) {
    return agendamentosFiltrados
      .filter((item) => item.status === status)
      .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
  }

  return (
    <div className="status-container">
      <section className="status-hero">
        <div>
          <span className="status-badge">Agenda do colaborador</span>
          <h1 className="status-title">Status dos agendamentos</h1>
          <p className="status-subtitle">
            Visualize os atendimentos vinculados ao colaborador e acompanhe o status de cada agendamento.
          </p>
        </div>

        <div className="status-search-box">
          <label>Selecionar dia</label>
          <input
            type="date"
            value={diaSelecionado}
            onChange={(e) => setDiaSelecionado(e.target.value)}
          />

          <label>Buscar atendimento</label>
          <input
            type="text"
            placeholder="Buscar por pet, tutor, serviço ou colaborador"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {carregando ? (
        <p style={{ textAlign: "center", padding: "2rem" }}>Carregando agendamentos...</p>
      ) : (
        <>
          <section className="status-summary">
            {Object.keys(statusMap).map((statusKey) => (
              <div key={statusKey} className={`summary-card ${statusMap[statusKey].className}`}>
                <small>{statusMap[statusKey].label}</small>
                <strong>{getAgendamentosPorStatus(statusKey).length}</strong>
              </div>
            ))}
          </section>

          <section className="status-columns">
            {Object.keys(statusMap).map((statusKey) => {
              const agendamentos = getAgendamentosPorStatus(statusKey);
              const statusInfo = statusMap[statusKey];

              return (
                <article key={statusKey} className={`status-column ${statusInfo.className}`}>
                  <div className="column-header">
                    <div>
                      <h2>{statusInfo.label}</h2>
                      <p>{statusInfo.subtitle}</p>
                    </div>
                    <span>{agendamentos.length}</span>
                  </div>

                  <div className="status-card-list">
                    {agendamentos.length > 0 ? (
                      agendamentos.map((item) => (
                        <div key={item.id} className="pet-card pet-card-mini">
                          <div className="pet-mini-top">
                            <div className="pet-time-mini">
                              <strong>{formatarDuracao(item.duration)}</strong>
                            </div>
                            <div className="pet-mini-info">
                              <h3>{item.pet}</h3>
                              <p>{item.servico}</p>
                            </div>
                          </div>

                          <div className="pet-mini-collaborator">
                            <span>Colaborador</span>
                            <strong>{item.colaborador}</strong>
                          </div>

                          <button
                            className="detalhes-btn detalhes-btn-mini"
                            type="button"
                            onClick={() => setSelectedAppointment(item)}
                          >
                            Ver detalhes
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-column">
                        <strong>Nenhum atendimento</strong>
                        <p>Não há agendamentos neste status.</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className={`modal-status ${statusMap[selectedAppointment.status].className}`}>
                  {statusMap[selectedAppointment.status].label}
                </span>
                <h2>{selectedAppointment.pet}</h2>
                <p>{selectedAppointment.servico}</p>
              </div>
              <button
                className="modal-x"
                type="button"
                onClick={() => setSelectedAppointment(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-collaborator">
              <span>Colaborador responsável</span>
              <strong>{selectedAppointment.colaborador}</strong>
            </div>

            <div className="modal-info-grid">
              <div>
                <span>Tutor</span>
                <strong>{selectedAppointment.tutor}</strong>
              </div>
              <div>
                <span>Espécie</span>
                <strong>{selectedAppointment.especie}</strong>
              </div>
              <div>
                <span>Porte</span>
                <strong>{selectedAppointment.porte}</strong>
              </div>
              <div>
                <span>Horário</span>
                <strong>{formatarHorario(selectedAppointment.date_time)}</strong>
              </div>
              <div>
                <span>Data</span>
                <strong>{formatarData(selectedAppointment.date_time)}</strong>
              </div>
              <div>
                <span>Duração</span>
                <strong>{formatarDuracao(selectedAppointment.duration)}</strong>
              </div>
            </div>

            <div className="modal-observation">
              <span>Observação</span>
              <p>{selectedAppointment.observation || "Sem observações."}</p>
            </div>

            <button
              className="close-modal-btn"
              type="button"
              onClick={() => setSelectedAppointment(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
