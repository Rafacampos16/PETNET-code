import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import "../styles/logs.css";

const logsMock = [
  {
    id: 24,
    entity: "appointment",
    action: "update",
    status: "success",
    responsible: "12345678900",
    details: "Status do agendamento atualizado para confirmado.",
    created_at: "2026-06-02 14:35:12",
  },
  {
    id: 23,
    entity: "pet",
    action: "create",
    status: "success",
    responsible: "12345678900",
    details: "Pet cadastrado com sucesso e vinculado ao cliente responsável.",
    created_at: "2026-06-02 13:58:40",
  },
  {
    id: 22,
    entity: "service",
    action: "update",
    status: "success",
    responsible: "98765432100",
    details: "Valor do serviço Banho e Tosa atualizado pelo administrador.",
    created_at: "2026-06-02 12:44:03",
  },
  {
    id: 21,
    entity: "user",
    action: "login",
    status: "success",
    responsible: "00000000000",
    details: "Usuário realizou login na plataforma PETNET.",
    created_at: "2026-06-02 11:20:55",
  },
  {
    id: 20,
    entity: "appointment",
    action: "create",
    status: "success",
    responsible: "45678912300",
    details: "Novo agendamento criado para o serviço de banho.",
    created_at: "2026-06-02 10:15:27",
  },
  {
    id: 19,
    entity: "customer",
    action: "update",
    status: "success",
    responsible: "98765432100",
    details: "Dados cadastrais do cliente atualizados com novo telefone.",
    created_at: "2026-06-02 09:36:18",
  },
  {
    id: 18,
    entity: "address",
    action: "create",
    status: "success",
    responsible: "45678912300",
    details: "Novo endereço cadastrado para cliente.",
    created_at: "2026-06-02 08:42:09",
  },
  {
    id: 17,
    entity: "service",
    action: "create",
    status: "success",
    responsible: "12345678900",
    details: "Novo serviço cadastrado no catálogo do PETNET.",
    created_at: "2026-06-02 08:05:33",
  },
  {
    id: 16,
    entity: "user",
    action: "delete",
    status: "error",
    responsible: "00000000000",
    details:
      "\nInvalid `prisma.user.findUnique()` invocation:\n\n\nCan't reach database server at `db:3306`\n\nPlease make sure your database server is running at `db:3306`.",
    created_at: "2026-06-02 02:30:52",
  },
  {
    id: 15,
    entity: "appointment",
    action: "cancel",
    status: "success",
    responsible: "98765432100",
    details: "Agendamento cancelado pela equipe administrativa.",
    created_at: "2026-06-01 18:22:47",
  },
  {
    id: 14,
    entity: "pet",
    action: "update",
    status: "success",
    responsible: "12345678900",
    details: "Informações do pet atualizadas: porte, observações e responsável.",
    created_at: "2026-06-01 17:40:11",
  },
  {
    id: 13,
    entity: "contact",
    action: "update",
    status: "warning",
    responsible: "45678912300",
    details:
      "Contato atualizado, porém o telefone secundário não foi informado.",
    created_at: "2026-06-01 16:08:29",
  },
  {
    id: 12,
    entity: "user",
    action: "create",
    status: "success",
    responsible: "98765432100",
    details: "Novo usuário cliente criado no sistema.",
    created_at: "2026-06-01 15:21:03",
  },
  {
    id: 11,
    entity: "appointment",
    action: "finish",
    status: "success",
    responsible: "12345678900",
    details: "Atendimento finalizado pelo colaborador.",
    created_at: "2026-06-01 14:11:38",
  },
  {
    id: 10,
    entity: "service",
    action: "delete",
    status: "error",
    responsible: "00000000000",
    details:
      "Não foi possível remover o serviço, pois existem agendamentos vinculados a ele.",
    created_at: "2026-06-01 13:33:50",
  },
  {
    id: 9,
    entity: "customer",
    action: "create",
    status: "success",
    responsible: "45678912300",
    details: "Cliente cadastrado com CPF, endereço e contato principal.",
    created_at: "2026-06-01 11:59:24",
  },
  {
    id: 8,
    entity: "appointment",
    action: "update",
    status: "warning",
    responsible: "98765432100",
    details:
      "Tentativa de reagendamento realizada, mas o horário selecionado estava próximo do limite de disponibilidade.",
    created_at: "2026-05-31 19:18:46",
  },
  {
    id: 7,
    entity: "pet",
    action: "delete",
    status: "error",
    responsible: "12345678900",
    details:
      "Não foi possível excluir o pet, pois ele possui histórico de agendamentos.",
    created_at: "2026-05-31 18:03:19",
  },
  {
    id: 6,
    entity: "user",
    action: "logout",
    status: "success",
    responsible: "45678912300",
    details: "Usuário encerrou a sessão no sistema.",
    created_at: "2026-05-31 17:42:00",
  },
  {
    id: 5,
    entity: "appointment",
    action: "create",
    status: "success",
    responsible: "98765432100",
    details: "Agendamento criado para serviço de tosa higiênica.",
    created_at: "2026-05-31 16:25:31",
  },
  {
    id: 4,
    entity: "address",
    action: "update",
    status: "success",
    responsible: "12345678900",
    details: "Endereço principal do cliente atualizado.",
    created_at: "2026-05-31 15:14:07",
  },
  {
    id: 3,
    entity: "service",
    action: "update",
    status: "success",
    responsible: "45678912300",
    details: "Descrição do serviço terapêutico atualizada.",
    created_at: "2026-05-31 14:02:44",
  },
  {
    id: 2,
    entity: "user",
    action: "login",
    status: "error",
    responsible: "00000000000",
    details:
      "Tentativa de login recusada. Credenciais inválidas informadas pelo usuário.",
    created_at: "2026-05-31 13:47:12",
  },
  {
    id: 1,
    entity: "customer",
    action: "update",
    status: "success",
    responsible: "98765432100",
    details: "Cliente atualizou informações pessoais na área Minha Conta.",
    created_at: "2026-05-31 12:36:59",
  },
];

function Logs() {
  const [logs, setLogs] = useState([]);
  const [busca, setBusca] = useState("");
  const [entidadeFiltro, setEntidadeFiltro] = useState("");
  const [acaoFiltro, setAcaoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const [logSelecionado, setLogSelecionado] = useState(null);

  useEffect(() => {
    carregarLogs();
  }, []);

  async function carregarLogs() {
    try {
      /*
        Quando o service do backend estiver pronto, troque o mock por algo assim:

        const resposta = await logsService.listarLogs();
        setLogs(resposta.data || resposta || []);
      */

      setLogs(logsMock);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      setLogs([]);
    }
  }

  const entidades = useMemo(() => {
    return [...new Set(logs.map((log) => log.entity).filter(Boolean))];
  }, [logs]);

  const tiposAcao = useMemo(() => {
    return [...new Set(logs.map((log) => log.action).filter(Boolean))];
  }, [logs]);

  const statusDisponiveis = useMemo(() => {
    return [...new Set(logs.map((log) => log.status).filter(Boolean))];
  }, [logs]);

  const logsFiltrados = useMemo(() => {
    return logs.filter((log) => {
      const buscaMinuscula = busca.toLowerCase();

      const correspondeBusca =
        formatarCpf(log.responsible).toLowerCase().includes(buscaMinuscula) ||
        String(log.responsible || "").toLowerCase().includes(buscaMinuscula) ||
        traduzirEntidade(log.entity).toLowerCase().includes(buscaMinuscula) ||
        traduzirAcao(log.action).toLowerCase().includes(buscaMinuscula) ||
        traduzirStatus(log.status).toLowerCase().includes(buscaMinuscula) ||
        String(log.details || "").toLowerCase().includes(buscaMinuscula);

      const correspondeEntidade = entidadeFiltro
        ? log.entity === entidadeFiltro
        : true;

      const correspondeAcao = acaoFiltro ? log.action === acaoFiltro : true;

      const correspondeStatus = statusFiltro
        ? log.status === statusFiltro
        : true;

      const correspondeData = dataFiltro
        ? converterDataParaInput(log.created_at) === dataFiltro
        : true;

      return (
        correspondeBusca &&
        correspondeEntidade &&
        correspondeAcao &&
        correspondeStatus &&
        correspondeData
      );
    });
  }, [logs, busca, entidadeFiltro, acaoFiltro, statusFiltro, dataFiltro]);

  const totalErros = logs.filter((log) => log.status === "error").length;
  const totalSucessos = logs.filter((log) => log.status === "success").length;

  const logsHoje = logs.filter((log) => {
    const hoje = new Date().toISOString().slice(0, 10);
    return converterDataParaInput(log.created_at) === hoje;
  }).length;

  const ultimaAtividade = logs[0]?.created_at
    ? formatarHora(logs[0].created_at)
    : "--:--";

  function limparFiltros() {
    setBusca("");
    setEntidadeFiltro("");
    setAcaoFiltro("");
    setStatusFiltro("");
    setDataFiltro("");
    setLogSelecionado(null);
  }

  function converterDataParaInput(dataHora) {
    if (!dataHora) return "";

    if (String(dataHora).includes(" ")) {
      return String(dataHora).split(" ")[0];
    }

    return String(dataHora).slice(0, 10);
  }

  function formatarDataHora(dataHora) {
    if (!dataHora) return "Não informado";

    const dataTratada = String(dataHora).replace(" ", "T");
    const data = new Date(dataTratada);

    if (Number.isNaN(data.getTime())) {
      return dataHora;
    }

    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatarHora(dataHora) {
    if (!dataHora) return "--:--";

    const dataTratada = String(dataHora).replace(" ", "T");
    const data = new Date(dataTratada);

    if (Number.isNaN(data.getTime())) {
      return String(dataHora).split(" ")[1]?.slice(0, 5) || "--:--";
    }

    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatarCpf(cpf) {
    const cpfLimpo = String(cpf || "").replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      return cpf || "Não informado";
    }

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  function traduzirEntidade(entity) {
    const entidadesTraduzidas = {
      user: "Usuário",
      pet: "Pet",
      service: "Serviço",
      appointment: "Agendamento",
      schedule: "Agendamento",
      customer: "Cliente",
      address: "Endereço",
      contact: "Contato",
    };

    return entidadesTraduzidas[entity] || primeiraLetraMaiuscula(entity);
  }

  function traduzirAcao(action) {
    const acoesTraduzidas = {
      create: "Criação",
      update: "Atualização",
      delete: "Exclusão",
      login: "Login",
      logout: "Logout",
      error: "Erro",
      finish: "Finalização",
      cancel: "Cancelamento",
    };

    return acoesTraduzidas[action] || primeiraLetraMaiuscula(action);
  }

  function traduzirStatus(status) {
    const statusTraduzidos = {
      success: "Sucesso",
      error: "Erro",
      warning: "Atenção",
      info: "Informação",
    };

    return statusTraduzidos[status] || primeiraLetraMaiuscula(status);
  }

  function primeiraLetraMaiuscula(texto) {
    if (!texto) return "Não informado";
    return String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
  }

  function getEntidadeClass(entity) {
    return `entidade-${String(entity || "padrao")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()}`;
  }

  function getStatusClass(status) {
    return `status-${String(status || "info").toLowerCase()}`;
  }

  return (
    <>
      <Header />

      <main className="logs-page">
        <section className="logs-hero">
          <div>
            <span className="logs-kicker">Painel administrativo</span>
            <h1>Logs do Sistema</h1>
            <p>
              Acompanhe as ações, erros e movimentações internas da plataforma
              PETNET.
            </p>
          </div>

          <div className="logs-hero-badge">
            <strong>Monitoramento PETNET</strong>
          </div>
        </section>

        <section className="logs-filters">
          <input
            type="text"
            placeholder="Buscar por CPF, entidade, ação, status ou detalhes"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select
            value={entidadeFiltro}
            onChange={(e) => setEntidadeFiltro(e.target.value)}
          >
            <option value="">Entidade</option>
            {entidades.map((entidade) => (
              <option key={entidade} value={entidade}>
                {traduzirEntidade(entidade)}
              </option>
            ))}
          </select>

          <select
            value={acaoFiltro}
            onChange={(e) => setAcaoFiltro(e.target.value)}
          >
            <option value="">Ação</option>
            {tiposAcao.map((acao) => (
              <option key={acao} value={acao}>
                {traduzirAcao(acao)}
              </option>
            ))}
          </select>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Status</option>
            {statusDisponiveis.map((status) => (
              <option key={status} value={status}>
                {traduzirStatus(status)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
          />

          <button className="btn-limpar" type="button" onClick={limparFiltros}>
            Limpar
          </button>
        </section>

        <section className="logs-cards">
          <div className="log-info-card total">
            <span>Total de logs</span>
            <strong>{logs.length}</strong>
          </div>

          <div className="log-info-card success">
            <span>Sucessos</span>
            <strong>{totalSucessos}</strong>
          </div>

          <div className="log-info-card error">
            <span>Erros</span>
            <strong>{totalErros}</strong>
          </div>

          <div className="log-info-card today">
            <span>Hoje</span>
            <strong>{logsHoje}</strong>
            <small>Última: {ultimaAtividade}</small>
          </div>
        </section>

        <section
          className={`logs-content ${
            logSelecionado ? "with-details" : "without-details"
          }`}
        >
          <div className="logs-table-card">
            <div className="logs-table-header">
              <div>
                <h2>Histórico de Logs</h2>
                <p>{logsFiltrados.length} registro(s) encontrado(s)</p>
              </div>
            </div>

            <div className="logs-table-wrapper">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data/Hora</th>
                    <th>Responsável</th>
                    <th>Entidade</th>
                    <th>Ação</th>
                    <th>Status</th>
                    <th>Detalhes</th>
                  </tr>
                </thead>

                <tbody>
                  {logsFiltrados.length > 0 ? (
                    logsFiltrados.map((log) => (
                      <tr
                        key={log.id}
                        className={
                          logSelecionado?.id === log.id ? "linha-ativa" : ""
                        }
                      >
                        <td>#{log.id}</td>
                        <td>{formatarDataHora(log.created_at)}</td>
                        <td>{formatarCpf(log.responsible)}</td>
                        <td>
                          <span
                            className={`entidade-badge ${getEntidadeClass(
                              log.entity
                            )}`}
                          >
                            {traduzirEntidade(log.entity)}
                          </span>
                        </td>
                        <td>{traduzirAcao(log.action)}</td>
                        <td>
                          <span
                            className={`status-badge ${getStatusClass(
                              log.status
                            )}`}
                          >
                            {traduzirStatus(log.status)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-detalhes"
                            type="button"
                            onClick={() => setLogSelecionado(log)}
                          >
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="sem-logs">
                        Nenhum log encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {logSelecionado && (
            <aside className="log-details-card">
              <button
                className="fechar-detalhes"
                type="button"
                onClick={() => setLogSelecionado(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>

              <span className="details-kicker">Registro #{logSelecionado.id}</span>
              <h2>Detalhes do Log</h2>

              <div className="details-grid">
                <div className="details-group">
                  <span>Responsável</span>
                  <strong>{formatarCpf(logSelecionado.responsible)}</strong>
                </div>

                <div className="details-group">
                  <span>Entidade</span>
                  <strong>
                    <span
                      className={`entidade-badge ${getEntidadeClass(
                        logSelecionado.entity
                      )}`}
                    >
                      {traduzirEntidade(logSelecionado.entity)}
                    </span>
                  </strong>
                </div>

                <div className="details-group">
                  <span>Ação</span>
                  <strong>{traduzirAcao(logSelecionado.action)}</strong>
                </div>

                <div className="details-group">
                  <span>Status</span>
                  <strong>
                    <span
                      className={`status-badge ${getStatusClass(
                        logSelecionado.status
                      )}`}
                    >
                      {traduzirStatus(logSelecionado.status)}
                    </span>
                  </strong>
                </div>

                <div className="details-group details-full">
                  <span>Data de criação</span>
                  <strong>{formatarDataHora(logSelecionado.created_at)}</strong>
                </div>
              </div>

              <div className="details-description">
                <span>Detalhes técnicos</span>
                <pre>{logSelecionado.details || "Nenhum detalhe informado."}</pre>
              </div>

              <div className="details-alert">
                Logs são registros de auditoria e não devem ser alterados ou
                excluídos.
              </div>
            </aside>
          )}
        </section>
      </main>
    </>
  );
}

export default Logs;