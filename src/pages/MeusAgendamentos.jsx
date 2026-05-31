import React, { useMemo, useState } from "react";
import "../styles/meusAgendamentos.css";

import AgendaClienteIcon from "../assets/icons/agendaCliente.png";
import PetsIcon from "../assets/icons/paw-cat.png";
import PataIcon from "../assets/icons/pata-h.png";
import ContaIcon from "../assets/icons/conta.png";

const agendamentosMock = [
  {
    id: 1,
    servico: "Banho e Tosa",
    pet: "Luna",
    data: "2026-06-03",
    horario: "14:30",
    status: "CONFIRMADO",
    observacoes: "Pet com sensibilidade na patinha esquerda.",
    endereco: "Av. Cassiano Ricardo, 123 - São José dos Campos",
  },
  {
    id: 2,
    servico: "Consulta Veterinária",
    pet: "Thor",
    data: "2026-06-08",
    horario: "10:00",
    status: "AGENDADO",
    observacoes: "Levar carteira de vacinação.",
    endereco: "Av. Cassiano Ricardo, 123 - São José dos Campos",
  },
  {
    id: 3,
    servico: "Tosa Higiênica",
    pet: "Mel",
    data: "2026-05-20",
    horario: "16:00",
    status: "FINALIZADO",
    observacoes: "Atendimento finalizado com sucesso.",
    endereco: "Av. Cassiano Ricardo, 123 - São José dos Campos",
  },
];

const statusLabels = {
  TODOS: "Todos",
  AGENDADO: "Agendados",
  CONFIRMADO: "Confirmados",
  FINALIZADO: "Finalizados",
  CANCELADO: "Cancelados",
};

const statusText = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Finalizado",
  CANCELADO: "Cancelado",
};

const MeusAgendamentos = () => {
  const [statusSelecionado, setStatusSelecionado] = useState("TODOS");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

  const agendamentosFiltrados = useMemo(() => {
    if (statusSelecionado === "TODOS") {
      return agendamentosMock;
    }

    return agendamentosMock.filter(
      (agendamento) => agendamento.status === statusSelecionado
    );
  }, [statusSelecionado]);

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const getDia = (data) => {
    return data.split("-")[2];
  };

  const getMes = (data) => {
    return new Date(`${data}T00:00:00`).toLocaleString("pt-BR", {
      month: "short",
    });
  };

  const getStatusClass = (status) => {
    return `agenda-status agenda-status-${status.toLowerCase()}`;
  };

  return (
    <section className="meus-agendamentos-page">
      <div className="meus-agendamentos-container">
        <div className="meus-agendamentos-hero">
          <div className="hero-text-area">
            <span className="meus-agendamentos-tag">
              Área do cliente
            </span>

            <h1>Meus Agendamentos</h1>

            <p>
              Veja os próximos cuidados do seu pet, acompanhe horários marcados
              e consulte os detalhes quando precisar.
            </p>
          </div>

          <div className="hero-icon-card">
            <img src={AgendaClienteIcon} alt="Agenda" />
          </div>
        </div>

        <div className="agenda-filter-card">
          <div className="filter-title">
            <img src={PataIcon} alt="" />
            <span>Mostrar:</span>
          </div>

          <div className="agenda-filter-buttons">
            {Object.entries(statusLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={statusSelecionado === value ? "active" : ""}
                onClick={() => {
                  setStatusSelecionado(value);
                  setAgendamentoSelecionado(null);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {agendamentosFiltrados.length === 0 ? (
          <div className="agenda-empty-card">
            <div className="agenda-empty-icon">
              <img src={AgendaClienteIcon} alt="Agenda" />
            </div>

            <h2>Nenhum agendamento encontrado</h2>

            <p>
              Quando um horário for marcado para o seu pet, ele aparecerá aqui
              para você acompanhar com calma.
            </p>
          </div>
        ) : (
          <div className="agenda-cards-grid">
            {agendamentosFiltrados.map((agendamento) => (
              <article key={agendamento.id} className="agenda-client-card">
                <div className="card-top-row">
                  <div className="agenda-client-date">
                    <strong>{getDia(agendamento.data)}</strong>
                    <span>{getMes(agendamento.data)}</span>
                  </div>

                  <span className={getStatusClass(agendamento.status)}>
                    {statusText[agendamento.status]}
                  </span>
                </div>

                <div className="card-service-icon">
                  <img src={PetsIcon} alt="" />
                </div>

                <h2>{agendamento.servico}</h2>

                <div className="agenda-card-info">
                  <div>
                    <span>Pet</span>
                    <strong>{agendamento.pet}</strong>
                  </div>

                  <div>
                    <span>Horário</span>
                    <strong>{agendamento.horario}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="agenda-details-button"
                  onClick={() => setAgendamentoSelecionado(agendamento)}
                >
                  Ver detalhes
                </button>
              </article>
            ))}
          </div>
        )}

        {agendamentoSelecionado && (
          <div className="agenda-modal-overlay">
            <div className="agenda-modal">
              <button
                type="button"
                className="agenda-modal-close"
                onClick={() => setAgendamentoSelecionado(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>

              <div className="agenda-modal-header">
                <div className="agenda-modal-icon">
                  <img src={AgendaClienteIcon} alt="Agenda" />
                </div>

                <span className={getStatusClass(agendamentoSelecionado.status)}>
                  {statusText[agendamentoSelecionado.status]}
                </span>
              </div>

              <h2>{agendamentoSelecionado.servico}</h2>

              <p className="agenda-modal-subtitle">
                Detalhes do agendamento de {agendamentoSelecionado.pet}
              </p>

              <div className="agenda-modal-info">
                <div>
                  <span>Pet</span>
                  <strong>{agendamentoSelecionado.pet}</strong>
                </div>

                <div>
                  <span>Data</span>
                  <strong>{formatarData(agendamentoSelecionado.data)}</strong>
                </div>

                <div>
                  <span>Horário</span>
                  <strong>{agendamentoSelecionado.horario}</strong>
                </div>

                <div>
                  <span>Endereço</span>
                  <strong>{agendamentoSelecionado.endereco}</strong>
                </div>

                <div className="full-info">
                  <span>Observações</span>
                  <strong>
                    {agendamentoSelecionado.observacoes ||
                      "Nenhuma observação cadastrada."}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="agenda-modal-ok"
                onClick={() => setAgendamentoSelecionado(null)}
              >
                Fechar detalhes
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MeusAgendamentos;