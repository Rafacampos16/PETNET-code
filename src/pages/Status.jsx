import React, { useMemo, useState } from "react";
import "../styles/status.css";

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

const agendamentosIniciais = [
  {
    id: "1",
    pet: "Thor",
    tutor: "Mariana Costa",
    especie: "Cachorro",
    servico: "Banho",
    porte: "Médio",
    colaborador: "Rafaela Campos",
    collaborator_cpf: "98765432100",
    date_time: "2026-05-08T09:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.SCHEDULED,
    observation: "Cuidado extra com as patas",
  },
  {
    id: "2",
    pet: "Luna",
    tutor: "Carlos Souza",
    especie: "Gato",
    servico: "Tosa",
    porte: "Pequeno",
    colaborador: "Rafaela Campos",
    collaborator_cpf: "98765432100",
    date_time: "2026-05-08T10:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.CONFIRMED,
    observation: "Pet sensível a barulhos altos",
  },
  {
    id: "3",
    pet: "Mel",
    tutor: "Fernanda Lima",
    especie: "Cachorro",
    servico: "Banho e Tosa",
    porte: "Grande",
    colaborador: "Rafaela Campos",
    collaborator_cpf: "98765432100",
    date_time: "2026-05-08T11:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.SCHEDULED,
    observation: "Usar shampoo hipoalergênico",
  },
  {
    id: "4",
    pet: "Nina",
    tutor: "Patrícia Alves",
    especie: "Gato",
    servico: "Hidratação",
    porte: "Pequeno",
    colaborador: "Rafaela Campos",
    collaborator_cpf: "98765432100",
    date_time: "2026-05-08T13:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.CANCELED,
    observation: "Tutor solicitou remarcação",
  },
  {
    id: "5",
    pet: "Bob",
    tutor: "Rafael Martins",
    especie: "Cachorro",
    servico: "Tosa higiênica",
    porte: "Médio",
    colaborador: "Rafaela Campos",
    collaborator_cpf: "98765432100",
    date_time: "2026-05-08T14:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.FINISHED,
    observation: "Atendimento finalizado sem observações adicionais",
  },
];

const StatusPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [search, setSearch] = useState("");

  const agendamentosFiltrados = useMemo(() => {
    return agendamentosIniciais.filter((item) => {
      const texto = `
        ${item.pet}
        ${item.tutor}
        ${item.especie}
        ${item.servico}
        ${item.porte}
        ${item.colaborador}
        ${item.observation}
        ${statusMap[item.status]?.label}
      `.toLowerCase();

      return texto.includes(search.toLowerCase());
    });
  }, [search]);

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
      THIRTY_MINUTES: "30 minutos",
      ONE_HOUR: "1 hora",
      TWO_HOURS: "2 horas",
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
          <label>Buscar atendimento</label>
          <input
            type="text"
            placeholder="Buscar por pet, tutor, serviço ou colaborador"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

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
                          <strong>{formatarHorario(item.date_time)}</strong>
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