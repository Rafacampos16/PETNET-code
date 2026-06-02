import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Dog,
  Cat,
  Eye,
  GripVertical,
  Info,
  PackageCheck,
  PawPrint,
  Scissors,
  Timer,
  UserRound,
} from "lucide-react";
import "../styles/colaborador.css";
import scheduleService from "../services/scheduleService";

const ScheduleStatus = {
  SCHEDULED: "SCHEDULED",
  FINISHED: "FINISHED",
};

const statusMap = {
  [ScheduleStatus.SCHEDULED]: {
    label: "CONFIRMADOS",
    subtitle: "Atendimentos prontos para execução",
    className: "confirmed",
  },
  [ScheduleStatus.FINISHED]: {
    label: "FINALIZADOS",
    subtitle: "Atendimentos concluídos pelo colaborador",
    className: "finished",
  },
};

const speciesMap = {
  dog: "Cachorro",
  cat: "Gato",
};

const sizeMap = {
  S: "Pequeno",
  M: "Médio",
  L: "Grande",
  XL: "Gigante",
};

function normalizar(item) {
  return {
    ...item,
    pet: item.pet?.name || "—",
    tutor: item.pet?.tutor?.name || "—",
    especie: speciesMap[item.pet?.species] || "—",
    tipo: item.pet?.species === "cat" ? "cat" : "dog",
    porte: sizeMap[item.pet?.size] || "—",
    servico: item.services?.map((s) => s.name).join(", ") || "—",
    colaborador: item.collaborator?.name || "—",
    status: item.status_code || item.status,
    duration: item.duration_code || item.duration,
  };
}

const PetIcon = ({ tipo }) => {
  const Icon = tipo === "cat" ? Cat : Dog;

  return (
    <div className="colab-pet-icon">
      <Icon size={24} strokeWidth={2.4} />
    </div>
  );
};

const Colaborador = () => {
  const hoje = new Date();
  const hojeFormatado = hoje.toISOString().split("T")[0];

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dropAtivo, setDropAtivo] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [diaSelecionado, setDiaSelecionado] = useState(hojeFormatado);

  useEffect(() => {
    if (!diaSelecionado) return;

    setCarregando(true);
    setMensagem("");

    const [ano, mes, dia] = diaSelecionado.split("-").map(Number);
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
  }, [diaSelecionado]);

  const agendamentosVisiveis = useMemo(() => {
    return agendamentos
      .filter(
        (item) =>
          item.status === ScheduleStatus.SCHEDULED ||
          item.status === ScheduleStatus.FINISHED
      )
      .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
  }, [agendamentos]);

  const confirmados = useMemo(() => {
    return agendamentosVisiveis.filter(
      (item) => item.status === ScheduleStatus.SCHEDULED
    );
  }, [agendamentosVisiveis]);

  const finalizados = useMemo(() => {
    return agendamentosVisiveis.filter(
      (item) => item.status === ScheduleStatus.FINISHED
    );
  }, [agendamentosVisiveis]);

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

    return duracoes[duration] || duration || "—";
  }

  function getAgendamentosPorStatus(status) {
    return agendamentosVisiveis.filter((item) => item.status === status);
  }

  function handleDragStart(event, item) {
    if (item.status !== ScheduleStatus.SCHEDULED) return;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(item.id));

    setDraggedAppointment(item);
    setMensagem("");
  }

  function handleDragEnd() {
    setDraggedAppointment(null);
    setDropAtivo(false);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (draggedAppointment?.status === ScheduleStatus.SCHEDULED) {
      setDropAtivo(true);
    }
  }

  function handleDragLeave() {
  setDropAtivo(false);
}

  async function finalizarAgendamento(item) {
    if (!item || item.status !== ScheduleStatus.SCHEDULED) return;

    try {
      await scheduleService.atualizar(item.id, {
        status: ScheduleStatus.FINISHED,
      });

      const atualizado = {
        ...item,
        status: ScheduleStatus.FINISHED,
      };

      setAgendamentos((prev) =>
        prev.map((agendamento) =>
          agendamento.id === item.id ? atualizado : agendamento
        )
      );

      if (selectedAppointment?.id === item.id) {
        setSelectedAppointment(atualizado);
      }

      setMensagem(`${item.pet} foi movido para finalizados.`);
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao finalizar agendamento.");
    } finally {
      setDraggedAppointment(null);
      setDropAtivo(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();

    if (!draggedAppointment) return;

    finalizarAgendamento(draggedAppointment);
  }

  return (
    <div className="colab-container">
      <section className="colab-hero">
        <div>
          <span className="colab-badge">
            <PawPrint size={16} />
            Agenda do colaborador
          </span>

          <h1>Meus atendimentos</h1>

          <p>
            Visualize os atendimentos confirmados do dia e arraste para
            finalizados quando o serviço for concluído.
          </p>
        </div>

        <div className="colab-date-box">
          <label>
            <CalendarDays size={16} />
            Selecionar dia
          </label>

          <input
            type="date"
            value={diaSelecionado}
            onChange={(e) => setDiaSelecionado(e.target.value)}
          />
        </div>
      </section>

      {mensagem && (
        <div className="colab-feedback">
          <CheckCircle2 size={18} />
          <span>{mensagem}</span>
        </div>
      )}

      {carregando ? (
        <div className="colab-loading">
          <PawPrint size={30} />
          <p>Carregando agendamentos...</p>
        </div>
      ) : (
        <>
          <section className="colab-summary">
            <div className="colab-summary-card total">
              <small>Total visível</small>
              <strong>{agendamentosVisiveis.length}</strong>
            </div>

            <div className="colab-summary-card confirmed">
              <small>Confirmados</small>
              <strong>{confirmados.length}</strong>
            </div>

            <div className="colab-summary-card finished">
              <small>Finalizados</small>
              <strong>{finalizados.length}</strong>
            </div>
          </section>

          <section className="colab-board">
            {Object.keys(statusMap).map((statusKey) => {
              const agendamentosPorStatus = getAgendamentosPorStatus(statusKey);
              const statusInfo = statusMap[statusKey];
              const isFinalizados = statusKey === ScheduleStatus.FINISHED;

              return (
                <article
                  key={statusKey}
                  className={`colab-column ${statusInfo.className} ${isFinalizados && dropAtivo ? "drop-active" : ""
                    }`}
                  onDragOver={isFinalizados ? handleDragOver : undefined}
                  onDragLeave={isFinalizados ? handleDragLeave : undefined}
                  onDrop={isFinalizados ? handleDrop : undefined}
                >
                  <div className="colab-column-header">
                    <div>
                      <h2>{statusInfo.label}</h2>
                      <p>{statusInfo.subtitle}</p>
                    </div>

                    <span>{agendamentosPorStatus.length}</span>
                  </div>

                  {isFinalizados && (
                    <div className="colab-drop-hint">
                      <PackageCheck size={18} />
                      <span>Solte aqui para marcar como finalizado</span>
                    </div>
                  )}

                  <div className="colab-card-list">
                    {agendamentosPorStatus.length > 0 ? (
                      agendamentosPorStatus.map((item) => (
                        <div
                          key={item.id}
                          className={`colab-appointment-card ${item.status === ScheduleStatus.SCHEDULED
                              ? "draggable"
                              : ""
                            }`}
                          draggable={item.status === ScheduleStatus.SCHEDULED}
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="colab-card-top">
                            <PetIcon tipo={item.tipo} />

                            <div className="colab-card-info">
                              <h3>{item.pet}</h3>
                              <p>{item.servico}</p>
                            </div>

                            {item.status === ScheduleStatus.SCHEDULED && (
                              <GripVertical className="colab-drag-icon" size={22} />
                            )}
                          </div>

                          <div className="colab-card-meta">
                            <span>
                              <Clock size={14} />
                              {formatarHorario(item.date_time)}
                            </span>

                            <span>
                              <Timer size={14} />
                              {formatarDuracao(item.duration)}
                            </span>
                          </div>

                          <div className="colab-card-owner">
                            <span>Tutor</span>
                            <strong>{item.tutor}</strong>
                          </div>

                          <button
                            type="button"
                            className="colab-details-btn"
                            onClick={() => setSelectedAppointment(item)}
                          >
                            <Eye size={16} />
                            Ver detalhes
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="colab-empty">
                        <Info size={28} />
                        <strong>Nenhum atendimento</strong>
                        <p>Não há agendamentos nesta coluna.</p>
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
        <div
          className="colab-modal-overlay"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="colab-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="colab-modal-header">
              <div>
                <span
                  className={`colab-modal-status ${selectedAppointment.status === ScheduleStatus.FINISHED
                      ? "finished"
                      : "confirmed"
                    }`}
                >
                  {statusMap[selectedAppointment.status]?.label || "STATUS"}
                </span>

                <h2>{selectedAppointment.pet}</h2>
                <p>{selectedAppointment.servico}</p>
              </div>

              <button
                type="button"
                className="colab-modal-x"
                onClick={() => setSelectedAppointment(null)}
              >
                ×
              </button>
            </div>

            <div className="colab-info-grid">
              <div>
                <UserRound size={17} />
                <span>Tutor</span>
                <strong>{selectedAppointment.tutor}</strong>
              </div>

              <div>
                <Dog size={17} />
                <span>Espécie</span>
                <strong>{selectedAppointment.especie}</strong>
              </div>

              <div>
                <PawPrint size={17} />
                <span>Porte</span>
                <strong>{selectedAppointment.porte}</strong>
              </div>

              <div>
                <Clock size={17} />
                <span>Horário</span>
                <strong>{formatarHorario(selectedAppointment.date_time)}</strong>
              </div>

              <div>
                <CalendarDays size={17} />
                <span>Data</span>
                <strong>{formatarData(selectedAppointment.date_time)}</strong>
              </div>

              <div>
                <Timer size={17} />
                <span>Duração</span>
                <strong>{formatarDuracao(selectedAppointment.duration)}</strong>
              </div>

              <div>
                <Scissors size={17} />
                <span>Serviço</span>
                <strong>{selectedAppointment.servico}</strong>
              </div>

              <div>
                <UserRound size={17} />
                <span>Colaborador</span>
                <strong>{selectedAppointment.colaborador}</strong>
              </div>
            </div>

            <div className="colab-observation">
              <span>Observação</span>
              <p>{selectedAppointment.observation || "Sem observações."}</p>
            </div>

            {selectedAppointment.status === ScheduleStatus.SCHEDULED && (
              <button
                type="button"
                className="colab-finish-btn"
                onClick={() => finalizarAgendamento(selectedAppointment)}
              >
                <CheckCircle2 size={18} />
                Marcar como finalizado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Colaborador;