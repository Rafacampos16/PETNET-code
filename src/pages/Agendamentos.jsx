import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import InteractiveCalendar from "../pages/InteractiveCalendar";
import "../styles/agendamentos.css";
import Pata from "../assets/icons/pata-h.png";

const SERVICOS = [
  "Banho",
  "Banho terapeutico",
  "Tosa Higienica",
  "Tosa (maq. ou tesoura)",
  "Tosa da raca",
  "Corte de unhas",
  "Higiene dos ouvidos",
  "Escovacao dental",
  "Cronograma Capilar",
  "Hidratacao Pelagem",
  "Hidratacao Pele",
  "Teste de porosidade"
];

const PETS_POR_CLIENTE = {
  "123.456.789-00": ["Rex", "Mel"],
  "987.654.321-00": ["Thor"],
  "111.222.333-44": ["Luna", "Bob"]
};

const HORARIOS_POR_DATA = {
  "2026-03-31": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "2026-04-09": ["08:30", "09:30", "13:00", "16:00"],
  "2026-04-15": ["08:30", "09:30", "13:00", "16:00"],
  "2026-04-06": ["08:30", "09:30", "13:00", "16:00"],
  "2026-04-07": ["08:30", "09:30", "13:00", "16:00"],
  "2026-04-08": ["08:30", "09:30", "13:00", "16:00"],
  "2026-04-10": ["10:00", "11:30", "15:30"],
  "2026-04-20": [],
  "2026-04-03": [],
  "2026-04-30": [],
  "2026-04-01": [],
  "2026-04-02": [],
  "2026-04-14": [],
  "2026-04-16": [],
  "2026-04-22": ["09:00", "12:00", "13:30", "17:00"]
};

const Agendamentos = () => {
  const [cpf, setCpf] = useState("");
  const [pet, setPet] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [observacao, setObservacao] = useState("");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agendamentoResumo, setAgendamentoResumo] = useState(null);

  const petsDisponiveis = useMemo(() => {
    return PETS_POR_CLIENTE[cpf] || [];
  }, [cpf]);

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const horariosDisponiveis = selectedDateKey
    ? HORARIOS_POR_DATA[selectedDateKey] || []
    : [];

  const horariosFimDisponiveis = horaInicio
    ? horariosDisponiveis.filter((hora) => hora > horaInicio)
    : horariosDisponiveis;

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setCpf(value);
    setPet("");
    setErrors((prev) => ({ ...prev, cliente: false, pet: false }));
    setSuccessMsg("");
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );

    setErrors((prev) => ({ ...prev, servicos: false }));
    setSuccessMsg("");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setHoraInicio("");
    setHoraFim("");
    setErrors((prev) => ({ ...prev, data: false, inicio: false, fim: false }));
    setSuccessMsg("");
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!cpf || cpf.length < 14) newErrors.cliente = true;
    if (!pet) newErrors.pet = true;
    if (!selectedDate) newErrors.data = true;
    if (!horaInicio) newErrors.inicio = true;
    if (!horaFim) newErrors.fim = true;
    if (selectedServices.length === 0) newErrors.servicos = true;

    if (horaInicio && horaFim && horaFim <= horaInicio) {
      newErrors.fim = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSuccessMsg("");
      return;
    }

    const resumo = {
      cpf,
      pet,
      data: selectedDate,
      dataFormatada: format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR
      }),
      horaInicio,
      horaFim,
      servicos: selectedServices,
      observacao
    };

    setAgendamentoResumo(resumo);
    setShowConfirmModal(true);
  };

  const confirmarAgendamento = () => {
    console.log("Agendamento confirmado:", agendamentoResumo);

    setSuccessMsg("Agendamento realizado com sucesso!");
    setCpf("");
    setPet("");
    setSelectedDate(null);
    setHoraInicio("");
    setHoraFim("");
    setSelectedServices([]);
    setObservacao("");
    setErrors({});
    setAgendamentoResumo(null);
    setShowConfirmModal(false);
  };

  return (
    <div className="agendamento-page">
      <div className="agendamento-header">
        <div>
          <span className="agendamento-badge">Painel de Agendamentos</span>
          <h1 className="topo2">
            <span className="icon">
              <img src={Pata} alt="pata" />
            </span>
            AGENDAMENTO
          </h1>
          <p className="agendamento-subtitle">
            Organize atendimentos com uma agenda visual, horarios disponiveis e
            formulario mais inteligente.
          </p>
        </div>
      </div>

      <div className="agendamento-grid">
        <div className="form-card">
          <div className="card-head">
            <h2>Novo agendamento</h2>
            <p>Preencha os dados para reservar um horario.</p>
          </div>

          <label>Selecione o cliente</label>
          <input
            type="text"
            placeholder="Digite o CPF"
            value={cpf}
            onChange={handleCpfChange}
            maxLength="14"
            className={errors.cliente ? "input-error" : ""}
          />

          <label>Selecione o pet</label>
          <select
            value={pet}
            onChange={(e) => {
              setPet(e.target.value);
              setErrors((prev) => ({ ...prev, pet: false }));
            }}
            className={errors.pet ? "input-error" : ""}
          >
            <option value="">Selecione o nome do pet</option>
            {petsDisponiveis.map((petNome) => (
              <option key={petNome} value={petNome}>
                {petNome}
              </option>
            ))}
          </select>

          {cpf && petsDisponiveis.length === 0 && (
            <p className="helper-text">
              Nenhum pet encontrado para este CPF.
            </p>
          )}

          <label>Escolha o(s) servicos</label>
          <div className={`services-grid ${errors.servicos ? "services-error" : ""}`}>
            {SERVICOS.map((service) => (
              <button
                key={service}
                type="button"
                className={`service-btn ${selectedServices.includes(service) ? "active" : ""
                  }`}
                onClick={() => toggleService(service)}
              >
                {service}
              </button>
            ))}
          </div>

          {errors.servicos && (
            <p className="erro-service">Selecione pelo menos um servico.</p>
          )}

          <div className="linhas-dupla">
            <div>
              <label>Horario de inicio</label>
              <select
                value={horaInicio}
                onChange={(e) => {
                  setHoraInicio(e.target.value);
                  setHoraFim("");
                  setErrors((prev) => ({ ...prev, inicio: false }));
                }}
                className={errors.inicio ? "input-error" : ""}
                disabled={!selectedDate || horariosDisponiveis.length === 0}
              >
                <option value="">Selecione</option>
                {horariosDisponiveis.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Horario de termino</label>
              <select
                value={horaFim}
                onChange={(e) => {
                  setHoraFim(e.target.value);
                  setErrors((prev) => ({ ...prev, fim: false }));
                }}
                className={errors.fim ? "input-error" : ""}
                disabled={!horaInicio}
              >
                <option value="">Selecione</option>
                {horariosFimDisponiveis.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label>Observacoes</label>
          <textarea
            rows="4"
            placeholder="Escreva detalhes importantes do atendimento..."
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          {successMsg && <p className="success-msg">{successMsg}</p>}

          <button className="btn-agendar" onClick={handleSubmit}>
            AGENDAR
          </button>
        </div>

        <div className="calendar-card">
          <div className="card-head">
            <h2>Agenda interativa</h2>
            <p>Selecione a data e visualize a disponibilidade.</p>
          </div>

          <div className="calendar-content-layout">
            <div className="calendar-main-box">
              <InteractiveCalendar
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
                horariosPorData={HORARIOS_POR_DATA}
              />
            </div>

            <div className="calendar-side-info">
              <div className="selected-day-box">
                <h3>Resumo do dia</h3>

                {selectedDate ? (
                  <>
                    <p>
                      <strong>Data:</strong>{" "}
                      {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR
                      })}
                    </p>

                    <div className="horarios-box">
                      <strong>Horarios disponiveis</strong>

                      <div className="horarios-chips">
                        {horariosDisponiveis.length > 0 ? (
                          horariosDisponiveis.map((hora) => (
                            <span key={hora} className="horario-chip">
                              {hora}
                            </span>
                          ))
                        ) : (
                          <span className="sem-horarios">
                            Nenhum horario disponivel
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Selecione uma data no calendario para ver os horarios.</p>
                )}
              </div>

              <div className="legend legend-modern">
                <div className="legend-card">
                  <span className="leg invalid"></span>
                  <div>
                    <strong>Data indisponivel</strong>
                    <p>Datas bloqueadas para agendamento</p>
                  </div>
                </div>

                <div className="legend-card">
                  <span className="leg full"></span>
                  <div>
                    <strong>Dia sem horarios</strong>
                    <p>Sem vagas disponiveis no momento</p>
                  </div>
                </div>

                <div className="legend-card">
                  <span className="leg available"></span>
                  <div>
                    <strong>Horarios disponiveis</strong>
                    <p>Dia liberado para novos agendamentos</p>
                  </div>
                </div>

                <div className="legend-card">
                  <span className="leg selected"></span>
                  <div>
                    <strong>Data selecionada</strong>
                    <p>Dia que esta sendo visualizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && agendamentoResumo && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-modal-header">
              <h2>Confirmar agendamento</h2>
              <p>Confira os dados antes de finalizar.</p>
            </div>

            <div className="confirm-summary">
              <div className="summary-item">
                <span>Cliente</span>
                <strong>{agendamentoResumo.cpf}</strong>
              </div>

              <div className="summary-item">
                <span>Pet</span>
                <strong>{agendamentoResumo.pet}</strong>
              </div>

              <div className="summary-item">
                <span>Data</span>
                <strong>{agendamentoResumo.dataFormatada}</strong>
              </div>

              <div className="summary-item">
                <span>Horario</span>
                <strong>
                  {agendamentoResumo.horaInicio} ate {agendamentoResumo.horaFim}
                </strong>
              </div>

              <div className="summary-item summary-full">
                <span>Servicos</span>
                <div className="summary-tags">
                  {agendamentoResumo.servicos.map((servico) => (
                    <span key={servico} className="summary-tag">
                      {servico}
                    </span>
                  ))}
                </div>
              </div>

              <div className="summary-item summary-full">
                <span>Observacoes</span>
                <strong>
                  {agendamentoResumo.observacao?.trim()
                    ? agendamentoResumo.observacao
                    : "Nenhuma observacao informada"}
                </strong>
              </div>
            </div>

            <div className="confirm-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Voltar e editar
              </button>

              <button
                type="button"
                className="btn-confirm"
                onClick={confirmarAgendamento}
              >
                Confirmar agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamentos;