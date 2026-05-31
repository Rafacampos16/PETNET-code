import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/logs.css";

const logsMock = [
  {
    id: "#LOG-2026-0538",
    dataHora: "27/05/2026 14:30",
    responsavelCpf: "123.456.789-00",
    entidade: "Agendamento",
    acao: "Criou novo agendamento",
    deletavel: false,
    detalhes:
      "Foi criado um novo agendamento para banho e tosa no sistema PETNET.",
  },
  {
    id: "#LOG-2026-0537",
    dataHora: "27/05/2026 14:12",
    responsavelCpf: "987.654.321-00",
    entidade: "Pet",
    acao: "Atualizou cadastro do pet",
    deletavel: false,
    detalhes:
      "O cadastro do pet foi atualizado com novas informações de atendimento.",
  },
  {
    id: "#LOG-2026-0536",
    dataHora: "27/05/2026 13:50",
    responsavelCpf: "000.000.000-00",
    entidade: "Usuário",
    acao: "Login realizado",
    deletavel: false,
    detalhes: "Um usuário acessou o sistema com sucesso.",
  },
  {
    id: "#LOG-2026-0535",
    dataHora: "27/05/2026 13:22",
    responsavelCpf: "123.456.789-00",
    entidade: "Serviço",
    acao: 'Editou preço do serviço "Banho"',
    deletavel: false,
    detalhes:
      "O valor do serviço Banho foi atualizado na área administrativa.",
  },
  {
    id: "#LOG-2026-0534",
    dataHora: "27/05/2026 12:45",
    responsavelCpf: "456.789.123-00",
    entidade: "Agendamento",
    acao: "Cancelou agendamento",
    deletavel: false,
    detalhes: "Um agendamento foi cancelado pela equipe administrativa.",
  },
  {
    id: "#LOG-2026-0533",
    dataHora: "27/05/2026 11:30",
    responsavelCpf: "123.456.789-00",
    entidade: "Pet",
    acao: 'Cadastrou novo pet "Thor"',
    deletavel: false,
    detalhes: "Um novo pet foi cadastrado e vinculado ao cliente responsável.",
  },
  {
    id: "#LOG-2026-0532",
    dataHora: "27/05/2026 10:58",
    responsavelCpf: "000.000.000-00",
    entidade: "Usuário",
    acao: "Novo usuário cadastrado",
    deletavel: false,
    detalhes: "Um novo usuário foi criado no sistema PETNET.",
  },
  {
    id: "#LOG-2026-0531",
    dataHora: "27/05/2026 10:15",
    responsavelCpf: "987.654.321-00",
    entidade: "Serviço",
    acao: 'Adicionou serviço "Tosa Higiênica"',
    deletavel: false,
    detalhes: "Um novo serviço foi adicionado ao catálogo do PETNET.",
  },
  {
    id: "#LOG-2026-0530",
    dataHora: "27/05/2026 09:42",
    responsavelCpf: "123.456.789-00",
    entidade: "Financeiro",
    acao: "Gerou relatório mensal",
    deletavel: false,
    detalhes: "Foi gerado um relatório financeiro mensal para consulta interna.",
  },
];

function Logs() {
  const [busca, setBusca] = useState("");
  const [entidadeFiltro, setEntidadeFiltro] = useState("");
  const [acaoFiltro, setAcaoFiltro] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const [logSelecionado, setLogSelecionado] = useState(null);
  const detalhesRef = useRef(null);

  const entidades = ["Agendamento", "Pet", "Usuário", "Serviço", "Financeiro"];

  const tiposAcao = [
    "Criou",
    "Atualizou",
    "Login",
    "Editou",
    "Cancelou",
    "Cadastrou",
    "Adicionou",
    "Gerou",
  ];

  const logsFiltrados = useMemo(() => {
    return logsMock.filter((log) => {
      const buscaMinuscula = busca.toLowerCase();

      const correspondeBusca =
        log.responsavelCpf.toLowerCase().includes(buscaMinuscula) ||
        log.entidade.toLowerCase().includes(buscaMinuscula) ||
        log.acao.toLowerCase().includes(buscaMinuscula);

      const correspondeEntidade = entidadeFiltro
        ? log.entidade === entidadeFiltro
        : true;

      const correspondeAcao = acaoFiltro
        ? log.acao.toLowerCase().includes(acaoFiltro.toLowerCase())
        : true;

      const dataLogFormatada = converterDataParaInput(log.dataHora);

      const correspondeData = dataFiltro
        ? dataLogFormatada === dataFiltro
        : true;

      return (
        correspondeBusca &&
        correspondeEntidade &&
        correspondeAcao &&
        correspondeData
      );
    });
  }, [busca, entidadeFiltro, acaoFiltro, dataFiltro]);

  function converterDataParaInput(dataHora) {
    const [data] = dataHora.split(" ");
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  function limparFiltros() {
    setBusca("");
    setEntidadeFiltro("");
    setAcaoFiltro("");
    setDataFiltro("");
    setLogSelecionado(null);
  }



  function getEntidadeClass(entidade) {
    const entidadeFormatada = entidade
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return `entidade-${entidadeFormatada}`;
  }

  return (
    <>
      <Header />

      <main className="logs-page">
        <section className="logs-title-area">
          <div>
            <h1>Logs do Sistema</h1>
            <p>Acompanhe as ações realizadas dentro da plataforma.</p>
          </div>
        </section>

        <section className="logs-filters">
          <input
            type="text"
            placeholder="Buscar por CPF, entidade ou ação"
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
                {entidade}
              </option>
            ))}
          </select>

          <select
            value={acaoFiltro}
            onChange={(e) => setAcaoFiltro(e.target.value)}
          >
            <option value="">Tipo de Ação</option>
            {tiposAcao.map((acao) => (
              <option key={acao} value={acao}>
                {acao}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
          />

          <button className="btn-filtrar" type="button">
            Filtrar
          </button>

          <button className="btn-limpar" type="button" onClick={limparFiltros}>
            Limpar
          </button>
        </section>

        <section className="logs-cards">
          <div className="log-info-card">
            <strong>{logsMock.length}</strong>
            <span>Total de Logs</span>
          </div>

          <div className="log-info-card">
            <strong>
              {
                logsMock.filter(
                  (log) => converterDataParaInput(log.dataHora) === "2026-05-27"
                ).length
              }
            </strong>
            <span>Ações Hoje</span>
          </div>

          <div className="log-info-card">
            <strong>{logsMock.filter((log) => log.deletavel).length}</strong>
            <span>Registros Deletáveis</span>
          </div>

          <div className="log-info-card">
            <strong>{logsMock[0]?.dataHora.split(" ")[1]}</strong>
            <span>Última Atividade</span>
          </div>
        </section>

        <section
          className={`logs-content ${logSelecionado ? "with-details" : "without-details"
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
                    <th>Data/Hora</th>
                    <th>Responsável</th>
                    <th>Entidade</th>
                    <th>Ação</th>
                    <th>Deletável</th>
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
                        <td>{log.dataHora}</td>
                        <td>{log.responsavelCpf}</td>
                        <td>
                          <span
                            className={`entidade-badge ${getEntidadeClass(
                              log.entidade
                            )}`}
                          >
                            {log.entidade}
                          </span>
                        </td>
                        <td>{log.acao}</td>
                        <td>
                          <span
                            className={
                              log.deletavel
                                ? "status-deletavel sim"
                                : "status-deletavel nao"
                            }
                          >
                            {log.deletavel ? "Sim" : "Não"}
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
                      <td colSpan="6" className="sem-logs">
                        Nenhum log encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {logSelecionado && (
            <aside className="log-details-card" ref={detalhesRef}>
              <button
                className="fechar-detalhes"
                type="button"
                onClick={() => setLogSelecionado(null)}
                aria-label="Fechar detalhes"
              >
                ×
              </button>

              <h2>Detalhes do Log</h2>

              <div className="details-group">
                <span>ID do Registro:</span>
                <strong>{logSelecionado.id}</strong>
              </div>

              <div className="details-group">
                <span>Responsável:</span>
                <strong>{logSelecionado.responsavelCpf}</strong>
              </div>

              <div className="details-group">
                <span>Entidade Afetada:</span>
                <strong>
                  <span
                    className={`entidade-badge ${getEntidadeClass(
                      logSelecionado.entidade
                    )}`}
                  >
                    {logSelecionado.entidade}
                  </span>
                </strong>
              </div>

              <div className="details-group">
                <span>Ação Realizada:</span>
                <strong>{logSelecionado.acao}</strong>
              </div>

              <div className="details-group">
                <span>Data de Criação:</span>
                <strong>{logSelecionado.dataHora}</strong>
              </div>

              <div className="details-group">
                <span>Deletável:</span>
                <strong>{logSelecionado.deletavel ? "Sim" : "Não"}</strong>
              </div>

              <div className="details-description">
                <span>Descrição:</span>
                <p>{logSelecionado.detalhes}</p>
              </div>

              <div className="details-alert">
                Logs são imutáveis após a criação.
              </div>
            </aside>
          )}
        </section>
      </main>

    </>
  );
}

export default Logs;