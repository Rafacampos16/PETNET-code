import React, { useEffect, useMemo, useState } from "react";
import "../styles/meusAgendamentos.css";

import AgendaClienteIcon from "../assets/icons/agendaCliente.png";
import PetsIcon from "../assets/icons/paw-cat.png";
import PataIcon from "../assets/icons/pata-h.png";

import scheduleService from "../services/scheduleService";

const statusLabels = {
  TODOS: "Todos",
  Agendado: "Agendados",
  Confirmado: "Confirmados",
  Finalizado: "Finalizados",
  Cancelado: "Cancelados",
};

function normalizar(item) {
  const servicosNomes = Array.isArray(item.services)
    ? item.services
        .map((servico) => servico?.name)
        .filter(Boolean)
    : [];

  return {
    ...item,
    petNome: item.pet?.name || "—",
    servicosNomes,
    servico: servicosNomes.join(", ") || "Não informado",
    colaborador: item.collaborator?.name || "—",
  };
}

const MeusAgendamentos = () => {
  const hoje = new Date();

  const inicioMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  ).toISOString();

  const fimMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    0,
    23,
    59,
    59
  ).toISOString();

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [statusSelecionado, setStatusSelecionado] =
    useState("TODOS");

  const [
    agendamentoSelecionado,
    setAgendamentoSelecionado,
  ] = useState(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    scheduleService
      .listar(inicioMes, fimMes)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : [];

        setAgendamentos(data.map(normalizar));
      })
      .catch(() => {
        setErro(
          "Não foi possível carregar os agendamentos."
        );
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const agendamentosFiltrados = useMemo(() => {
    if (statusSelecionado === "TODOS") {
      return agendamentos;
    }

    return agendamentos.filter(
      (agendamento) =>
        agendamento.status === statusSelecionado
    );
  }, [agendamentos, statusSelecionado]);

  const getDia = (dateTime) => {
    return new Date(dateTime).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
      }
    );
  };

  const getMes = (dateTime) => {
    return new Date(dateTime).toLocaleString(
      "pt-BR",
      {
        month: "short",
      }
    );
  };

  const formatarData = (dateTime) => {
    return new Date(dateTime).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const formatarHorario = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    const map = {
      Agendado: "agendado",
      Confirmado: "confirmado",
      Finalizado: "finalizado",
      Cancelado: "cancelado",
    };

    return `agenda-status agenda-status-${
      map[status] || "agendado"
    }`;
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
              Veja os próximos cuidados do seu pet,
              acompanhe horários marcados e consulte os
              detalhes quando precisar.
            </p>
          </div>

          <div className="hero-icon-card">
            <img
              src={AgendaClienteIcon}
              alt="Agenda"
            />
          </div>
        </div>

        <div className="agenda-filter-card">
          <div className="filter-title">
            <img src={PataIcon} alt="" />
            <span>Mostrar:</span>
          </div>

          <div className="agenda-filter-buttons">
            {Object.entries(statusLabels).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    statusSelecionado === value
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setStatusSelecionado(value);
                    setAgendamentoSelecionado(null);
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {carregando ? (
          <div className="agenda-empty-card">
            <div className="agenda-empty-icon">
              <img
                src={AgendaClienteIcon}
                alt="Carregando"
              />
            </div>

            <h2>Carregando agendamentos...</h2>
          </div>
        ) : erro ? (
          <div className="agenda-empty-card">
            <div className="agenda-empty-icon">
              <img
                src={AgendaClienteIcon}
                alt="Erro"
              />
            </div>

            <h2>Algo deu errado</h2>
            <p>{erro}</p>
          </div>
        ) : agendamentosFiltrados.length === 0 ? (
          <div className="agenda-empty-card">
            <div className="agenda-empty-icon">
              <img
                src={AgendaClienteIcon}
                alt="Agenda"
              />
            </div>

            <h2>Nenhum agendamento encontrado</h2>

            <p>
              Quando um horário for marcado para o seu pet,
              ele aparecerá aqui para você acompanhar com
              calma.
            </p>
          </div>
        ) : (
          <div className="agenda-cards-grid">
            {agendamentosFiltrados.map(
              (agendamento) => {
                const servicosVisiveis =
                  agendamento.servicosNomes?.slice(
                    0,
                    2
                  ) || [];

                const quantidadeRestante = Math.max(
                  (agendamento.servicosNomes?.length ||
                    0) - servicosVisiveis.length,
                  0
                );

                return (
                  <article
                    key={agendamento.id}
                    className="agenda-client-card"
                  >
                    <div className="card-top-row">
                      <div className="agenda-client-date">
                        <strong>
                          {getDia(
                            agendamento.date_time
                          )}
                        </strong>

                        <span>
                          {getMes(
                            agendamento.date_time
                          )}
                        </span>
                      </div>

                      <span
                        className={getStatusClass(
                          agendamento.status
                        )}
                      >
                        {agendamento.status}
                      </span>
                    </div>

                    <div className="card-service-icon">
                      <img src={PetsIcon} alt="" />
                    </div>

                    <div className="agenda-card-services">
                      <span className="agenda-card-services-title">
                        Serviços
                      </span>

                      <div className="agenda-service-tags">
                        {servicosVisiveis.length > 0 ? (
                          servicosVisiveis.map(
                            (servico, index) => (
                              <span
                                key={`${agendamento.id}-servico-${index}`}
                                className="agenda-service-chip"
                                title={servico}
                              >
                                {servico}
                              </span>
                            )
                          )
                        ) : (
                          <span className="agenda-service-chip">
                            Não informado
                          </span>
                        )}

                        {quantidadeRestante > 0 && (
                          <span className="agenda-service-chip agenda-service-chip-more">
                            +{quantidadeRestante}{" "}
                            {quantidadeRestante === 1
                              ? "serviço"
                              : "serviços"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="agenda-card-info">
                      <div>
                        <span>Pet</span>

                        <strong>
                          {agendamento.petNome}
                        </strong>
                      </div>

                      <div>
                        <span>Horário</span>

                        <strong>
                          {formatarHorario(
                            agendamento.date_time
                          )}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="agenda-details-button"
                      onClick={() =>
                        setAgendamentoSelecionado(
                          agendamento
                        )
                      }
                    >
                      Ver detalhes
                    </button>
                  </article>
                );
              }
            )}
          </div>
        )}

        {agendamentoSelecionado && (
          <div
            className="agenda-modal-overlay"
            onClick={() =>
              setAgendamentoSelecionado(null)
            }
          >
            <div
              className="agenda-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                className="agenda-modal-close"
                onClick={() =>
                  setAgendamentoSelecionado(null)
                }
                aria-label="Fechar detalhes"
              >
                ×
              </button>

              <div className="agenda-modal-header">
                <div className="agenda-modal-icon">
                  <img
                    src={AgendaClienteIcon}
                    alt="Agenda"
                  />
                </div>

                <span
                  className={getStatusClass(
                    agendamentoSelecionado.status
                  )}
                >
                  {agendamentoSelecionado.status}
                </span>
              </div>

              <h2>Serviços do agendamento</h2>

              <div className="agenda-modal-services">
                {agendamentoSelecionado
                  .servicosNomes?.length > 0 ? (
                  agendamentoSelecionado.servicosNomes.map(
                    (servico, index) => (
                      <span
                        key={`${agendamentoSelecionado.id}-modal-servico-${index}`}
                        className="agenda-modal-service-chip"
                      >
                        {servico}
                      </span>
                    )
                  )
                ) : (
                  <span className="agenda-modal-service-chip">
                    Não informado
                  </span>
                )}
              </div>

              <p className="agenda-modal-subtitle">
                Detalhes do agendamento de{" "}
                {agendamentoSelecionado.petNome}
              </p>

              <div className="agenda-modal-info">
                <div>
                  <span>Pet</span>

                  <strong>
                    {agendamentoSelecionado.petNome}
                  </strong>
                </div>

                <div>
                  <span>Data</span>

                  <strong>
                    {formatarData(
                      agendamentoSelecionado.date_time
                    )}
                  </strong>
                </div>

                <div>
                  <span>Horário</span>

                  <strong>
                    {formatarHorario(
                      agendamentoSelecionado.date_time
                    )}
                  </strong>
                </div>

                <div>
                  <span>Duração</span>

                  <strong>
                    {agendamentoSelecionado.duration ||
                      "Não informada"}
                  </strong>
                </div>

                <div>
                  <span>Colaborador</span>

                  <strong>
                    {
                      agendamentoSelecionado.colaborador
                    }
                  </strong>
                </div>

                <div className="full-info">
                  <span>Observações</span>

                  <strong>
                    {agendamentoSelecionado.observation ||
                      "Nenhuma observação cadastrada."}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="agenda-modal-ok"
                onClick={() =>
                  setAgendamentoSelecionado(null)
                }
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