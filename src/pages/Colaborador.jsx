import React, { useMemo, useState } from "react";
import "../styles/colaborador.css";

const agendamentosIniciais = [
  {
    id: 1,
    tutor: "Mariana Costa",
    pet: "Thor",
    servico: "Banho",
    porte: "Médio",
    horarioPreferencial: "09:00"
  },
  {
    id: 2,
    tutor: "Carlos Souza",
    pet: "Luna",
    servico: "Tosa",
    porte: "Pequeno",
    horarioPreferencial: "10:00"
  },
  {
    id: 3,
    tutor: "Fernanda Lima",
    pet: "Mel",
    servico: "Banho e tosa",
    porte: "Grande",
    horarioPreferencial: "11:00"
  },
  {
    id: 4,
    tutor: "Patrícia Alves",
    pet: "Nina",
    servico: "Hidratação",
    porte: "Pequeno",
    horarioPreferencial: "13:00"
  },
  {
    id: 5,
    tutor: "Rafael Martins",
    pet: "Bob",
    servico: "Tosa higiênica",
    porte: "Médio",
    horarioPreferencial: "14:00"
  }
];

const horariosBase = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
];

const Colaborador = () => {
  const [agendamentosDisponiveis, setAgendamentosDisponiveis] = useState(
    agendamentosIniciais
  );
  const [agenda, setAgenda] = useState(
    horariosBase.map((hora) => ({
      hora,
      agendamento: null
    }))
  );
  const [filtro, setFiltro] = useState("");

  const agendamentosFiltrados = useMemo(() => {
    return agendamentosDisponiveis.filter((item) => {
      const texto =
        `${item.tutor} ${item.pet} ${item.servico} ${item.porte}`.toLowerCase();
      return texto.includes(filtro.toLowerCase());
    });
  }, [agendamentosDisponiveis, filtro]);

  const resumo = useMemo(() => {
    const total = agenda.filter((item) => item.agendamento).length;
    const livres = agenda.length - total;
    return { total, livres };
  }, [agenda]);

  function handleDragStart(event, agendamento) {
    event.dataTransfer.setData("agendamento", JSON.stringify(agendamento));
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event, horaSlot) {
    event.preventDefault();

    const data = event.dataTransfer.getData("agendamento");
    if (!data) return;

    const agendamento = JSON.parse(data);

    const horarioJaTemItem = agenda.find(
      (slot) => slot.hora === horaSlot && slot.agendamento
    );

    if (horarioJaTemItem) return;

    setAgenda((prev) =>
      prev.map((slot) =>
        slot.hora === horaSlot ? { ...slot, agendamento } : slot
      )
    );

    setAgendamentosDisponiveis((prev) =>
      prev.filter((item) => item.id !== agendamento.id)
    );
  }

  function removerDaAgenda(horaSlot) {
    const slotEncontrado = agenda.find((slot) => slot.hora === horaSlot);
    if (!slotEncontrado || !slotEncontrado.agendamento) return;

    const agendamentoRemovido = slotEncontrado.agendamento;

    setAgenda((prev) =>
      prev.map((slot) =>
        slot.hora === horaSlot ? { ...slot, agendamento: null } : slot
      )
    );

    setAgendamentosDisponiveis((prev) =>
      [...prev, agendamentoRemovido].sort((a, b) =>
        a.horarioPreferencial.localeCompare(b.horarioPreferencial)
      )
    );
  }

  return (
    <div className="colaborador-page">
      <div className="colaborador-shell">
        <section className="colab-top-strip">
          <div className="top-card main">
            <span className="colab-badge">Painel do colaborador</span>
            <h1>Minha agenda de atendimentos</h1>
            <p>
              Arraste os atendimentos disponíveis para os horários da agenda e
              organize seu dia de forma rápida e visual.
            </p>
          </div>

          <div className="top-card mini">
            <small>Atribuídos</small>
            <strong>{resumo.total}</strong>
            <span>Na agenda de hoje</span>
          </div>

          <div className="top-card mini soft">
            <small>Horários livres</small>
            <strong>{resumo.livres}</strong>
            <span>Disponíveis no turno</span>
          </div>
        </section>

        <section className="colab-board">
          <aside className="fila-panel">
            <div className="panel-head fila-head">
              <div>
                <h2>Fila de agendamentos</h2>
                <p>Arraste para os horários ao lado</p>
              </div>

              <div className="fila-head-right">
                <span className="panel-tag">Disponíveis</span>
                <strong className="panel-count">{agendamentosFiltrados.length}</strong>
              </div>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por tutor, pet ou serviço"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <div className="fila-lista">
              {agendamentosFiltrados.length > 0 ? (
                agendamentosFiltrados.map((item) => (
                  <div
                    key={item.id}
                    className="fila-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                  >
                    <div className="fila-card-left">
                      <div className="pet-avatar">{item.pet.charAt(0)}</div>

                      <div className="fila-identidade">
                        <strong>{item.pet}</strong>
                        <span>{item.tutor}</span>
                      </div>
                    </div>

                    <div className="fila-card-middle">
                      <span className="servico-badge">{item.servico}</span>
                      <div className="fila-meta">
                        <small>{item.porte}</small>
                        <b>{item.horarioPreferencial}</b>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <strong>Nenhum agendamento disponível</strong>
                  <p>
                    Todos os atendimentos já foram organizados ou o filtro não
                    encontrou resultados.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <section className="agenda-panel">
            <div className="panel-head">
              <div>
                <h2>Minha agenda</h2>
                <p>Organização visual dos seus atendimentos</p>
              </div>

              <span className="panel-tag soft-tag">Hoje</span>
            </div>

            <div className="agenda-stats">
              <div className="agenda-stat">
                <small>Preenchidos</small>
                <strong>{resumo.total}</strong>
              </div>

              <div className="agenda-stat">
                <small>Livres</small>
                <strong>{resumo.livres}</strong>
              </div>

              <div className="agenda-stat">
                <small>Turno</small>
                <strong>08h às 17h</strong>
              </div>
            </div>

            <div className="agenda-lista">
              {agenda.map((slot) => (
                <div
                  key={slot.hora}
                  className={`agenda-slot ${slot.agendamento ? "ocupado" : "livre"}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot.hora)}
                >
                  <div className="agenda-hora">
                    <span>{slot.hora}</span>
                  </div>

                  <div className="agenda-conteudo">
                    {slot.agendamento ? (
                      <div className="agenda-card-preenchido">
                        <div className="agenda-card-main">
                          <div className="agenda-pet-avatar">
                            {slot.agendamento.pet.charAt(0)}
                          </div>

                          <div className="agenda-card-text">
                            <strong>{slot.agendamento.pet}</strong>
                            <span>{slot.agendamento.tutor}</span>
                            <p>{slot.agendamento.servico}</p>
                          </div>
                        </div>

                        <div className="agenda-card-side">
                          <small>{slot.agendamento.porte}</small>
                          <button
                            className="agenda-remove-btn"
                            onClick={() => removerDaAgenda(slot.hora)}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="agenda-vazia">
                        <span>Arraste um agendamento para este horário</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Colaborador;