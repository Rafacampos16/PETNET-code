import React, { useMemo, useRef, useState } from "react";
import { Cat, Dog } from "lucide-react";
import "../styles/colaborador.css";

const ScheduleStatus = {
  SCHEDULED: "SCHEDULED",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  FINISHED: "FINISHED",
};

const agendamentosIniciais = [
  {
    id: 1,
    tipo: "dog",
    client_cpf: "12345678900",
    pet_id: 1,
    pet: "Thor",
    tutor: "Mariana Costa",
    collaborator_cpf: "98765432100",
    colaborador: "Rafaela Campos",
    date_time: "2026-05-08T09:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.SCHEDULED,
    observation: "Cuidado extra com as patas",
    services: [1],
    servicosNomes: ["Banho"],
    porte: "Médio",
  },
  {
    id: 2,
    tipo: "cat",
    client_cpf: "23456789011",
    pet_id: 2,
    pet: "Luna",
    tutor: "Carlos Souza",
    collaborator_cpf: "98765432100",
    colaborador: "Rafaela Campos",
    date_time: "2026-05-08T10:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.CONFIRMED,
    observation: "Pet sensível a barulhos altos",
    services: [2],
    servicosNomes: ["Tosa"],
    porte: "Pequeno",
  },
  {
    id: 3,
    tipo: "dog",
    client_cpf: "34567890122",
    pet_id: 3,
    pet: "Mel",
    tutor: "Fernanda Lima",
    collaborator_cpf: "98765432100",
    colaborador: "Rafaela Campos",
    date_time: "2026-05-08T11:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.SCHEDULED,
    observation: "Usar shampoo hipoalergênico",
    services: [1, 2],
    servicosNomes: ["Banho", "Tosa"],
    porte: "Grande",
  },
  {
    id: 4,
    tipo: "cat",
    client_cpf: "45678901233",
    pet_id: 4,
    pet: "Nina",
    tutor: "Patrícia Alves",
    collaborator_cpf: "98765432100",
    colaborador: "Rafaela Campos",
    date_time: "2026-05-08T13:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.CANCELED,
    observation: "Tutor solicitou remarcação",
    services: [3],
    servicosNomes: ["Hidratação"],
    porte: "Pequeno",
  },
  {
    id: 5,
    tipo: "dog",
    client_cpf: "56789012344",
    pet_id: 5,
    pet: "Bob",
    tutor: "Rafael Martins",
    collaborator_cpf: "98765432100",
    colaborador: "Rafaela Campos",
    date_time: "2026-05-08T14:00:00",
    duration: "ONE_HOUR",
    status: ScheduleStatus.FINISHED,
    observation: "Atendimento finalizado sem observações adicionais",
    services: [4],
    servicosNomes: ["Tosa higiênica"],
    porte: "Médio",
  },
];

const statusConfig = {
  SCHEDULED: {
    label: "Agendado",
    className: "status-cinza",
    dot: "gray",
  },
  CONFIRMED: {
    label: "Confirmado",
    className: "status-azul",
    dot: "blue",
  },
  CANCELED: {
    label: "Cancelado",
    className: "status-vermelho",
    dot: "red",
  },
  FINISHED: {
    label: "Finalizado",
    className: "status-verde",
    dot: "green",
  },
};

const PetIcon = ({ tipo, large = false }) => {
  const Icon = tipo === "cat" ? Cat : Dog;

  return (
    <div className={`pet-icon ${large ? "large" : ""}`}>
      <Icon size={large ? 34 : 24} strokeWidth={2.4} />
    </div>
  );
};

const Colaborador = () => {
  const [agendamentos, setAgendamentos] = useState(agendamentosIniciais);
  const [selecionado, setSelecionado] = useState(agendamentosIniciais[0]);
  const [filtro, setFiltro] = useState("");
  const [dataAtual, setDataAtual] = useState("2026-05-08");
  const [mensagem, setMensagem] = useState("");

  const inputDataRef = useRef(null);

  const agendamentosFiltrados = useMemo(() => {
    return agendamentos
      .filter((item) => {
        const dataAgendamento = item.date_time.split("T")[0];
        return dataAgendamento === dataAtual;
      })
      .filter((item) => {
        const texto = `
          ${item.tutor}
          ${item.pet}
          ${item.colaborador}
          ${item.status}
          ${item.servicosNomes.join(" ")}
          ${item.observation}
        `.toLowerCase();

        return texto.includes(filtro.toLowerCase());
      })
      .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
  }, [agendamentos, dataAtual, filtro]);

  const resumo = useMemo(() => {
    const listaDoDia = agendamentos.filter(
      (item) => item.date_time.split("T")[0] === dataAtual
    );

    return {
      total: listaDoDia.length,
      agendados: listaDoDia.filter(
        (item) => item.status === ScheduleStatus.SCHEDULED
      ).length,
      confirmados: listaDoDia.filter(
        (item) => item.status === ScheduleStatus.CONFIRMED
      ).length,
      cancelados: listaDoDia.filter(
        (item) => item.status === ScheduleStatus.CANCELED
      ).length,
      finalizados: listaDoDia.filter(
        (item) => item.status === ScheduleStatus.FINISHED
      ).length,
    };
  }, [agendamentos, dataAtual]);

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
      THIRTY_MINUTES: "30 minutos",
      ONE_HOUR: "1 hora",
      TWO_HOURS: "2 horas",
    };

    return duracoes[duration] || duration;
  }

  function alterarData(dias) {
    const novaData = new Date(`${dataAtual}T00:00:00`);
    novaData.setDate(novaData.getDate() + dias);

    setDataAtual(novaData.toISOString().split("T")[0]);
    setSelecionado(null);
    setMensagem("");
  }

  function abrirCalendario() {
    if (inputDataRef.current?.showPicker) {
      inputDataRef.current.showPicker();
    } else {
      inputDataRef.current?.click();
    }
  }

  function alterarStatus(novoStatus) {
    if (!selecionado) {
      alert("Selecione um agendamento primeiro.");
      return;
    }

    const agendamentosAtualizados = agendamentos.map((item) =>
      item.id === selecionado.id
        ? {
          ...item,
          status: novoStatus,
        }
        : item
    );

    const agendamentoAtualizado = {
      ...selecionado,
      status: novoStatus,
    };

    setAgendamentos(agendamentosAtualizados);
    setSelecionado(agendamentoAtualizado);

    setMensagem(
      `Status de ${agendamentoAtualizado.pet} alterado para ${statusConfig[novoStatus].label
      }.`
    );

    /*
      Quando ligar com o back-end, aqui entraria o PATCH/PUT.

      Exemplo do payload que pode ser enviado:

      {
        status: novoStatus
      }

      Ou, se o back precisar do objeto completo:

      {
        client_cpf: agendamentoAtualizado.client_cpf,
        pet_id: agendamentoAtualizado.pet_id,
        collaborator_cpf: agendamentoAtualizado.collaborator_cpf,
        date_time: agendamentoAtualizado.date_time,
        duration: agendamentoAtualizado.duration,
        status: novoStatus,
        observation: agendamentoAtualizado.observation,
        services: agendamentoAtualizado.services
      }
    */
  }

  function getStatusClass(status) {
    return statusConfig[status]?.className || "status-cinza";
  }

  function getStatusLabel(status) {
    return statusConfig[status]?.label || status;
  }

  return (
    <div className="colaborador-page">
      <div className="colaborador-shell">
        <header className="colaborador-topbar">
          <div>
            <span className="colab-badge">Controle de status</span>
            <h1>Status dos agendamentos</h1>
            <p>
              Acompanhe os atendimentos cadastrados e atualize o status para
              exibição na agenda do colaborador.
            </p>
          </div>

          <div className="date-control">
            <button className="date-btn" onClick={() => alterarData(-1)}>
              ‹
            </button>

            <div className="date-display" onClick={abrirCalendario}>
              <span>{formatarData(dataAtual)}</span>

              <input
                ref={inputDataRef}
                type="date"
                value={dataAtual}
                onChange={(e) => {
                  setDataAtual(e.target.value);
                  setSelecionado(null);
                  setMensagem("");
                }}
                className="calendar-hidden"
              />
            </div>

            <button className="date-btn" onClick={() => alterarData(1)}>
              ›
            </button>
          </div>
        </header>

        {mensagem && <div className="status-feedback">{mensagem}</div>}

        <section className="colaborador-stats">
          <div className="stat-card">
            <small>Total do dia</small>
            <strong>{resumo.total}</strong>
          </div>

          <div className="stat-card">
            <small>Agendados</small>
            <strong>{resumo.agendados}</strong>
          </div>

          <div className="stat-card">
            <small>Confirmados</small>
            <strong>{resumo.confirmados}</strong>
          </div>

          <div className="stat-card">
            <small>Finalizados</small>
            <strong>{resumo.finalizados}</strong>
          </div>
        </section>

        <section className="agenda-layout">
          <aside className="fila-card">
            <div className="card-header">
              <div>
                <h3>Agendamentos</h3>
                <p>Selecione um atendimento para alterar o status</p>
              </div>

              <span className="badge">{agendamentosFiltrados.length}</span>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por tutor, pet, serviço ou status"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <div className="fila-list">
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.map((item) => (
                  <div
                    key={item.id}
                    className={`fila-item ${selecionado?.id === item.id ? "selecionado" : ""
                      }`}
                    onClick={() => {
                      setSelecionado(item);
                      setMensagem("");
                    }}
                  >
                    <PetIcon tipo={item.tipo} />

                    <div className="info">
                      <h4>{item.pet}</h4>
                      <p>{item.tutor}</p>
                      <small>{item.servicosNomes.join(", ")}</small>
                    </div>

                    <div className="fila-actions">
                      <span className="hora">{formatarHorario(item.date_time)}</span>
                      <small className={getStatusClass(item.status)}>
                        {getStatusLabel(item.status)}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>Nenhum agendamento encontrado</strong>
                  <p>
                    Não existem atendimentos para esta data ou o filtro não
                    encontrou resultados.
                  </p>
                </div>
              )}
            </div>

            <div className="drag-help">
              <strong>Fluxo atualizado</strong>
              <span>O agendamento é criado na tela de agendamentos.</span>
            </div>
          </aside>

          <section className="agenda-card">
            <div className="card-header agenda-card-header">
              <div>
                <h3>Agenda do dia</h3>
                <p>Visualização dos atendimentos por horário e status</p>
              </div>
            </div>

            <div className="agenda-body agenda-body-dinamica">
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.map((item) => (
                  <div
                    key={item.id}
                    className={`agenda-item ${getStatusClass(item.status)} ${selecionado?.id === item.id ? "selecionado" : ""
                      }`}
                    onClick={() => {
                      setSelecionado(item);
                      setMensagem("");
                    }}
                  >
                    <div className="agenda-time">
                      <strong>{formatarHorario(item.date_time)}</strong>
                      <span>{formatarDuracao(item.duration)}</span>
                    </div>

                    <div className="agenda-info">
                      <strong>{item.pet}</strong>
                      <p>{item.servicosNomes.join(", ")}</p>
                      <small>{item.tutor}</small>
                    </div>

                    <div className="agenda-colaborador">
                      <span>{item.colaborador}</span>
                      <small>{getStatusLabel(item.status)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="agenda-empty agenda-empty-large">
                  <strong>Agenda vazia</strong>
                  <span>Nenhum atendimento encontrado para esta data</span>
                  <small>
                    Os agendamentos criados aparecerão aqui para controle de status.
                  </small>
                </div>
              )}
            </div>
          </section>

          <aside className="detalhes-card detalhes-card-compacto">
            <div className="card-header">
              <div>
                <h3>Alterar status</h3>
                <p>Selecione o atendimento e atualize a situação</p>
              </div>
            </div>

            <div className="pet-info pet-info-compacta">
              <PetIcon tipo={selecionado?.tipo || "dog"} large />

              <div>
                <h2>{selecionado?.pet || "Selecione um pet"}</h2>
                <p>{selecionado?.tutor || "Nenhum atendimento selecionado"}</p>
                <small>{selecionado?.servicosNomes?.join(", ") || "---"}</small>
              </div>
            </div>

            <div className="status-atual-box">
              <span>Status atual</span>
              <strong className={selecionado?.status ? getStatusClass(selecionado.status) : ""}>
                {selecionado?.status ? getStatusLabel(selecionado.status) : "---"}
              </strong>
            </div>

            <div className="actions-box actions-box-principal">
              <div className="actions">
                <button
                  className="btn-custom gray"
                  onClick={() => alterarStatus(ScheduleStatus.SCHEDULED)}
                >
                  <span>○</span>
                  Agendado
                </button>

                <button
                  className="btn-custom blue"
                  onClick={() => alterarStatus(ScheduleStatus.CONFIRMED)}
                >
                  <span>✓</span>
                  Confirmar
                </button>

                <button
                  className="btn-custom green"
                  onClick={() => alterarStatus(ScheduleStatus.FINISHED)}
                >
                  <span>✓</span>
                  Finalizar
                </button>

                <button
                  className="btn-custom red"
                  onClick={() => alterarStatus(ScheduleStatus.CANCELED)}
                >
                  <span>×</span>
                  Cancelar
                </button>
              </div>
            </div>

            <div className="info-box info-box-resumido">
              <div className="info-row">
                <span>Horário</span>
                <strong>
                  {selecionado?.date_time ? formatarHorario(selecionado.date_time) : "---"}
                </strong>
              </div>

              <div className="info-row">
                <span>Duração</span>
                <strong>
                  {selecionado?.duration ? formatarDuracao(selecionado.duration) : "---"}
                </strong>
              </div>

              <div className="info-row">
                <span>Colaborador</span>
                <strong>{selecionado?.colaborador || "---"}</strong>
              </div>

              <div className="info-row">
                <span>Observação</span>
                <strong>{selecionado?.observation || "---"}</strong>
              </div>
            </div>

            <div className="status-box status-box-compacto">
              <h3>Legenda</h3>

              <div className="status-grid">
                <div>
                  <span className="dot gray"></span>
                  Agendado
                </div>

                <div>
                  <span className="dot blue"></span>
                  Confirmado
                </div>

                <div>
                  <span className="dot green"></span>
                  Finalizado
                </div>

                <div>
                  <span className="dot red"></span>
                  Cancelado
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Colaborador;