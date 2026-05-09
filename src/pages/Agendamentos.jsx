import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import InteractiveCalendar from "../pages/InteractiveCalendar";
import "../styles/agendamentos.css";
import Pata from "../assets/icons/pata-h.png";

const SERVICOS = [
  "Banho",
  "Banho terapêutico",
  "Tosa Higiênica",
  "Tosa (máq. ou tesoura)",
  "Tosa da raça",
  "Corte de unhas",
  "Higiene dos ouvidos",
  "Escovação dental",
  "Cronograma Capilar",
  "Hidratação Pelagem",
  "Hidratação Pele",
  "Teste de porosidade"
];

const PETS_POR_CLIENTE = {
  "123.456.789-00": ["Rex", "Mel"],
  "987.654.321-00": ["Thor"],
  "111.222.333-44": ["Luna", "Bob"]
};

/*
  Status usados no calendário:
  bloqueada = Data indisponível
  semHorarios = Dia sem horários
  disponivel = Horários disponíveis

  Exemplo usando maio e junho de 2026,
  que seriam o mês atual e o mês seguinte.
*/

const DISPONIBILIDADE_POR_DATA = {
  "2026-05-09": "disponivel",
  "2026-05-10": "bloqueada",
  "2026-05-11": "disponivel",
  "2026-05-12": "semHorarios",
  "2026-05-13": "disponivel",
  "2026-05-14": "bloqueada",
  "2026-05-15": "disponivel",
  "2026-05-18": "semHorarios",
  "2026-05-20": "disponivel",
  "2026-05-22": "disponivel",
  "2026-05-25": "bloqueada",
  "2026-05-28": "disponivel",

  "2026-06-02": "disponivel",
  "2026-06-04": "semHorarios",
  "2026-06-06": "disponivel",
  "2026-06-10": "bloqueada",
  "2026-06-12": "disponivel",
  "2026-06-16": "disponivel",
  "2026-06-18": "semHorarios",
  "2026-06-23": "disponivel",
  "2026-06-27": "bloqueada"
};

const Agendamentos = () => {
  const [cpf, setCpf] = useState("");
  const [pet, setPet] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [horaInicio, setHoraInicio] = useState("");
  const [duracao, setDuracao] = useState("");
  const [observacao, setObservacao] = useState("");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agendamentoResumo, setAgendamentoResumo] = useState(null);

  const petsDisponiveis = useMemo(() => {
    return PETS_POR_CLIENTE[cpf] || [];
  }, [cpf]);

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const statusDia = selectedDateKey
    ? DISPONIBILIDADE_POR_DATA[selectedDateKey] || "disponivel"
    : "";

  const dataPodeAgendar = statusDia === "disponivel";

  const getStatusDiaTexto = () => {
    if (!selectedDate) {
      return "Selecione uma data no calendário para ver a disponibilidade.";
    }

    if (statusDia === "bloqueada") {
      return "Esta data está bloqueada para agendamento.";
    }

    if (statusDia === "semHorarios") {
      return "Sem vagas disponíveis no momento.";
    }

    return "Dia liberado para novos agendamentos.";
  };

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

  const handleHoraInicioChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}:${value.slice(2)}`;
    }

    setHoraInicio(value);
    setErrors((prev) => ({ ...prev, inicio: false }));
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
    setDuracao("");
    setErrors((prev) => ({
      ...prev,
      data: false,
      inicio: false,
      duracao: false
    }));
    setSuccessMsg("");
  };

  const validarHoraInicio = (hora) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(hora);
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!cpf || cpf.length < 14) newErrors.cliente = true;
    if (!pet) newErrors.pet = true;
    if (!selectedDate) newErrors.data = true;
    if (selectedDate && !dataPodeAgendar) newErrors.data = true;

    if (!horaInicio || !validarHoraInicio(horaInicio)) {
      newErrors.inicio = true;
    }

    if (!duracao || Number(duracao) <= 0) {
      newErrors.duracao = true;
    }

    if (selectedServices.length === 0) newErrors.servicos = true;

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
      duracao,
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
    setDuracao("");
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
            Organize atendimentos com uma agenda visual, datas disponíveis e
            formulário mais inteligente.
          </p>
        </div>
      </div>

      <div className="agendamento-grid">
        <div className="form-card">
          <div className="card-head">
            <h2>Novo agendamento</h2>
            <p>Preencha os dados para reservar um atendimento.</p>
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

          <label>Escolha o(s) serviços</label>
          <div
            className={`services-grid ${
              errors.servicos ? "services-error" : ""
            }`}
          >
            {SERVICOS.map((service) => (
              <button
                key={service}
                type="button"
                className={`service-btn ${
                  selectedServices.includes(service) ? "active" : ""
                }`}
                onClick={() => toggleService(service)}
              >
                {service}
              </button>
            ))}
          </div>

          {errors.servicos && (
            <p className="erro-service">Selecione pelo menos um serviço.</p>
          )}

          <div className="linhas-dupla">
            <div>
              <label>Horário de início </label>
              <input
                type="text"
                placeholder="Horário de início"
                value={horaInicio}
                onChange={handleHoraInicioChange}
                maxLength="5"
                className={errors.inicio ? "input-error" : ""}
                disabled={!selectedDate || !dataPodeAgendar}
              />
            </div>

            <div>
              <label>Duração (minutos) </label>
              <input
                type="number"
                placeholder="Digite a duração"
                value={duracao}
                onChange={(e) => {
                  setDuracao(e.target.value);
                  setErrors((prev) => ({ ...prev, duracao: false }));
                }}
                className={errors.duracao ? "input-error" : ""}
                min="1"
                disabled={!selectedDate || !dataPodeAgendar}
              />
            </div>
          </div>

          {selectedDate && !dataPodeAgendar && (
            <p className="erro-service">
              Esta data não está disponível para agendamento.
            </p>
          )}

          <label>Observações</label>
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
                disponibilidadePorData={DISPONIBILIDADE_POR_DATA}
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
                      <strong>Disponibilidade</strong>

                      <p
                        className={
                          dataPodeAgendar ? "dia-disponivel" : "sem-horarios"
                        }
                      >
                        {getStatusDiaTexto()}
                      </p>
                    </div>
                  </>
                ) : (
                  <p>
                    Selecione uma data no calendário para ver a disponibilidade.
                  </p>
                )}
              </div>

              <div className="legend legend-modern">
                <div className="legend-card">
                  <span className="leg invalid"></span>
                  <div>
                    <strong>Data indisponível</strong>
                    <p>Datas bloqueadas para agendamento</p>
                  </div>
                </div>

                <div className="legend-card">
                  <span className="leg full"></span>
                  <div>
                    <strong>Dia sem horários</strong>
                    <p>Sem vagas disponíveis no momento</p>
                  </div>
                </div>

                <div className="legend-card">
                  <span className="leg available"></span>
                  <div>
                    <strong>Horários disponíveis</strong>
                    <p>
                      Dia liberado para novos agendamentos para esse mês e mês
                      seguinte
                    </p>
                  </div>
                </div>

                <div className="legend-card">
                  <span className="leg selected"></span>
                  <div>
                    <strong>Data selecionada</strong>
                    <p>Dia que está sendo visualizado</p>
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
                <span>Horário de início</span>
                <strong>{agendamentoResumo.horaInicio}</strong>
              </div>

              <div className="summary-item">
                <span>Duração</span>
                <strong>{agendamentoResumo.duracao} minutos</strong>
              </div>

              <div className="summary-item summary-full">
                <span>Serviços</span>
                <div className="summary-tags">
                  {agendamentoResumo.servicos.map((servico) => (
                    <span key={servico} className="summary-tag">
                      {servico}
                    </span>
                  ))}
                </div>
              </div>

              <div className="summary-item summary-full">
                <span>Observações</span>
                <strong>
                  {agendamentoResumo.observacao?.trim()
                    ? agendamentoResumo.observacao
                    : "Nenhuma observação informada"}
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