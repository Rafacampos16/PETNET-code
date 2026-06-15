import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import InteractiveCalendar from "../pages/InteractiveCalendar";
import "../styles/agendamentos.css";
import Pata from "../assets/icons/pata-h.png";
import { userService } from "../services/userService";
import AdminSidebar from "../components/AdminSidebar";
import petService from "../services/petService";
import serviceService from "../services/serviceService";
import scheduleService from "../services/scheduleService";
import { enviarEmailConfirmacaoAgendamento } from "../utils/emailNotifications";
import { criarNotificacaoConfirmacaoAgendamento } from "../utils/notificacoesLocal";

const DISPONIBILIDADE_POR_DATA = {
  //ainda sem rota no backend
};

const DURACOES = [
  { value: "THIRTY_MIN", label: "30 Minutos" },
  { value: "FORTY_FIVE_MIN", label: "45 Minutos" },
  { value: "ONE_HOUR", label: "1 Hora" },
  { value: "ONE_HALF_HOUR", label: "1 Hora e 30 Minutos" },
  { value: "TWO_HOURS", label: "2 Horas" },
  { value: "TWO_HALF_HOURS", label: "2 Horas e 30 Minutos" },
  { value: "THREE_HOURS", label: "3 Horas" },
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
    serviceService.listar()
      .then((data) => setServicos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar serviços:", err));

    userService.listUsers()
      .then((res) => {
        const todos = Array.isArray(res.data) ? res.data : [];
        const colab = todos.filter(
          (u) => u.type === "Colaborador" || u.type === "Admin" || u.type === "Administrador"
        );
        setColaboradores(colab);
      })
      .catch((err) => console.error("Erro ao carregar colaboradores:", err));
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

    if (cpfLimpo.length !== 11) return cpf;

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
        .filter((u) => u.type === "Cliente" || !u.type)
        .filter((u) => {
          const nome = u.name?.toLowerCase() || "";
          const cpf = limparCPF(u.cpf);

          const nomeComecaComBusca = nome.startsWith(termoFormatado);
          const cpfComecaComBusca = termoCpf && cpf.startsWith(termoCpf);

          return nomeComecaComBusca || cpfComecaComBusca;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

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
      const todos = Array.isArray(resPets) ? resPets : resPets?.data || [];
      const petsDoCliente = todos.filter(
        (p) => String(p.user_cpf) === String(cliente.cpf)
      );
      setPetsDisponiveis(petsDoCliente);
    } catch (err) {
      console.error("Erro ao carregar pets:", err);
      setErroBusca("Não foi possível carregar os pets deste cliente.");
    }
  };

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const statusDia = selectedDateKey
    ? DISPONIBILIDADE_POR_DATA[selectedDateKey] || "disponivel"
    : "";
  const dataPodeAgendar = statusDia === "disponivel";

  const getStatusDiaTexto = () => {
    if (!selectedDate) return "Selecione uma data no calendário para ver a disponibilidade.";
    if (statusDia === "bloqueada") return "Esta data está bloqueada para agendamento.";
    if (statusDia === "semHorarios") return "Sem vagas disponíveis no momento.";
    return "Dia liberado para novos agendamentos.";
  };

  const handleHoraInicioChange = (e) => {
    if (!selectedDate) {
      setAvisoDataHorario(true);
      setHoraInicio("");
      return;
    }

    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) value = `${value.slice(0, 2)}:${value.slice(2)}`;

    setHoraInicio(value);
    setAvisoDataHorario(false);
    setErrors((prev) => ({ ...prev, inicio: false }));
    setSuccessMsg("");
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
    setErrors((prev) => ({ ...prev, servicos: false }));
    setSuccessMsg("");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setHoraInicio("");
    setAvisoDataHorario(false);
    setErrors((prev) => ({ ...prev, data: false, inicio: false, duracao: false }));
    setSuccessMsg("");
  };

  const validarHoraInicio = (hora) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);

  const handleSubmit = () => {
    const newErrors = {};

    if (!clienteSelecionado || !clienteSelecionado.cpf) newErrors.cliente = true;
    if (!pet) newErrors.pet = true;
    if (!colaboradorCpf) newErrors.colaborador = true;
    if (!selectedDate) newErrors.data = true;
    if (selectedDate && !dataPodeAgendar) newErrors.data = true;
    if (!duracao) newErrors.duracao = true;
    if (selectedServices.length === 0) newErrors.servicos = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) { setSuccessMsg(""); return; }

    if (!horaInicio || !validarHoraInicio(horaInicio)) newErrors.inicio = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) { setSuccessMsg(""); return; }

    const [hora, min] = horaInicio.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setUTCHours(hora + 3, min, 0, 0);

    const petSelecionado = petsDisponiveis.find((p) => String(p.id) === String(pet));
    const colaborador = colaboradores.find((c) => c.cpf === colaboradorCpf);
    const servicosSelecionados = servicos.filter((s) =>
      selectedServices.includes(s.id)
    );
    const duracaoLabel = DURACOES.find((d) => d.value === duracao)?.label || duracao;

    setAgendamentoResumo({
      clienteNome: clienteSelecionado?.name || "",
      clienteEmail: clienteSelecionado?.email || "",
      cpf: clienteSelecionado?.name || "",
      cpfLimpo: clienteSelecionado?.cpf || "",
      horaInicio,
      petId: pet,
      petNome: petSelecionado?.name || pet,
      colaboradorCpf,
      colaboradorNome: colaborador?.name || colaboradorCpf,
      dateTime: dateTime.toISOString(),
      dataFormatada: format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
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
        client_cpf: agendamentoResumo.cpfLimpo,
        pet_id: Number(agendamentoResumo.petId),
        collaborator_cpf: agendamentoResumo.colaboradorCpf,
        date_time: agendamentoResumo.dateTime,
        duration: agendamentoResumo.duracao,
        status: "SCHEDULED",
        observation: agendamentoResumo.observacao || "",
        services: agendamentoResumo.servicos.map((s) => s.id),
      });

      try {
        if (agendamentoResumo.clienteEmail) {
          await enviarEmailConfirmacaoAgendamento(agendamentoResumo);
        }

        // criarNotificacaoConfirmacaoAgendamento(agendamentoResumo);
      } catch (erroNotificacao) {
        console.error(
          "Agendamento criado, mas houve erro ao enviar notificação:",
          erroNotificacao
        );
      }

      setSuccessMsg("Agendamento realizado com sucesso!");
      setNomeBusca("");
      setClienteSelecionado(null);
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
      console.error("Erro ao criar agendamento:", err);
      alert(err.response?.data?.error || "Erro ao criar agendamento.");
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

            <label>Buscar cliente</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Digite o nome ou CPF do cliente"
                value={nomeBusca}
                onChange={(e) => {
                  setNomeBusca(e.target.value);
                  setClienteSelecionado(null);
                  setPetsDisponiveis([]);
                  setPet("");
                  setErrors((prev) => ({ ...prev, cliente: false }));
                }}
                className={errors.cliente ? "input-error" : ""}
                autoComplete="off"
              />

              {clientesEncontrados.length > 0 && !clienteSelecionado && (
                <ul className="clientes-sugestoes">
                  {clientesEncontrados.map((cliente) => (
                    <li
                      key={cliente.cpf}
                      className="cliente-sugestao-item"
                      onClick={() => selecionarCliente(cliente)}
                    >
                      <div className="cliente-sugestao-avatar">
                        {cliente.name?.charAt(0).toUpperCase() || "C"}
                      </div>

                      <div className="cliente-sugestao-info">
                        <strong>{cliente.name}</strong>

                        {cliente.cpf && (
                          <span>CPF: {formatarCPF(cliente.cpf)}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

            </div>

            {buscandoClientes && <p className="helper-text">Buscando...</p>}
            {erroBusca && <p className="helper-text erro-service">{erroBusca}</p>}

            {nomeBusca.trim().length > 0 &&
              !buscandoClientes &&
              clientesEncontrados.length === 0 &&
              !clienteSelecionado && (
                <p className="helper-text">
                  Nenhum cliente encontrado com esse nome ou CPF.
                </p>
              )}

            {errors.cliente && !clienteSelecionado && (
              <p className="erro-service">Selecione um cliente na lista.</p>
            )}

            <label>Selecione o pet</label>
            <select
              value={pet}
              onChange={(e) => {
                setPet(e.target.value);
                setErrors((prev) => ({ ...prev, pet: false }));
              }}
              className={errors.pet ? "input-error" : ""}
              disabled={!clienteSelecionado}
            >
              <option value="">Selecione o nome do pet</option>
              {petsDisponiveis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {clienteSelecionado && petsDisponiveis.length === 0 && (
              <p className="helper-text">Nenhum pet encontrado para este cliente.</p>
            )}
            {errors.pet && <p className="erro-service">Selecione um pet.</p>}

            <label>Colaborador responsável</label>
            <select
              value={colaboradorCpf}
              onChange={(e) => {
                setColaboradorCpf(e.target.value);
                setErrors((prev) => ({ ...prev, colaborador: false }));
              }}
              className={errors.colaborador ? "input-error" : ""}
            >
              <option value="">Selecione o colaborador</option>
              {colaboradores.map((c) => (
                <option key={c.cpf} value={c.cpf}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.colaborador && <p className="erro-service">Selecione um colaborador.</p>}

            <label>Escolha o(s) serviço(s)</label>
            <div className={`services-grid ${errors.servicos ? "services-error" : ""}`}>
              {servicos.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`service-btn ${selectedServices.includes(service.id) ? "active" : ""}`}
                  onClick={() => toggleService(service.id)}
                >
                  {service.name}
                </button>
              ))}
            </div>
            {errors.servicos && (
              <p className="erro-service">Selecione pelo menos um serviço.</p>
            )}

            <div className="linhas-dupla">
              <div>
                <label>Duração</label>
                <select
                  value={duracao}
                  onChange={(e) => {
                    setDuracao(e.target.value);
                    setErrors((prev) => ({ ...prev, duracao: false }));
                  }}
                  className={errors.duracao ? "input-error" : ""}
                >
                  <option value="">Selecione a duração</option>
                  {DURACOES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                {errors.duracao && <p className="erro-service">Selecione a duração.</p>}
              </div>

              <div>
                <label>Horário de início</label>
                <input
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
                  className={errors.inicio || avisoDataHorario ? "input-error" : ""}
                  readOnly={!selectedDate}
                />

                {avisoDataHorario && !selectedDate && (
                  <p className="aviso-data-horario">
                    Selecione uma data no calendário antes de informar o horário.
                  </p>
                )}

                {errors.inicio && <p className="erro-service">Informe um horário válido.</p>}
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
                        {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      <div className="horarios-box">
                        <strong>Disponibilidade</strong>
                        <p className={dataPodeAgendar ? "dia-disponivel" : "sem-horarios"}>
                          {getStatusDiaTexto()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p>Selecione uma data no calendário para ver a disponibilidade.</p>
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
                      <p>Dia liberado para novos agendamentos</p>
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
                  <strong>{agendamentoResumo.petNome}</strong>
                </div>
                <div className="summary-item">
                  <span>Colaborador</span>
                  <strong>{agendamentoResumo.colaboradorNome}</strong>
                </div>
                <div className="summary-item">
                  <span>Data</span>
                  <strong>{agendamentoResumo.dataFormatada}</strong>
                </div>
                <div className="summary-item">
                  <span>Duração</span>
                  <strong>{agendamentoResumo.duracaoLabel}</strong>
                </div>
                <div className="summary-item">
                  <span>Hora de início</span>
                  <strong>{agendamentoResumo.horaInicio}</strong>
                </div>

                <div className="summary-item summary-full">
                  <span>Serviços</span>
                  <div className="summary-tags">
                    {agendamentoResumo.servicos.map((s) => (
                      <span key={s.id} className="summary-tag">{s.name}</span>
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
                  {enviando ? "Salvando..." : "Confirmar agendamento"}
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