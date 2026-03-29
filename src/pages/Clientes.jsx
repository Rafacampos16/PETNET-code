import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import pawCatIcon from "../assets/icons/paw-cat.png";
import petClienteIcon from "../assets/icons/pet-cliente.png";
import {
  FiSearch,
  FiEye,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
} from "react-icons/fi";
import "../styles/clientes.css";
import { userService } from "../services/userService";
import petService from "../services/petService";

const PetsExpand = ({ data }) => {
  if (!data.pets || data.pets.length === 0) {
    return (
      <div className="pets-expand">
        <span className="no-pets">Nenhum pet cadastrado</span>
      </div>
    );
  }

  return (
    <div className="pets-expand">
      <div className="pets-header">
        <img src={petClienteIcon} alt="pets" className="icon-pets-expand" />
        Pets do cliente
      </div>

      <div className="pets-grid">
        {data.pets.map((pet, index) => (
          <div className="pet-card" key={index}>
            <div className="pet-name">{pet.nome}</div>

            <div className="pet-info">
              <span>
                <strong>Tipo:</strong> {pet.tipo}
              </span>
              <span>
                <strong>Raça:</strong> {pet.raca}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const responseUsuarios = await userService.listUsers();
        const responsePets = await petService.listar();
        console.log("responseUsuarios:", responseUsuarios);
        console.log("responsePets:", responsePets);

        const usuarios = responseUsuarios.data;
        const pets = responsePets;

        const dadosForm = usuarios.map((user) => {
          const petsDoUsuario = pets.filter(
            (pet) => pet.user_cpf === user.cpf
          );

          return {
            id: user.cpf,
            nome: user.name,
            cpf: user.cpf,
            email: user.email,
            telefone: user.contacts?.[0]?.number || "--",
            endereco: user.addresses?.[0]?.location.split(",")[0]?.trim(),
            numero: user.addresses?.[0]?.complement,
            bairro: user.addresses?.[0]?.location.split(",")[1]?.trim(),
            cep: user.addresses?.[0]?.cep,
            cidade: user.addresses?.[0]?.location.split(",")[2]?.trim() || "--",
            estado: user.addresses?.[0]?.location.split(",")[3]?.trim() || "--",
            pets: petsDoUsuario.map((pet) => ({
              nome: pet.name,
              tipo: pet.species,
              raca: pet.breed,
            })),
          };
        });

        if (Array.isArray(usuarios) && usuarios.length > 0) {
          setClientes(dadosForm);
        } else {
          setClientes([]);
        }
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        setClientes([]);
      }
    };

    carregar();
  }, []);

  const abrirModal = (cliente) => {
    setClienteSelecionado(cliente);
    setClienteEditando({ ...cliente });
    setModoEdicao(false);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
  };

  const abrirConfirmacaoExclusao = (cliente) => {
    setClienteParaExcluir(cliente);
    setConfirmDeleteOpen(true);
  };

  const fecharConfirmacaoExclusao = () => {
    setClienteParaExcluir(null);
    setConfirmDeleteOpen(false);
  };

  const alterarCampo = (campo, valor) => {
    setClienteEditando({
      ...clienteEditando,
      [campo]: valor,
    });
  };

  const salvarEdicao = async () => {
    const body = {
      name: clienteEditando.nome,
      email: clienteEditando.email,
      contact: {
        name: clienteEditando.nome,
        number: clienteEditando.telefone,
      },
      address: {
        type: "Casa",
        cep: clienteEditando.cep?.replace(/\D/g, ""),
        location: `${clienteEditando.endereco}, ${clienteEditando.bairro}, ${clienteEditando.cidade}, ${clienteEditando.estado}`,
        complement: clienteEditando.numero,
      },
    };

    try {
      await userService.updateUser(clienteEditando.cpf, body);
      setClientes(
        clientes.map((c) => (c.id === clienteEditando.id ? clienteEditando : c))
      );
      setClienteSelecionado(clienteEditando);
      setModoEdicao(false);
      alert("Cliente atualizado com sucesso!");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao atualizar cliente.");
    }
  };

  const confirmarExclusaoCliente = async () => {
    if (!clienteParaExcluir) return;

    try {
      await userService.deleteUser(clienteParaExcluir.id);
      setClientes(clientes.filter((c) => c.id !== clienteParaExcluir.id));
      fecharConfirmacaoExclusao();
      fecharModal();
      alert("Cliente excluído com sucesso!");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao excluir cliente.");
    }
  };

  const cidadesUnicas = [...new Set(clientes.map((c) => c.cidade))].sort();
  const estadosUnicos = [...new Set(clientes.map((c) => c.estado))].sort();

  const filteredClientes = clientes.filter((cliente) => {
    const termo = search.toLowerCase();

    return (
      (cliente.nome.toLowerCase().includes(termo) ||
        cliente.cpf.toLowerCase().includes(termo) ||
        (cliente.email && cliente.email.toLowerCase().includes(termo))) &&
      (cidadeFiltro === "" || cliente.cidade === cidadeFiltro) &&
      (estadoFiltro === "" || cliente.estado === estadoFiltro)
    );
  });

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        minHeight: "58px",
        background: "linear-gradient(90deg, #3370eb 0%, #2457bd 100%)",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        borderBottom: "none",
      },
    },
    headCells: {
      style: {
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.4px",
      },
    },
    rows: {
      style: {
        minHeight: "68px",
        fontSize: "14px",
        color: "#1f2937",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eef2ff",
        transition: "all 0.2s ease",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f8fbff",
        cursor: "pointer",
      },
    },
    cells: {
      style: {
        paddingTop: "14px",
        paddingBottom: "14px",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #eef2ff",
        minHeight: "64px",
        fontSize: "14px",
      },
      pageButtonsStyle: {
        borderRadius: "10px",
        height: "36px",
        width: "36px",
        padding: "8px",
        margin: "0 4px",
        cursor: "pointer",
        transition: "0.2s ease",
        color: "#3370eb",
        fill: "#3370eb",
        backgroundColor: "#f4f8ff",
        "&:hover:not(:disabled)": {
          backgroundColor: "#F9EE7C",
        },
        "&:disabled": {
          opacity: 0.4,
        },
      },
    },
    expandableRow: {
      style: {
        backgroundColor: "#f8fbff",
      },
    },
  };

  const columns = useMemo(
    () => [
      {
        name: "Cliente",
        sortable: true,
        grow: 1.5,
        cell: (row) => (
          <div className="cell-cliente">
            <div className="cliente-avatar">
              <FiUser size={16} />
            </div>

            <div className="cliente-main-info">
              <span className="cliente-nome-cell">{row.nome}</span>
              <span className="cliente-cpf-cell">{row.cpf}</span>
            </div>
          </div>
        ),
      },
      {
        name: "Contato",
        grow: 1.6,
        cell: (row) => (
          <div className="cell-contato">
            <span>
              <FiMail size={14} /> {row.email}
            </span>
            <span>
              <FiPhone size={14} /> {row.telefone}
            </span>
          </div>
        ),
      },
      {
        name: "Cidade",
        sortable: true,
        cell: (row) => (
          <span className="badge-local">
            <FiMapPin size={13} /> {row.cidade}
          </span>
        ),
      },
      {
        name: "UF",
        center: true,
        width: "120px",
        cell: (row) => <span className="badge-estado">{row.estado}</span>,
      },
      {
        name: "Pets",
        center: true,
        width: "110px",
        sortable: true,
        selector: (row) => row.pets?.length || 0,
        cell: (row) => (
          <span className="pet-count">
            <img src={pawCatIcon} alt="pets" className="icon-pet-table" />
            {row.pets?.length || 0}
          </span>
        ),
      },
      {
        name: "Ações",
        center: true,
        width: "150px",
        cell: (row) => (
          <button className="btn-ver" onClick={() => abrirModal(row)}>
            <FiEye size={15} />
            Ver cliente
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="clientes-container">
      <h1 className="titulo-clientes">Gerenciamento de Clientes</h1>

      <div className="table-toolbar">
        <div className="search-box-professional">
          <FiSearch className="search-box-icon" />
          <input
            type="text"
            placeholder="Buscar cliente por nome, CPF ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-big"
          />
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <label>Cidade</label>
            <select
              value={cidadeFiltro}
              onChange={(e) => setCidadeFiltro(e.target.value)}
            >
              <option value="">Todas</option>
              {cidadesUnicas.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group filter-uf">
            <label>UF</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              {estadosUnicos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-top">
          <div>
            <h2>Lista de clientes</h2>
            <p>{filteredClientes.length} cliente(s) encontrado(s)</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredClientes}
          pagination
          highlightOnHover
          responsive
          persistTableHead
          noDataComponent={
            <div className="empty-table">
              Nenhum cliente encontrado com os filtros informados.
            </div>
          }
          customStyles={customStyles}
          expandableRows
          expandableRowsComponent={PetsExpand}
        />
      </div>

      {modalOpen && clienteSelecionado && (
        <div className="modal-overlay">
          <div className="modal-cliente">
            <button className="modal-close" onClick={fecharModal}>
              ✕
            </button>

            <div className="modal-header-custom">
              <div className="modal-avatar">
                <FiUser size={24} />
              </div>

              <div>
                <h2>{clienteSelecionado.nome}</h2>
                <p>Visualização de cadastro do cliente</p>
              </div>
            </div>

            <div className="modal-grid-custom">
              <div className="info-box">
                <label>CPF</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.cpf}
                    onChange={(e) => alterarCampo("cpf", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.cpf}</span>
                )}
              </div>

              <div className="info-box">
                <label>Telefone</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.telefone}
                    onChange={(e) => alterarCampo("telefone", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.telefone}</span>
                )}
              </div>

              <div className="info-box info-box-full">
                <label>Email</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.email}
                    onChange={(e) => alterarCampo("email", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.email}</span>
                )}
              </div>

              <div className="info-box">
                <label>Endereço</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.endereco}
                    onChange={(e) => alterarCampo("endereco", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.endereco}</span>
                )}
              </div>

              <div className="info-box">
                <label>Número</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.numero}
                    onChange={(e) => alterarCampo("numero", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.numero}</span>
                )}
              </div>

              <div className="info-box">
                <label>Bairro</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.bairro}
                    onChange={(e) => alterarCampo("bairro", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.bairro}</span>
                )}
              </div>

              <div className="info-box">
                <label>Cidade</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.cidade}
                    onChange={(e) => alterarCampo("cidade", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.cidade}</span>
                )}
              </div>

              <div className="info-box">
                <label>Estado</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.estado}
                    onChange={(e) => alterarCampo("estado", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.estado}</span>
                )}
              </div>

              <div className="info-box">
                <label>CEP</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.cep}
                    onChange={(e) => alterarCampo("cep", e.target.value)}
                  />
                ) : (
                  <span>{clienteSelecionado.cep}</span>
                )}
              </div>
            </div>

            <div className="pets-section-custom">
              <div className="pets-section-title">🐾 Pets do Cliente</div>

              {clienteSelecionado.pets?.length ? (
                <div className="pets-list-grid">
                  {clienteSelecionado.pets.map((pet, index) => (
                    <div className="pet-card-modal" key={index}>
                      <strong>{pet.nome}</strong>
                      <span>{pet.tipo}</span>
                      <small>{pet.raca}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-pets-text">Nenhum pet cadastrado</p>
              )}
            </div>

            <div className="modal-buttons">
              {modoEdicao ? (
                <button className="btn-salvar" onClick={salvarEdicao}>
                  Salvar
                </button>
              ) : (
                <button
                  className="btn-editar"
                  onClick={() => setModoEdicao(true)}
                >
                  Editar
                </button>
              )}

              <button
                className="btn-excluir"
                onClick={() => abrirConfirmacaoExclusao(clienteSelecionado)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteOpen && clienteParaExcluir && (
        <div className="modal-overlay">
          <div className="modal-confirm-delete">
            <button
              className="modal-close"
              onClick={fecharConfirmacaoExclusao}
            >
              ✕
            </button>

            <div className="confirm-delete-icon">🐾</div>

            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir o cliente{" "}
              <strong>{clienteParaExcluir.nome}</strong>?
            </p>
            <span className="confirm-delete-warning">
              Essa ação não poderá ser desfeita.
            </span>

            <div className="confirm-delete-buttons">
              <button
                className="btn-cancelar-exclusao"
                onClick={fecharConfirmacaoExclusao}
              >
                Cancelar
              </button>

              <button
                className="btn-confirmar-exclusao"
                onClick={confirmarExclusaoCliente}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;