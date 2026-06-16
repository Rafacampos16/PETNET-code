import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import InteractiveCalendar from "../pages/InteractiveCalendar";
import AdminSidebar from "../components/AdminSidebar";

import Pata from "../assets/icons/pata-h.png";

import { userService } from "../services/userService";
import petService from "../services/petService";
import serviceService from "../services/serviceService";
import scheduleService from "../services/scheduleService";

import { enviarEmailConfirmacaoAgendamento } from "../utils/emailNotifications";

import "../styles/agendamentos.css";

const DISPONIBILIDADE_POR_DATA = {
  // Ainda sem rota no backend
};

const DURACOES = [
  {
    value: "THIRTY_MIN",
    label: "30 Minutos",
  },
  {
    value: "FORTY_FIVE_MIN",
    label: "45 Minutos",
  },
  {
    value: "ONE_HOUR",
    label: "1 Hora",
  },
  {
    value: "ONE_HALF_HOUR",
    label: "1 Hora e 30 Minutos",
  },
  {
    value: "TWO_HOURS",
    label: "2 Horas",
  },
  {
    value: "TWO_HALF_HOURS",
    label: "2 Horas e 30 Minutos",
  },
  {
    value: "THREE_HOURS",
    label: "3 Horas",
  },
];

const Agendamentos = () => {
  const [nomeBusca, setNomeBusca] = useState("");
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [buscandoClientes, setBuscandoClientes] = useState(false);
  const [erroBusca, setErroBusca] = useState("");

  const [petsDisponiveis, setPetsDisponiveis] = useState([]);
  const [pet, setPet] = useState("");

  const [servicos, setServicos] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradorCpf, setColaboradorCpf] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [horaInicio, setHoraInicio] = useState("");
  const [duracao, setDuracao] = useState("");
  const [observacao, setObservacao] = useState("");

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agendamentoResumo, setAgendamentoResumo] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [avisoDataHorario, setAvisoDataHorario] = useState(false);

  useEffect(() => {
    serviceService
      .listar()
      .then((data) => {
        setServicos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erro ao carregar serviços:", err);
      });

    userService
      .listUsers()
      .then((res) => {
        const todos = Array.isArray(res.data) ? res.data : [];

        const colab = todos.filter(
          (usuario) =>
            usuario.type === "Colaborador" ||
            usuario.type === "Admin" ||
            usuario.type === "Administrador"
        );

        setColaboradores(colab);
      })
      .catch((err) => {
        console.error("Erro ao carregar colaboradores:", err);
      });
  }, []);

  useEffect(() => {
    const busca = nomeBusca.trim();

    if (busca.length < 1 || clienteSelecionado) {
      setClientesEncontrados([]);
      return;
    }

    const timer = setTimeout(() => {
      buscarClientes(busca);
    }, 300);

    return () => clearTimeout(timer);
  }, [nomeBusca, clienteSelecionado]);

  const limparCPF = (cpf = "") => {
    return String(cpf).replace(/\D/g, "");
  };

  const formatarCPF = (cpf = "") => {
    const cpfLimpo = limparCPF(cpf);

    if (cpfLimpo.length !== 11) {
      return cpf;
    }

    return cpfLimpo.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
  };

  const buscarClientes = async (termo) => {
    setBuscandoClientes(true);
    setErroBusca("");

    try {
      const res = await userService.listUsers();
      const todos = Array.isArray(res.data) ? res.data : [];

      const termoFormatado = termo.toLowerCase().trim();
      const termoCpf = limparCPF(termo);

      const resultados = todos
        .filter(
          (usuario) =>
            usuario.type === "Cliente" ||
            !usuario.type
        )
        .filter((usuario) => {
          const nome = usuario.name?.toLowerCase() || "";
          const cpf = limparCPF(usuario.cpf);

          const nomeComecaComBusca =
            nome.startsWith(termoFormatado);

          const cpfComecaComBusca =
            termoCpf && cpf.startsWith(termoCpf);

          return nomeComecaComBusca || cpfComecaComBusca;
        })
        .sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );

      setClientesEncontrados(resultados.slice(0, 8));
    } catch (err) {
      console.error("Erro na busca:", err);
      setErroBusca("Não foi possível buscar clientes.");
    } finally {
      setBuscandoClientes(false);
    }
  };

  const selecionarCliente = async (cliente) => {
    setClienteSelecionado(cliente);
    setClientesEncontrados([]);
    setNomeBusca(cliente.name);
    setErroBusca("");
    setPet("");
    setPetsDisponiveis([]);

    try {
      const resPets = await petService.listar();

      const todos = Array.isArray(resPets)
        ? resPets
        : resPets?.data || [];

      const petsDoCliente = todos.filter(
        (petEncontrado) =>
          String(petEncontrado.user_cpf) ===
          String(cliente.cpf)
      );

      setPetsDisponiveis(petsDoCliente);
    } catch (err) {
      console.error("Erro ao carregar pets:", err);

      setErroBusca(
        "Não foi possível carregar os pets deste cliente."
      );
    }
  };

  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";

  const statusDia = selectedDateKey
    ? DISPONIBILIDADE_POR_DATA[selectedDateKey] ||
      "disponivel"
    : "";

  const dataPodeAgendar = statusDia === "disponivel";

  const handleHoraInicioChange = (event) => {
    if (!selectedDate) {
      setAvisoDataHorario(true);
      setHoraInicio("");
      return;
    }

    let value = event.target.value.replace(/\D/g, "");

    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}:${value.slice(2)}`;
    }

    setHoraInicio(value);
    setAvisoDataHorario(false);

    setErrors((prev) => ({
      ...prev,
      inicio: false,
    }));

    setSuccessMsg("");
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );

    setErrors((prev) => ({
      ...prev,
      servicos: false,
    }));

    setSuccessMsg("");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setHoraInicio("");
    setAvisoDataHorario(false);

    setErrors((prev) => ({
      ...prev,
      data: false,
      inicio: false,
      duracao: false,
    }));

    setSuccessMsg("");
  };

  const validarHoraInicio = (hora) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (
      !clienteSelecionado ||
      !clienteSelecionado.cpf
    ) {
      newErrors.cliente = true;
    }

    if (!pet) {
      newErrors.pet = true;
    }

    if (!colaboradorCpf) {
      newErrors.colaborador = true;
    }

    if (!selectedDate) {
      newErrors.data = true;
    }

    if (selectedDate && !dataPodeAgendar) {
      newErrors.data = true;
    }

    if (!duracao) {
      newErrors.duracao = true;
    }

    if (selectedServices.length === 0) {
      newErrors.servicos = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSuccessMsg("");
      return;
    }

    if (
      !horaInicio ||
      !validarHoraInicio(horaInicio)
    ) {
      newErrors.inicio = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSuccessMsg("");
      return;
    }

    const [hora, min] = horaInicio
      .split(":")
      .map(Number);

    const dateTime = new Date(selectedDate);

    dateTime.setUTCHours(
      hora + 3,
      min,
      0,
      0
    );

    const petSelecionado = petsDisponiveis.find(
      (petDisponivel) =>
        String(petDisponivel.id) === String(pet)
    );

    const colaborador = colaboradores.find(
      (item) => item.cpf === colaboradorCpf
    );

    const servicosSelecionados = servicos.filter(
      (servico) =>
        selectedServices.includes(servico.id)
    );

    const duracaoLabel =
      DURACOES.find(
        (item) => item.value === duracao
      )?.label || duracao;

    setAgendamentoResumo({
      clienteNome:
        clienteSelecionado?.name || "",

      clienteEmail:
        clienteSelecionado?.email || "",

      cpf:
        clienteSelecionado?.name || "",

      cpfLimpo:
        clienteSelecionado?.cpf || "",

      horaInicio,

      petId: pet,

      petNome:
        petSelecionado?.name || pet,

      colaboradorCpf,

      colaboradorNome:
        colaborador?.name || colaboradorCpf,

      dateTime:
        dateTime.toISOString(),

      dataFormatada: format(
        selectedDate,
        "dd 'de' MMMM 'de' yyyy",
        {
          locale: ptBR,
        }
      ),

      duracao,
      duracaoLabel,
      servicos: servicosSelecionados,
      observacao,
    });

    setShowConfirmModal(true);
  };

  const confirmarAgendamento = async () => {
    setEnviando(true);

    try {
      await scheduleService.criar({
        client_cpf:
          agendamentoResumo.cpfLimpo,

        pet_id:
          Number(agendamentoResumo.petId),

        collaborator_cpf:
          agendamentoResumo.colaboradorCpf,

        date_time:
          agendamentoResumo.dateTime,

        duration:
          agendamentoResumo.duracao,

        status:
          "SCHEDULED",

        observation:
          agendamentoResumo.observacao || "",

        services:
          agendamentoResumo.servicos.map(
            (servico) => servico.id
          ),
      });

      try {
        if (agendamentoResumo.clienteEmail) {
          await enviarEmailConfirmacaoAgendamento(
            agendamentoResumo
          );
        }
      } catch (erroNotificacao) {
        console.error(
          "Agendamento criado, mas houve erro ao enviar notificação:",
          erroNotificacao
        );
      }

      setSuccessMsg(
        "Agendamento realizado com sucesso!"
      );

      setNomeBusca("");
      setClienteSelecionado(null);
      setClientesEncontrados([]);
      setPetsDisponiveis([]);
      setPet("");
      setColaboradorCpf("");
      setSelectedDate(null);
      setHoraInicio("");
      setDuracao("");
      setSelectedServices([]);
      setObservacao("");
      setErrors({});
      setAgendamentoResumo(null);
      setShowConfirmModal(false);
    } catch (err) {
      console.error(
        "Erro ao criar agendamento:",
        err
      );

      alert(
        err.response?.data?.error ||
          "Erro ao criar agendamento."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <AdminSidebar />

      <div className="agendamento-page">
        <div className="agendamento-header">
          <div>
            <span className="agendamento-badge">
              Painel de Agendamentos
            </span>

            <h1 className="topo2">
              <span className="icon">
                <img
                  src={Pata}
                  alt="Pata"
                />
              </span>

              AGENDAMENTO
            </h1>

            <p className="agendamento-subtitle">
              Organize atendimentos com uma agenda visual,
              datas disponíveis e formulário mais
              inteligente.
            </p>
          </div>
        </div>

        <div className="agendamento-grid">
          <div className="form-card">
            <div className="card-head">
              <h2>Novo agendamento</h2>

              <p>
                Preencha os dados para reservar um
                atendimento.
              </p>
            </div>

            <label htmlFor="busca-cliente">
              Buscar cliente
            </label>

            <div className="cliente-busca-wrapper">
              <input
                id="busca-cliente"
                type="text"
                placeholder="Digite o nome ou CPF do cliente"
                value={nomeBusca}
                onChange={(event) => {
                  setNomeBusca(event.target.value);
                  setClienteSelecionado(null);
                  setPetsDisponiveis([]);
                  setPet("");

                  setErrors((prev) => ({
                    ...prev,
                    cliente: false,
                  }));
                }}
                className={
                  errors.cliente
                    ? "input-error"
                    : ""
                }
                autoComplete="off"
              />

              {clientesEncontrados.length > 0 &&
                !clienteSelecionado && (
                  <ul className="clientes-sugestoes">
                    {clientesEncontrados.map(
                      (cliente) => (
                        <li
                          key={cliente.cpf}
                          className="cliente-sugestao-item"
                          onClick={() =>
                            selecionarCliente(cliente)
                          }
                        >
                          <div className="cliente-sugestao-avatar">
                            {cliente.name
                              ?.charAt(0)
                              .toUpperCase() || "C"}
                          </div>

                          <div className="cliente-sugestao-info">
                            <strong>
                              {cliente.name}
                            </strong>

                            {cliente.cpf && (
                              <span>
                                CPF:{" "}
                                {formatarCPF(
                                  cliente.cpf
                                )}
                              </span>
                            )}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                )}
            </div>

            {buscandoClientes && (
              <p className="helper-text">
                Buscando...
              </p>
            )}

            {erroBusca && (
              <p className="helper-text erro-service">
                {erroBusca}
              </p>
            )}

            {nomeBusca.trim().length > 0 &&
              !buscandoClientes &&
              clientesEncontrados.length === 0 &&
              !clienteSelecionado && (
                <p className="helper-text">
                  Nenhum cliente encontrado com esse nome
                  ou CPF.
                </p>
              )}

            {errors.cliente &&
              !clienteSelecionado && (
                <p className="erro-service">
                  Selecione um cliente na lista.
                </p>
              )}

            <label htmlFor="pet">
              Selecione o pet
            </label>

            <select
              id="pet"
              value={pet}
              onChange={(event) => {
                setPet(event.target.value);

                setErrors((prev) => ({
                  ...prev,
                  pet: false,
                }));
              }}
              className={
                errors.pet
                  ? "input-error"
                  : ""
              }
              disabled={!clienteSelecionado}
            >
              <option value="">
                Selecione o nome do pet
              </option>

              {petsDisponiveis.map(
                (petDisponivel) => (
                  <option
                    key={petDisponivel.id}
                    value={petDisponivel.id}
                  >
                    {petDisponivel.name}
                  </option>
                )
              )}
            </select>

            {clienteSelecionado &&
              petsDisponiveis.length === 0 && (
                <p className="helper-text">
                  Nenhum pet encontrado para este cliente.
                </p>
              )}

            {errors.pet && (
              <p className="erro-service">
                Selecione um pet.
              </p>
            )}

            <label htmlFor="colaborador">
              Colaborador responsável
            </label>

            <select
              id="colaborador"
              value={colaboradorCpf}
              onChange={(event) => {
                setColaboradorCpf(event.target.value);

                setErrors((prev) => ({
                  ...prev,
                  colaborador: false,
                }));
              }}
              className={
                errors.colaborador
                  ? "input-error"
                  : ""
              }
            >
              <option value="">
                Selecione o colaborador
              </option>

              {colaboradores.map(
                (colaborador) => (
                  <option
                    key={colaborador.cpf}
                    value={colaborador.cpf}
                  >
                    {colaborador.name}
                  </option>
                )
              )}
            </select>

            {errors.colaborador && (
              <p className="erro-service">
                Selecione um colaborador.
              </p>
            )}

            <label>
              Escolha o(s) serviço(s)
            </label>

            <div
              className={`services-grid ${
                errors.servicos
                  ? "services-error"
                  : ""
              }`}
            >
              {servicos.map((servico) => (
                <button
                  key={servico.id}
                  type="button"
                  className={`service-btn ${
                    selectedServices.includes(
                      servico.id
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    toggleService(servico.id)
                  }
                >
                  {servico.name}
                </button>
              ))}
            </div>

            {errors.servicos && (
              <p className="erro-service">
                Selecione pelo menos um serviço.
              </p>
            )}

            <div className="linhas-dupla">
              <div>
                <label htmlFor="duracao">
                  Duração
                </label>

                <select
                  id="duracao"
                  value={duracao}
                  onChange={(event) => {
                    setDuracao(event.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      duracao: false,
                    }));
                  }}
                  className={
                    errors.duracao
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="">
                    Selecione a duração
                  </option>

                  {DURACOES.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>

                {errors.duracao && (
                  <p className="erro-service">
                    Selecione a duração.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="hora-inicio">
                  Horário de início
                </label>

                <input
                  id="hora-inicio"
                  type="text"
                  placeholder="Ex: 09:00"
                  value={horaInicio}
                  onChange={handleHoraInicioChange}
                  onFocus={() => {
                    if (!selectedDate) {
                      setAvisoDataHorario(true);
                    }
                  }}
                  onClick={() => {
                    if (!selectedDate) {
                      setAvisoDataHorario(true);
                    }
                  }}
                  maxLength={5}
                  className={
                    errors.inicio ||
                    avisoDataHorario
                      ? "input-error"
                      : ""
                  }
                  readOnly={!selectedDate}
                />

                {avisoDataHorario &&
                  !selectedDate && (
                    <p className="aviso-data-horario">
                      Selecione uma data no calendário antes
                      de informar o horário.
                    </p>
                  )}

                {errors.inicio && (
                  <p className="erro-service">
                    Informe um horário válido.
                  </p>
                )}
              </div>
            </div>

            {selectedDate &&
              !dataPodeAgendar && (
                <p className="erro-service">
                  Esta data não está disponível para
                  agendamento.
                </p>
              )}

            <label htmlFor="observacoes">
              Observações
            </label>

            <textarea
              id="observacoes"
              rows="4"
              placeholder="Escreva detalhes importantes do atendimento..."
              value={observacao}
              onChange={(event) =>
                setObservacao(event.target.value)
              }
            />

            {successMsg && (
              <p className="success-msg">
                {successMsg}
              </p>
            )}

            <button
              type="button"
              className="btn-agendar"
              onClick={handleSubmit}
            >
              AGENDAR
            </button>
          </div>

          <div className="calendar-card">
            <div className="card-head">
              <h2>Agenda interativa</h2>

              <p>
                Selecione uma data para realizar o
                agendamento.
              </p>
            </div>

            <div className="calendar-content-layout">
              <div className="calendar-main-box">
                <InteractiveCalendar
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  disponibilidadePorData={
                    DISPONIBILIDADE_POR_DATA
                  }
                />
              </div>
            </div>

            {errors.data && (
              <p className="calendar-error-message">
                Selecione uma data disponível para o
                agendamento.
              </p>
            )}
          </div>
        </div>

        {showConfirmModal &&
          agendamentoResumo && (
            <div className="confirm-modal-overlay">
              <div className="confirm-modal">
                <div className="confirm-modal-header">
                  <h2>
                    Confirmar agendamento
                  </h2>

                  <p>
                    Confira os dados antes de finalizar.
                  </p>
                </div>

                <div className="confirm-summary">
                  <div className="summary-item">
                    <span>Cliente</span>

                    <strong>
                      {agendamentoResumo.cpf}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Pet</span>

                    <strong>
                      {agendamentoResumo.petNome}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Colaborador</span>

                    <strong>
                      {
                        agendamentoResumo.colaboradorNome
                      }
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Data</span>

                    <strong>
                      {
                        agendamentoResumo.dataFormatada
                      }
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Duração</span>

                    <strong>
                      {
                        agendamentoResumo.duracaoLabel
                      }
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>
                      Hora de início
                    </span>

                    <strong>
                      {
                        agendamentoResumo.horaInicio
                      }
                    </strong>
                  </div>

                  <div className="summary-item summary-full">
                    <span>Serviços</span>

                    <div className="summary-tags">
                      {agendamentoResumo.servicos.map(
                        (servico) => (
                          <span
                            key={servico.id}
                            className="summary-tag"
                          >
                            {servico.name}
                          </span>
                        )
                      )}
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
                    onClick={() =>
                      setShowConfirmModal(false)
                    }
                    disabled={enviando}
                  >
                    Voltar e editar
                  </button>

                  <button
                    type="button"
                    className="btn-confirm"
                    onClick={confirmarAgendamento}
                    disabled={enviando}
                  >
                    {enviando
                      ? "Salvando..."
                      : "Confirmar agendamento"}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default Agendamentos;