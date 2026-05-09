import React, { useMemo, useRef, useState } from "react";
import { Cat, Dog } from "lucide-react";
import "../styles/colaborador.css";

const agendamentosIniciais = [
  {
    id: 1,
    tipo: "dog",
    tutor: "Mariana Costa",
    pet: "Thor",
    servico: "Banho",
    porte: "Médio",
    horarioPreferencial: "09:00"
  },
  {
    id: 2,
    tipo: "cat",
    tutor: "Carlos Souza",
    pet: "Luna",
    servico: "Tosa",
    porte: "Pequeno",
    horarioPreferencial: "10:00"
  },
  {
    id: 3,
    tipo: "dog",
    tutor: "Fernanda Lima",
    pet: "Mel",
    servico: "Banho e tosa",
    porte: "Grande",
    horarioPreferencial: "11:00"
  },
  {
    id: 4,
    tipo: "cat",
    tutor: "Patrícia Alves",
    pet: "Nina",
    servico: "Hidratação",
    porte: "Pequeno",
    horarioPreferencial: "13:00"
  },
  {
    id: 5,
    tipo: "dog",
    tutor: "Rafael Martins",
    pet: "Bob",
    servico: "Tosa higiênica",
    porte: "Médio",
    horarioPreferencial: "14:00"
  }
];

const PetIcon = ({ tipo, large = false }) => {
  const Icon = tipo === "cat" ? Cat : Dog;

  return (
    <div className={`pet-icon ${large ? "large" : ""}`}>
      <Icon size={large ? 34 : 24} strokeWidth={2.4} />
    </div>
  );
};

const Colaborador = () => {
  const [fila, setFila] = useState(agendamentosIniciais);
  const [agenda, setAgenda] = useState([]);
  const [dragItem, setDragItem] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [dataAtual, setDataAtual] = useState("2026-05-08");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [formAgendamento, setFormAgendamento] = useState({
    colaborador: "",
    horaInicio: "",
    duracao: ""
  });

  const inputDataRef = useRef(null);

  const filaFiltrada = useMemo(() => {
    return fila.filter((item) => {
      const texto = `${item.tutor} ${item.pet} ${item.servico} ${item.porte}`.toLowerCase();
      return texto.includes(filtro.toLowerCase());
    });
  }, [fila, filtro]);

  const agendaOrdenada = useMemo(() => {
    return [...agenda].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }, [agenda]);

  const resumo = useMemo(() => {
    const emAndamento = agenda.filter((item) => item.status === "andamento").length;
    const concluidos = agenda.filter((item) => item.status === "concluido").length;
    const cancelados = agenda.filter((item) => item.status === "cancelado").length;

    return {
      agendados: agenda.length,
      emAndamento,
      concluidos,
      cancelados,
      naFila: fila.length
    };
  }, [agenda, fila.length]);

  function formatarData(data) {
    const date = new Date(`${data}T00:00:00`);

    const texto = date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function alterarData(dias) {
    const novaData = new Date(`${dataAtual}T00:00:00`);
    novaData.setDate(novaData.getDate() + dias);

    setDataAtual(novaData.toISOString().split("T")[0]);

    setAgenda([]);
    setFila(agendamentosIniciais);
    setSelecionado(null);
    setDragItem(null);
    setMostrarModal(false);
    setErrors({});
  }

  function abrirCalendario() {
    if (inputDataRef.current?.showPicker) {
      inputDataRef.current.showPicker();
    } else {
      inputDataRef.current?.click();
    }
  }

  function iniciarDrag(item, origem) {
    setDragItem({ ...item, origem });
  }

  function devolverParaFila() {
    if (!dragItem || dragItem.origem !== "agenda") return;

    setFila((prev) =>
      [...prev, { ...dragItem, status: "" }].sort((a, b) =>
        a.horarioPreferencial.localeCompare(b.horarioPreferencial)
      )
    );

    setAgenda((prev) => prev.filter((item) => item.id !== dragItem.id));
    setSelecionado(null);
    setDragItem(null);
  }

  function soltarNaAgenda() {
    if (!dragItem) return;

    setFormAgendamento({
      colaborador: dragItem.colaborador || "",
      horaInicio: dragItem.horaInicio || dragItem.horarioPreferencial || "",
      duracao: dragItem.duracao || "60"
    });

    setErrors({});
    setMostrarModal(true);
  }

  function abrirModalAgendamentoMobile(item) {
    setDragItem({ ...item, origem: "fila" });

    setFormAgendamento({
      colaborador: item.colaborador || "",
      horaInicio: item.horaInicio || item.horarioPreferencial || "",
      duracao: item.duracao || "60"
    });

    setErrors({});
    setMostrarModal(true);
  }

  function validarHora(hora) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(hora);
  }

  function confirmarMovimentacao() {
    const newErrors = {};

    if (!formAgendamento.colaborador.trim()) {
      newErrors.colaborador = true;
    }

    if (!formAgendamento.horaInicio || !validarHora(formAgendamento.horaInicio)) {
      newErrors.horaInicio = true;
    }

    if (!formAgendamento.duracao || Number(formAgendamento.duracao) <= 0) {
      newErrors.duracao = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const novoAgendamento = {
      ...dragItem,
      colaborador: formAgendamento.colaborador,
      horaInicio: formAgendamento.horaInicio,
      duracao: formAgendamento.duracao,
      status: dragItem.status || "agendado"
    };

    setAgenda((prev) => {
      const semDuplicado = prev.filter((item) => item.id !== novoAgendamento.id);

      return [...semDuplicado, novoAgendamento].sort((a, b) =>
        a.horaInicio.localeCompare(b.horaInicio)
      );
    });

    if (dragItem.origem === "fila") {
      setFila((prev) => prev.filter((item) => item.id !== dragItem.id));
    }

    setSelecionado(novoAgendamento);
    setDragItem(null);
    setMostrarModal(false);
  }

  function fecharModal() {
    setMostrarModal(false);
    setDragItem(null);
    setErrors({});
  }

  function alterarStatus(status) {
    if (!selecionado || !agenda.some((item) => item.id === selecionado.id)) {
      alert("Selecione um agendamento na agenda primeiro.");
      return;
    }

    setAgenda((prev) =>
      prev.map((item) =>
        item.id === selecionado.id ? { ...item, status } : item
      )
    );

    setSelecionado((prev) => ({
      ...prev,
      status
    }));
  }

  function getStatusClass(status) {
    if (status === "andamento") return "status-azul";
    if (status === "concluido") return "status-verde";
    if (status === "cancelado") return "status-vermelho";
    return "";
  }

  return (
    <div className="colaborador-page">
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-box modal-agenda">
            <div className="modal-header">
              <h3>Confirmar atendimento</h3>
              <p>Informe quem realizará o serviço e confirme os dados do horário.</p>
            </div>

            <div className="modal-pet-card">
              <PetIcon tipo={dragItem?.tipo} />

              <div>
                <strong>{dragItem?.pet}</strong>
                <span>{dragItem?.tutor}</span>
                <small>{dragItem?.servico}</small>
              </div>
            </div>

            <label>Colaborador responsável *</label>
            <input
              type="text"
              placeholder="Digite o nome do colaborador"
              value={formAgendamento.colaborador}
              onChange={(e) => {
                setFormAgendamento((prev) => ({
                  ...prev,
                  colaborador: e.target.value
                }));
                setErrors((prev) => ({ ...prev, colaborador: false }));
              }}
              className={errors.colaborador ? "input-error" : ""}
            />

            <div className="modal-dupla">
              <div>
                <label>Horário de início *</label>
                <input
                  type="text"
                  placeholder="Ex: 09:00"
                  maxLength="5"
                  value={formAgendamento.horaInicio}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");

                    if (value.length > 4) value = value.slice(0, 4);

                    if (value.length >= 3) {
                      value = `${value.slice(0, 2)}:${value.slice(2)}`;
                    }

                    setFormAgendamento((prev) => ({
                      ...prev,
                      horaInicio: value
                    }));
                    setErrors((prev) => ({ ...prev, horaInicio: false }));
                  }}
                  className={errors.horaInicio ? "input-error" : ""}
                />
              </div>

              <div>
                <label>Duração *</label>
                <input
                  type="number"
                  placeholder="Minutos"
                  min="1"
                  value={formAgendamento.duracao}
                  onChange={(e) => {
                    setFormAgendamento((prev) => ({
                      ...prev,
                      duracao: e.target.value
                    }));
                    setErrors((prev) => ({ ...prev, duracao: false }));
                  }}
                  className={errors.duracao ? "input-error" : ""}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancelar" onClick={fecharModal}>
                Cancelar
              </button>

              <button
                type="button"
                className="btn-confirmar"
                onClick={confirmarMovimentacao}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="colaborador-shell">
        <header className="colaborador-topbar">
          <div>
            <span className="colab-badge">Painel do colaborador</span>
            <h1>Agenda de atendimentos</h1>
            <p>
              Arraste os agendamentos para a agenda e eles serão organizados
              automaticamente pelo horário de início.
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

                  setAgenda([]);
                  setFila(agendamentosIniciais);
                  setSelecionado(null);
                  setDragItem(null);
                  setMostrarModal(false);
                  setErrors({});
                }}
                className="calendar-hidden"
              />
            </div>

            <button className="date-btn" onClick={() => alterarData(1)}>
              ›
            </button>
          </div>
        </header>

        <section className="colaborador-stats">
          <div className="stat-card">
            <small>Agendados</small>
            <strong>{resumo.agendados}</strong>
          </div>

          <div className="stat-card">
            <small>Em andamento</small>
            <strong>{resumo.emAndamento}</strong>
          </div>

          <div className="stat-card">
            <small>Concluídos</small>
            <strong>{resumo.concluidos}</strong>
          </div>

          <div className="stat-card">
            <small>Na fila</small>
            <strong>{resumo.naFila}</strong>
          </div>
        </section>

        <section className="agenda-layout">
          <aside className="fila-card">
            <div className="card-header">
              <div>
                <h3>Fila de agendamentos</h3>
                <p>Arraste para a agenda ao lado</p>
              </div>

              <span className="badge">{filaFiltrada.length}</span>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por tutor, pet ou serviço"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <div
              className="fila-list"
              onDragOver={(e) => e.preventDefault()}
              onDrop={devolverParaFila}
            >
              {filaFiltrada.length > 0 ? (
                filaFiltrada.map((item) => (
                  <div
                    key={item.id}
                    className="fila-item"
                    draggable
                    onDragStart={() => iniciarDrag(item, "fila")}
                    onClick={() => setSelecionado({ ...item, horario: null })}
                  >
                    <PetIcon tipo={item.tipo} />

                    <div className="info">
                      <h4>{item.pet}</h4>
                      <p>{item.tutor}</p>
                      <small>{item.servico}</small>
                    </div>

                    <div className="fila-actions">
                      <span className="hora">{item.horarioPreferencial}</span>

                      <button
                        type="button"
                        className="btn-mobile-agendar"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalAgendamentoMobile(item);
                        }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>Nenhum agendamento encontrado</strong>
                  <p>
                    Todos os atendimentos já foram organizados ou o filtro não
                    encontrou resultados.
                  </p>
                </div>
              )}
            </div>

            <div className="drag-help">
              <strong>Arraste um agendamento</strong>
              <span>para montar a agenda do dia</span>
            </div>
          </aside>

          <section
            className="agenda-card"
            onDragOver={(e) => e.preventDefault()}
            onDrop={soltarNaAgenda}
          >
            <div className="card-header agenda-card-header">
              <div>
                <h3>Minha agenda</h3>
                <p>Os atendimentos são ordenados automaticamente por horário</p>
              </div>
            </div>

            <div className="agenda-body agenda-body-dinamica">
              {agendaOrdenada.length > 0 ? (
                agendaOrdenada.map((item) => (
                  <div
                    key={item.id}
                    className={`agenda-item ${getStatusClass(item.status)} ${selecionado?.id === item.id ? "selecionado" : ""
                      }`}
                    draggable
                    onDragStart={() => iniciarDrag(item, "agenda")}
                    onClick={() => setSelecionado(item)}
                  >
                    <div className="agenda-time">
                      <strong>{item.horaInicio}</strong>
                      <span>{item.duracao} min</span>
                    </div>

                    <div className="agenda-info">
                      <strong>{item.pet}</strong>
                      <p>{item.servico}</p>
                      <small>{item.tutor}</small>
                    </div>

                    <div className="agenda-colaborador">
                      <span>{item.colaborador}</span>
                      <small>{item.status || "agendado"}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="agenda-empty agenda-empty-large">
                  <strong>Agenda vazia</strong>
                  <span>Arraste um atendimento da fila para começar</span>
                  <small>Depois de confirmar, ele será ordenado pelo horário informado</small>
                </div>
              )}
            </div>
          </section>

          <aside className="detalhes-card">
            <div className="card-header">
              <div>
                <h3>Detalhes</h3>
                <p>Informações do atendimento selecionado</p>
              </div>
            </div>

            <div className="pet-info">
              <PetIcon tipo={selecionado?.tipo || "dog"} large />

              <div>
                <h2>{selecionado?.pet || "---"}</h2>
                <p>{selecionado?.tutor || "---"}</p>
                <small>{selecionado?.servico || "---"}</small>
              </div>
            </div>

            <div className="info-box">
              <div className="info-row">
                <span>Horário</span>
                <strong>
                  {selecionado?.horaInicio ||
                    selecionado?.horarioPreferencial ||
                    "---"}
                </strong>
              </div>

              <div className="info-row">
                <span>Duração</span>
                <strong>
                  {selecionado?.duracao ? `${selecionado.duracao} minutos` : "---"}
                </strong>
              </div>

              <div className="info-row">
                <span>Colaborador</span>
                <strong>{selecionado?.colaborador || "---"}</strong>
              </div>

              <div className="info-row">
                <span>Porte</span>
                <strong>{selecionado?.porte || "---"}</strong>
              </div>

              <div className="info-row">
                <span>Status</span>
                <strong>{selecionado?.status || "---"}</strong>
              </div>
            </div>

            <div className="actions-box">
              <h3>Ações</h3>

              <div className="actions">
                <button
                  className="btn-custom blue"
                  onClick={() => alterarStatus("andamento")}
                >
                  <span>▶</span>
                  Iniciar atendimento
                </button>

                <button
                  className="btn-custom green"
                  onClick={() => alterarStatus("concluido")}
                >
                  <span>✓</span>
                  Finalizar
                </button>

                <button
                  className="btn-custom red"
                  onClick={() => alterarStatus("cancelado")}
                >
                  <span>×</span>
                  Cancelar
                </button>
              </div>
            </div>

            <div className="status-box">
              <h3>Legenda de status</h3>

              <div className="status-grid">
                <div>
                  <span className="dot blue"></span>
                  Em andamento
                </div>

                <div>
                  <span className="dot green"></span>
                  Concluído
                </div>

                <div>
                  <span className="dot red"></span>
                  Cancelado
                </div>

                <div>
                  <span className="dot gray"></span>
                  Na fila
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