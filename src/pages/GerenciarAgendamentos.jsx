import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  LoaderCircle,
  PawPrint,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Scissors,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import scheduleService from "../services/scheduleService";
import serviceService from "../services/serviceService";
import petService from "../services/petService";
import { userService } from "../services/userService";

import Pata from "../assets/icons/pata-h.png";
import "../styles/gerenciarAgendamentos.css";

const DATA_INICIAL_LISTAGEM = "2000-01-01";
const DATA_FINAL_LISTAGEM = "2100-12-31";
const ITENS_POR_PAGINA = 9;

const DURACOES = [
  { value: "THIRTY_MIN", label: "30 minutos" },
  { value: "FORTY_FIVE_MIN", label: "45 minutos" },
  { value: "ONE_HOUR", label: "1 hora" },
  { value: "ONE_HALF_HOUR", label: "1 hora e 30 minutos" },
  { value: "TWO_HOURS", label: "2 horas" },
  { value: "TWO_HALF_HOURS", label: "2 horas e 30 minutos" },
  { value: "THREE_HOURS", label: "3 horas" },
];

const STATUS = [
  { value: "SCHEDULED", label: "Agendado" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "FINISHED", label: "Finalizado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELED", label: "Cancelado" },
];

const STATUS_ALIASES = {
  AGENDADO: "SCHEDULED",
  SCHEDULED: "SCHEDULED",
  CONFIRMADO: "CONFIRMED",
  CONFIRMED: "CONFIRMED",
  FINALIZADO: "FINISHED",
  FINISHED: "FINISHED",
  ENTREGUE: "DELIVERED",
  DELIVERED: "DELIVERED",
  CANCELADO: "CANCELED",
  CANCELED: "CANCELED",
  CANCELLED: "CANCELED",
};

const normalizarTexto = (valor = "") =>
  String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const limparCPF = (cpf = "") => String(cpf).replace(/\D/g, "");

const converterIdParaPayload = (id) => {
  const valor = String(id);
  return /^\d+$/.test(valor) ? Number(valor) : id;
};

const formatarCPF = (cpf = "") => {
  const cpfLimpo = limparCPF(cpf);

  if (cpfLimpo.length !== 11) {
    return cpf || "Não informado";
  }

  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const extrairLista = (resposta, chaves = []) => {
  const conteudo = resposta?.data ?? resposta;

  if (Array.isArray(conteudo)) {
    return conteudo;
  }

  for (let index = 0; index < chaves.length; index += 1) {
    const valor = conteudo?.[chaves[index]];

    if (Array.isArray(valor)) {
      return valor;
    }
  }

  if (Array.isArray(conteudo?.data)) {
    return conteudo.data;
  }

  return [];
};

const normalizarStatus = (status = "") => {
  const chave = normalizarTexto(status).toUpperCase();
  return STATUS_ALIASES[chave] || String(status).toUpperCase() || "SCHEDULED";
};

const obterStatusLabel = (status) =>
  STATUS.find((item) => item.value === normalizarStatus(status))?.label ||
  status ||
  "Não informado";

const obterDuracaoLabel = (duracao) =>
  DURACOES.find((item) => item.value === duracao)?.label ||
  duracao ||
  "Não informada";

const obterDataValida = (valor) => {
  if (!valor) {
    return null;
  }

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
};

const obterServicoNormalizado = (item) => {
  if (typeof item === "number" || typeof item === "string") {
    return {
      id: item,
      name: String(item),
    };
  }

  const servico = item?.service || item?.servico || item;

  return {
    id:
      servico?.id ??
      servico?.service_id ??
      item?.service_id ??
      item?.id ??
      null,
    name:
      servico?.name ??
      servico?.service_name ??
      servico?.nome ??
      item?.name ??
      item?.service_name ??
      "Serviço",
  };
};

const GerenciarAgendamentos = () => {
  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pets, setPets] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [recarregando, setRecarregando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [ordenacao, setOrdenacao] = useState("MAIS_RECENTES");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroEdicao, setErroEdicao] = useState("");
  const [formEdicao, setFormEdicao] = useState(null);

  const mapaClientes = useMemo(
    () =>
      new Map(
        clientes.map((cliente) => [String(cliente.cpf), cliente])
      ),
    [clientes]
  );

  const mapaPets = useMemo(
    () => new Map(pets.map((pet) => [String(pet.id), pet])),
    [pets]
  );

  const mapaColaboradores = useMemo(
    () =>
      new Map(
        colaboradores.map((colaborador) => [
          String(colaborador.cpf),
          colaborador,
        ])
      ),
    [colaboradores]
  );

  const mapaServicos = useMemo(
    () => new Map(servicos.map((servico) => [String(servico.id), servico])),
    [servicos]
  );

  const normalizarAgendamento = (agendamento) => {
    const clienteCpf =
      agendamento.client_cpf ??
      agendamento.clientCpf ??
      agendamento.user_cpf ??
      agendamento.client?.cpf ??
      agendamento.user?.cpf ??
      "";

    const petId =
      agendamento.pet_id ??
      agendamento.petId ??
      agendamento.pet?.id ??
      "";

    const colaboradorCpf =
      agendamento.collaborator_cpf ??
      agendamento.collaboratorCpf ??
      agendamento.collaborator?.cpf ??
      agendamento.colaborador?.cpf ??
      "";

    const clienteBase = mapaClientes.get(String(clienteCpf));
    const petBase = mapaPets.get(String(petId));
    const colaboradorBase = mapaColaboradores.get(String(colaboradorCpf));

    const servicosOriginais = Array.isArray(agendamento.services)
      ? agendamento.services
      : Array.isArray(agendamento.schedule_services)
        ? agendamento.schedule_services
        : Array.isArray(agendamento.service_schedules)
          ? agendamento.service_schedules
          : [];

    const servicosNormalizados = servicosOriginais.map((item) => {
      const normalizado = obterServicoNormalizado(item);
      const cadastro = mapaServicos.get(String(normalizado.id));

      return {
        id: normalizado.id,
        name: cadastro?.name || normalizado.name,
      };
    });

    return {
      ...agendamento,
      id:
        agendamento.id ??
        agendamento.schedule_id ??
        agendamento.scheduleId,
      clientCpf: clienteCpf,
      clientName:
        agendamento.client_name ??
        agendamento.clientName ??
        agendamento.client?.name ??
        agendamento.user?.name ??
        clienteBase?.name ??
        "Cliente não identificado",
      clientEmail:
        agendamento.client?.email ??
        agendamento.user?.email ??
        clienteBase?.email ??
        "",
      petId,
      petName:
        agendamento.pet_name ??
        agendamento.petName ??
        agendamento.pet?.name ??
        petBase?.name ??
        "Pet não identificado",
      collaboratorCpf: colaboradorCpf,
      collaboratorName:
        agendamento.collaborator_name ??
        agendamento.collaboratorName ??
        agendamento.collaborator?.name ??
        agendamento.colaborador?.name ??
        colaboradorBase?.name ??
        "Colaborador não identificado",
      dateTime:
        agendamento.date_time ??
        agendamento.dateTime ??
        agendamento.scheduled_at ??
        "",
      duration: agendamento.duration ?? "",
      status: normalizarStatus(agendamento.status),
      observation:
        agendamento.observation ??
        agendamento.observacao ??
        "",
      services: servicosNormalizados,
    };
  };

  const carregarDados = async (mostrarCarregamentoCompleto = true) => {
    if (mostrarCarregamentoCompleto) {
      setCarregando(true);
    } else {
      setRecarregando(true);
    }

    setErroCarregamento("");

    try {
      const [resUsuarios, resPets, resServicos, resAgendamentos] =
        await Promise.all([
          userService.listUsers(),
          petService.listar(),
          serviceService.listar(),
          scheduleService.listar(
            DATA_INICIAL_LISTAGEM,
            DATA_FINAL_LISTAGEM
          ),
        ]);

      const usuariosRecebidos = extrairLista(resUsuarios, [
        "users",
        "usuarios",
      ]);
      const petsRecebidos = extrairLista(resPets, ["pets"]);
      const servicosRecebidos = extrairLista(resServicos, [
        "services",
        "servicos",
      ]);
      const agendamentosRecebidos = extrairLista(resAgendamentos, [
        "schedules",
        "agendamentos",
      ]);

      const clientesRecebidos = usuariosRecebidos.filter(
        (usuario) =>
          usuario.type === "Cliente" ||
          usuario.type === "CLIENT" ||
          !usuario.type
      );

      const colaboradoresRecebidos = usuariosRecebidos.filter(
        (usuario) =>
          usuario.type === "Colaborador" ||
          usuario.type === "COLLABORATOR" ||
          usuario.type === "Admin" ||
          usuario.type === "Administrador" ||
          usuario.type === "ADMIN"
      );

      setClientes(clientesRecebidos);
      setColaboradores(colaboradoresRecebidos);
      setPets(petsRecebidos);
      setServicos(servicosRecebidos);
      setAgendamentos(agendamentosRecebidos);
    } catch (erro) {
      console.error("Erro ao carregar agendamentos:", erro);
      setErroCarregamento(
        erro.response?.data?.error ||
          "Não foi possível carregar os agendamentos."
      );
    } finally {
      setCarregando(false);
      setRecarregando(false);
    }
  };

  useEffect(() => {
    carregarDados(true);
  }, []);

  const agendamentosNormalizados = useMemo(
    () => agendamentos.map(normalizarAgendamento),
    [agendamentos, mapaClientes, mapaPets, mapaColaboradores, mapaServicos]
  );

  const totais = useMemo(() => {
    const resultado = {
      total: agendamentosNormalizados.length,
      agendados: 0,
      confirmados: 0,
      finalizados: 0,
      cancelados: 0,
    };

    agendamentosNormalizados.forEach((agendamento) => {
      if (agendamento.status === "SCHEDULED") resultado.agendados += 1;
      if (agendamento.status === "CONFIRMED") resultado.confirmados += 1;
      if (
        agendamento.status === "FINISHED" ||
        agendamento.status === "DELIVERED"
      ) {
        resultado.finalizados += 1;
      }
      if (agendamento.status === "CANCELED") resultado.cancelados += 1;
    });

    return resultado;
  }, [agendamentosNormalizados]);

  const agendamentosFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca);

    const resultado = agendamentosNormalizados.filter((agendamento) => {
      const dataAgendamento = obterDataValida(agendamento.dateTime);
      const dataSomente = dataAgendamento
        ? format(dataAgendamento, "yyyy-MM-dd")
        : "";

      const correspondeBusca =
        !termo ||
        [
          agendamento.clientName,
          agendamento.clientCpf,
          agendamento.petName,
          agendamento.collaboratorName,
          agendamento.observation,
          ...agendamento.services.map((servico) => servico.name),
        ].some((valor) => normalizarTexto(valor).includes(termo));

      const correspondeStatus =
        filtroStatus === "TODOS" || agendamento.status === filtroStatus;

      const correspondeDataInicial =
        !dataInicial || (dataSomente && dataSomente >= dataInicial);

      const correspondeDataFinal =
        !dataFinal || (dataSomente && dataSomente <= dataFinal);

      return (
        correspondeBusca &&
        correspondeStatus &&
        correspondeDataInicial &&
        correspondeDataFinal
      );
    });

    return resultado.sort((a, b) => {
      const dataA = obterDataValida(a.dateTime)?.getTime() || 0;
      const dataB = obterDataValida(b.dateTime)?.getTime() || 0;

      return ordenacao === "MAIS_ANTIGOS" ? dataA - dataB : dataB - dataA;
    });
  }, [
    agendamentosNormalizados,
    busca,
    filtroStatus,
    dataInicial,
    dataFinal,
    ordenacao,
  ]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, filtroStatus, dataInicial, dataFinal, ordenacao]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(agendamentosFiltrados.length / ITENS_POR_PAGINA)
  );

  const agendamentosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return agendamentosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [agendamentosFiltrados, paginaAtual]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  const limparFiltros = () => {
    setBusca("");
    setFiltroStatus("TODOS");
    setDataInicial("");
    setDataFinal("");
    setOrdenacao("MAIS_RECENTES");
  };

  const obterIdsServicosEdicao = (agendamento) =>
    agendamento.services
      .map((servicoAgendamento) => {
        if (servicoAgendamento.id != null) {
          return String(servicoAgendamento.id);
        }

        const encontrado = servicos.find(
          (servico) =>
            normalizarTexto(servico.name) ===
            normalizarTexto(servicoAgendamento.name)
        );

        return encontrado ? String(encontrado.id) : null;
      })
      .filter(Boolean);

  const abrirModalEdicao = (agendamento) => {
    const data = obterDataValida(agendamento.dateTime);

    setFormEdicao({
      id: agendamento.id,
      client_cpf: String(agendamento.clientCpf || ""),
      pet_id: String(agendamento.petId || ""),
      collaborator_cpf: String(agendamento.collaboratorCpf || ""),
      date: data ? format(data, "yyyy-MM-dd") : "",
      time: data ? format(data, "HH:mm") : "",
      duration: agendamento.duration || "",
      status: normalizarStatus(agendamento.status),
      observation: agendamento.observation || "",
      services: obterIdsServicosEdicao(agendamento),
    });

    setErroEdicao("");
    setMensagemSucesso("");
    setModalAberto(true);
  };

  const fecharModalEdicao = () => {
    if (salvando) return;

    setModalAberto(false);
    setFormEdicao(null);
    setErroEdicao("");
  };

  const petsDoClienteEdicao = useMemo(() => {
    if (!formEdicao?.client_cpf) {
      return [];
    }

    return pets.filter(
      (pet) =>
        String(
          pet.user_cpf ??
            pet.client_cpf ??
            pet.owner_cpf ??
            pet.user?.cpf ??
            ""
        ) === String(formEdicao.client_cpf)
    );
  }, [pets, formEdicao?.client_cpf]);

  const alterarCampoEdicao = (campo, valor) => {
    setFormEdicao((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
    setErroEdicao("");
  };

  const alterarClienteEdicao = (cpf) => {
    setFormEdicao((anterior) => ({
      ...anterior,
      client_cpf: cpf,
      pet_id: "",
    }));
    setErroEdicao("");
  };

  const alternarServicoEdicao = (serviceId) => {
    const id = String(serviceId);

    setFormEdicao((anterior) => ({
      ...anterior,
      services: anterior.services.includes(id)
        ? anterior.services.filter((item) => item !== id)
        : [...anterior.services, id],
    }));
    setErroEdicao("");
  };

  const salvarEdicao = async () => {
    if (!formEdicao) return;

    const camposObrigatorios = [
      formEdicao.client_cpf,
      formEdicao.pet_id,
      formEdicao.collaborator_cpf,
      formEdicao.date,
      formEdicao.time,
      formEdicao.duration,
      formEdicao.status,
    ];

    if (camposObrigatorios.some((campo) => !campo)) {
      setErroEdicao("Preencha todos os campos obrigatórios.");
      return;
    }

    if (formEdicao.services.length === 0) {
      setErroEdicao("Selecione pelo menos um serviço.");
      return;
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(formEdicao.time)) {
      setErroEdicao("Informe um horário válido.");
      return;
    }

    const dataHora = new Date(`${formEdicao.date}T${formEdicao.time}:00`);

    if (Number.isNaN(dataHora.getTime())) {
      setErroEdicao("Informe uma data e um horário válidos.");
      return;
    }

    setSalvando(true);
    setErroEdicao("");

    try {
      await scheduleService.atualizar(formEdicao.id, {
        client_cpf: formEdicao.client_cpf,
        pet_id: Number(formEdicao.pet_id),
        collaborator_cpf: formEdicao.collaborator_cpf,
        date_time: dataHora.toISOString(),
        duration: formEdicao.duration,
        status: formEdicao.status,
        observation: formEdicao.observation.trim(),
        services: formEdicao.services.map(converterIdParaPayload),
      });

      setModalAberto(false);
      setFormEdicao(null);
      setMensagemSucesso("Agendamento atualizado com sucesso!");
      await carregarDados(false);
    } catch (erro) {
      console.error("Erro ao atualizar agendamento:", erro);
      setErroEdicao(
        erro.response?.data?.error ||
          erro.response?.data?.message ||
          "Não foi possível atualizar o agendamento."
      );
    } finally {
      setSalvando(false);
    }
  };

  const formatarDataHora = (valor) => {
    const data = obterDataValida(valor);

    if (!data) {
      return {
        data: "Data não informada",
        hora: "--:--",
      };
    }

    return {
      data: format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
      hora: format(data, "HH:mm"),
    };
  };

  return (
    <>
      <AdminSidebar />

      <section className="gerenciar-ag-page">
        <header className="gerenciar-ag-header">
          <div>
            <span className="gerenciar-ag-badge">Painel administrativo</span>

            <h1>
              <span className="gerenciar-ag-title-icon">
                <img src={Pata} alt="Pata" />
              </span>
              AGENDAMENTOS
            </h1>

            <p>
              Consulte todos os atendimentos, encontre um registro rapidamente
              e atualize seus dados sem sair do painel.
            </p>
          </div>

          <button
            type="button"
            className="gerenciar-ag-new-button"
            onClick={() => navigate("/admin/agendamentos/novo")}
          >
            <Plus size={19} />
            Novo agendamento
          </button>
        </header>

        <div className="gerenciar-ag-summary-grid">
          <article className="gerenciar-ag-summary-card total">
            <span className="gerenciar-ag-summary-icon">
              <CalendarDays size={21} />
            </span>
            <div>
              <strong>{totais.total}</strong>
              <span>Total de agendamentos</span>
            </div>
          </article>

          <article className="gerenciar-ag-summary-card scheduled">
            <span className="gerenciar-ag-summary-icon">
              <Clock3 size={21} />
            </span>
            <div>
              <strong>{totais.agendados}</strong>
              <span>Agendados</span>
            </div>
          </article>

          <article className="gerenciar-ag-summary-card confirmed">
            <span className="gerenciar-ag-summary-icon">
              <CheckCircle2 size={21} />
            </span>
            <div>
              <strong>{totais.confirmados}</strong>
              <span>Confirmados</span>
            </div>
          </article>

          <article className="gerenciar-ag-summary-card finished">
            <span className="gerenciar-ag-summary-icon">
              <PawPrint size={21} />
            </span>
            <div>
              <strong>{totais.finalizados}</strong>
              <span>Finalizados ou entregues</span>
            </div>
          </article>

          <article className="gerenciar-ag-summary-card canceled">
            <span className="gerenciar-ag-summary-icon">
              <XCircle size={21} />
            </span>
            <div>
              <strong>{totais.cancelados}</strong>
              <span>Cancelados</span>
            </div>
          </article>
        </div>

        <div className="gerenciar-ag-filter-card">
          <div className="gerenciar-ag-filter-title">
            <div>
              <Filter size={18} />
              <strong>Filtros da agenda</strong>
            </div>

            <button type="button" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>

          <div className="gerenciar-ag-filter-grid">
            <div className="gerenciar-ag-search-field">
              <Search size={18} />
              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar cliente, CPF, pet, serviço..."
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(event) => setFiltroStatus(event.target.value)}
              aria-label="Filtrar por status"
            >
              <option value="TODOS">Todos os status</option>
              {STATUS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <div className="gerenciar-ag-date-field">
              <span>De</span>
              <input
                type="date"
                value={dataInicial}
                onChange={(event) => setDataInicial(event.target.value)}
              />
            </div>

            <div className="gerenciar-ag-date-field">
              <span>Até</span>
              <input
                type="date"
                value={dataFinal}
                onChange={(event) => setDataFinal(event.target.value)}
              />
            </div>

            <select
              value={ordenacao}
              onChange={(event) => setOrdenacao(event.target.value)}
              aria-label="Ordenar agendamentos"
            >
              <option value="MAIS_RECENTES">Mais recentes primeiro</option>
              <option value="MAIS_ANTIGOS">Mais antigos primeiro</option>
            </select>
          </div>
        </div>

        {mensagemSucesso && (
          <div className="gerenciar-ag-success-message">
            <CheckCircle2 size={19} />
            <span>{mensagemSucesso}</span>
            <button
              type="button"
              onClick={() => setMensagemSucesso("")}
              aria-label="Fechar mensagem"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="gerenciar-ag-list-header">
          <div>
            <h2>Todos os agendamentos</h2>
            <p>
              {agendamentosFiltrados.length} registro(s) encontrado(s)
            </p>
          </div>

          <button
            type="button"
            className="gerenciar-ag-refresh-button"
            onClick={() => carregarDados(false)}
            disabled={recarregando}
          >
            <RefreshCw
              size={18}
              className={recarregando ? "is-spinning" : ""}
            />
            {recarregando ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>

        {carregando ? (
          <div className="gerenciar-ag-state-card">
            <LoaderCircle className="is-spinning" size={34} />
            <strong>Carregando a agenda...</strong>
            <span>Organizando os atendimentos do petshop.</span>
          </div>
        ) : erroCarregamento ? (
          <div className="gerenciar-ag-state-card error">
            <XCircle size={34} />
            <strong>Não foi possível carregar</strong>
            <span>{erroCarregamento}</span>
            <button type="button" onClick={() => carregarDados(true)}>
              Tentar novamente
            </button>
          </div>
        ) : agendamentosPaginados.length === 0 ? (
          <div className="gerenciar-ag-state-card">
            <Search size={34} />
            <strong>Nenhum agendamento encontrado</strong>
            <span>Altere os filtros ou cadastre um novo atendimento.</span>
          </div>
        ) : (
          <>
            <div className="gerenciar-ag-cards-grid">
              {agendamentosPaginados.map((agendamento) => {
                const dataHora = formatarDataHora(agendamento.dateTime);

                return (
                  <article
                    className="gerenciar-ag-card"
                    key={agendamento.id}
                  >
                    <div className="gerenciar-ag-card-top">
                      <span
                        className={`gerenciar-ag-status status-${agendamento.status.toLowerCase()}`}
                      >
                        {obterStatusLabel(agendamento.status)}
                      </span>

                      <button
                        type="button"
                        className="gerenciar-ag-edit-button"
                        onClick={() => abrirModalEdicao(agendamento)}
                      >
                        <Pencil size={17} />
                        Editar
                      </button>
                    </div>

                    <div className="gerenciar-ag-date-box">
                      <span className="gerenciar-ag-date-icon">
                        <CalendarDays size={21} />
                      </span>
                      <div>
                        <strong>{dataHora.data}</strong>
                        <span>
                          {dataHora.hora} • {obterDuracaoLabel(agendamento.duration)}
                        </span>
                      </div>
                    </div>

                    <div className="gerenciar-ag-info-list">
                      <div>
                        <UserRound size={18} />
                        <span>
                          <small>Cliente</small>
                          <strong>{agendamento.clientName}</strong>
                          <em>{formatarCPF(agendamento.clientCpf)}</em>
                        </span>
                      </div>

                      <div>
                        <PawPrint size={18} />
                        <span>
                          <small>Pet</small>
                          <strong>{agendamento.petName}</strong>
                        </span>
                      </div>

                      <div>
                        <Scissors size={18} />
                        <span>
                          <small>Colaborador</small>
                          <strong>{agendamento.collaboratorName}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="gerenciar-ag-services">
                      <small>Serviços</small>
                      <div>
                        {agendamento.services.length > 0 ? (
                          agendamento.services.map((servico, index) => (
                            <span key={`${servico.id ?? servico.name}-${index}`}>
                              {servico.name}
                            </span>
                          ))
                        ) : (
                          <em>Nenhum serviço informado</em>
                        )}
                      </div>
                    </div>

                    {agendamento.observation?.trim() && (
                      <div className="gerenciar-ag-observation">
                        <small>Observação</small>
                        <p>{agendamento.observation}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {totalPaginas > 1 && (
              <div className="gerenciar-ag-pagination">
                <button
                  type="button"
                  onClick={() =>
                    setPaginaAtual((pagina) => Math.max(1, pagina - 1))
                  }
                  disabled={paginaAtual === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={19} />
                </button>

                <span>
                  Página <strong>{paginaAtual}</strong> de {totalPaginas}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPaginaAtual((pagina) =>
                      Math.min(totalPaginas, pagina + 1)
                    )
                  }
                  disabled={paginaAtual === totalPaginas}
                  aria-label="Próxima página"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {modalAberto && formEdicao && (
        <div
          className="gerenciar-ag-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModalEdicao();
            }
          }}
        >
          <div className="gerenciar-ag-modal" role="dialog" aria-modal="true">
            <div className="gerenciar-ag-modal-header">
              <div>
                <span>Editar atendimento</span>
                <h2>Agendamento #{formEdicao.id}</h2>
                <p>Altere os dados necessários e salve para atualizar o banco.</p>
              </div>

              <button
                type="button"
                onClick={fecharModalEdicao}
                disabled={salvando}
                aria-label="Fechar modal"
              >
                <X size={21} />
              </button>
            </div>

            <div className="gerenciar-ag-modal-content">
              <div className="gerenciar-ag-form-grid">
                <div className="gerenciar-ag-form-group full">
                  <label htmlFor="editar-cliente">Cliente</label>
                  <select
                    id="editar-cliente"
                    value={formEdicao.client_cpf}
                    onChange={(event) => alterarClienteEdicao(event.target.value)}
                  >
                    <option value="">Selecione o cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.cpf} value={cliente.cpf}>
                        {cliente.name} • {formatarCPF(cliente.cpf)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gerenciar-ag-form-group">
                  <label htmlFor="editar-pet">Pet</label>
                  <select
                    id="editar-pet"
                    value={formEdicao.pet_id}
                    onChange={(event) =>
                      alterarCampoEdicao("pet_id", event.target.value)
                    }
                    disabled={!formEdicao.client_cpf}
                  >
                    <option value="">Selecione o pet</option>
                    {petsDoClienteEdicao.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gerenciar-ag-form-group">
                  <label htmlFor="editar-colaborador">Colaborador</label>
                  <select
                    id="editar-colaborador"
                    value={formEdicao.collaborator_cpf}
                    onChange={(event) =>
                      alterarCampoEdicao(
                        "collaborator_cpf",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Selecione o colaborador</option>
                    {colaboradores.map((colaborador) => (
                      <option key={colaborador.cpf} value={colaborador.cpf}>
                        {colaborador.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gerenciar-ag-form-group">
                  <label htmlFor="editar-data">Data</label>
                  <input
                    id="editar-data"
                    type="date"
                    value={formEdicao.date}
                    onChange={(event) =>
                      alterarCampoEdicao("date", event.target.value)
                    }
                  />
                </div>

                <div className="gerenciar-ag-form-group">
                  <label htmlFor="editar-hora">Horário</label>
                  <input
                    id="editar-hora"
                    type="time"
                    value={formEdicao.time}
                    onChange={(event) =>
                      alterarCampoEdicao("time", event.target.value)
                    }
                  />
                </div>

                <div className="gerenciar-ag-form-group">
                  <label htmlFor="editar-duracao">Duração</label>
                  <select
                    id="editar-duracao"
                    value={formEdicao.duration}
                    onChange={(event) =>
                      alterarCampoEdicao("duration", event.target.value)
                    }
                  >
                    <option value="">Selecione a duração</option>
                    {DURACOES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gerenciar-ag-form-group">
                  <label htmlFor="editar-status">Status</label>
                  <select
                    id="editar-status"
                    value={formEdicao.status}
                    onChange={(event) =>
                      alterarCampoEdicao("status", event.target.value)
                    }
                  >
                    {STATUS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gerenciar-ag-form-group full">
                  <label>Serviços</label>
                  <div className="gerenciar-ag-modal-services">
                    {servicos.map((servico) => {
                      const ativo = formEdicao.services.includes(
                        String(servico.id)
                      );

                      return (
                        <button
                          key={servico.id}
                          type="button"
                          className={ativo ? "active" : ""}
                          onClick={() => alternarServicoEdicao(servico.id)}
                        >
                          {servico.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="gerenciar-ag-form-group full">
                  <label htmlFor="editar-observacao">Observações</label>
                  <textarea
                    id="editar-observacao"
                    rows="4"
                    value={formEdicao.observation}
                    onChange={(event) =>
                      alterarCampoEdicao("observation", event.target.value)
                    }
                    placeholder="Detalhes importantes do atendimento..."
                  />
                </div>
              </div>

              {erroEdicao && (
                <div className="gerenciar-ag-modal-error">
                  <XCircle size={18} />
                  <span>{erroEdicao}</span>
                </div>
              )}
            </div>

            <div className="gerenciar-ag-modal-actions">
              <button
                type="button"
                className="gerenciar-ag-cancel-button"
                onClick={fecharModalEdicao}
                disabled={salvando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="gerenciar-ag-save-button"
                onClick={salvarEdicao}
                disabled={salvando}
              >
                {salvando ? (
                  <LoaderCircle className="is-spinning" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GerenciarAgendamentos;
