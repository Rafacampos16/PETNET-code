import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import pawCatIcon from "../assets/icons/paw-cat.png";
import petClienteIcon from "../assets/icons/pet-cliente.png";
import LoadingScreen from "../components/LoadingScreen";
import AdminSidebar from "../components/AdminSidebar";

import {
  FiSearch,
  FiEye,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiEdit2,
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
  const [loading, setLoading] = useState(true);
  const [tipoUsuarioFiltro, setTipoUsuarioFiltro] = useState("");
  const navigate = useNavigate();
  const [modalFotoOpen, setModalFotoOpen] = useState(false);
  const [clienteFotoSelecionado, setClienteFotoSelecionado] = useState(null);

  function abrirModalFoto(cliente) {
    setClienteFotoSelecionado(cliente);
    setModalFotoOpen(true);
  }

  async function salvarFotoCliente(base64) {
    try {
      if (base64) {
        await userService.updateUser(clienteFotoSelecionado.cpf, {
          name: clienteFotoSelecionado.nome,
          userPicture: base64,
        });
        setClientes((prev) =>
          prev.map((c) => c.cpf === clienteFotoSelecionado.cpf ? { ...c, photo: base64 } : c)
        );
        setClienteFotoSelecionado((prev) => ({ ...prev, photo: base64 }));
      } else {
        await userService.removerFoto(clienteFotoSelecionado.cpf); // 👈 DELETE direto
        setClientes((prev) =>
          prev.map((c) => c.cpf === clienteFotoSelecionado.cpf ? { ...c, photo: null } : c)
        );
        setModalFotoOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao salvar foto.");
    }
  }
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
            tipo: user.type || "Cliente",
            telefone: user.contacts?.[0]?.number || "--",
            endereco: user.addresses?.[0]?.address,
            numero: user.addresses?.[0]?.number,
            bairro: user.addresses?.[0]?.neighborhood,
            cep: user.addresses?.[0]?.cep,
            localizacao: user.addresses?.[0]?.locaticion || "",
            contacts: user.contacts || [],
            addresses: user.addresses || [],
            photo: user.userPicture || null,
            ativo: user.active !== false,
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
      } finally {
        setLoading(false);
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
    const telefoneEditado = clienteEditando.telefone && clienteEditando.telefone !== "--"
      ? clienteEditando.telefone
      : null;

    const contactsOriginais = clienteEditando.contacts ? [...clienteEditando.contacts] : [];
    if (telefoneEditado) {
      if (contactsOriginais.length > 0) {
        contactsOriginais[0] = { ...contactsOriginais[0], number: telefoneEditado };
      } else {
        contactsOriginais.push({ name: "Principal", number: telefoneEditado });
      }
    }

    const addressesOriginais = clienteEditando.addresses ? [...clienteEditando.addresses] : [];
    if (clienteEditando.endereco || clienteEditando.cep) {
      const addrAtualizado = {
        type: addressesOriginais[0]?.type || "Casa",
        cep: clienteEditando.cep,
        address: clienteEditando.endereco,
        number: clienteEditando.numero,
        neighborhood: clienteEditando.bairro,
        locaticion: clienteEditando.localizacao || "",
      };
      if (addressesOriginais.length > 0) {
        addressesOriginais[0] = { ...addressesOriginais[0], ...addrAtualizado };
      } else {
        addressesOriginais.push(addrAtualizado);
      }
    }

    const body = {
      name: clienteEditando.nome,
      email: clienteEditando.email,
      type: clienteEditando.tipo,
      contact: contactsOriginais.length > 0 ? contactsOriginais : undefined,
      address: addressesOriginais.length > 0 ? addressesOriginais : undefined,
    };

    try {
      await userService.updateUser(clienteEditando.cpf, body);
      const clienteAtualizado = {
        ...clienteEditando,
        contacts: contactsOriginais,
        addresses: addressesOriginais,
      };
      setClientes(
        clientes.map((c) => (c.id === clienteEditando.id ? clienteAtualizado : c))
      );
      setClienteSelecionado(clienteAtualizado);
      setClienteEditando(clienteAtualizado);
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

  const normalizarTipoUsuario = (tipo = "") => {
    const tipoLower = tipo.toLowerCase();

    if (tipoLower === "manager" || tipoLower === "gerente") {
      return "Gerente";
    }

    if (tipoLower === "collaborator" || tipoLower === "colaborador") {
      return "Colaborador";
    }

    return "Cliente";
  };

  const filteredClientes = clientes.filter((cliente) => {
    const termo = search.toLowerCase();
    const tipoNormalizado = normalizarTipoUsuario(cliente.tipo);

    return (
      (cliente.nome.toLowerCase().includes(termo) ||
        cliente.cpf.toLowerCase().includes(termo) ||
        (cliente.email && cliente.email.toLowerCase().includes(termo))) &&
      (tipoUsuarioFiltro === "" || tipoNormalizado === tipoUsuarioFiltro) &&
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

  const alternarStatusUsuario = async (usuario) => {
    const novoStatus = !usuario.ativo;

    try {
      await userService.updateUser(usuario.cpf, {
        active: novoStatus,
      });

      setClientes((prev) =>
        prev.map((item) =>
          item.cpf === usuario.cpf
            ? {
              ...item,
              ativo: novoStatus,
            }
            : item
        )
      );

      alert(novoStatus ? "Usuário ativado com sucesso!" : "Usuário desativado com sucesso!");
    } catch (err) {
      console.error("Erro ao alterar status do usuário:", err);
      alert(err.response?.data?.error || "Erro ao alterar status do usuário.");
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Cliente",
        sortable: true,
        grow: 1.5,
        minWidth: "200px",
        cell: (row) => (
          <div className="cell-cliente">
            <div
              className="cliente-avatar"
              style={{ cursor: "pointer", position: "relative" }}
              onClick={(e) => { e.stopPropagation(); abrirModalFoto(row); }}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector(".cliente-avatar-hover");
                if (overlay) overlay.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector(".cliente-avatar-hover");
                if (overlay) overlay.style.opacity = 0;
              }}
            >
              {row.photo
                ? <img src={row.photo} alt={row.nome} className="cliente-avatar-img" />
                : <FiUser size={16} />
              }
              <div
                className="cliente-avatar-hover"
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 12, opacity: 0, transition: "opacity 0.2s",
                }}
              >
                <FiEdit2 size={12} color="#fff" />
              </div>
            </div>

            <div className="cliente-main-info">
              <span className="cliente-nome-cell">{row.nome}</span>
              <span className="cliente-cpf-cell">{row.cpf}</span>
            </div>
          </div>
        ),
      },
      {
        name: "Tipo",
        center: true,
        width: "150px",
        sortable: true,
        selector: (row) => normalizarTipoUsuario(row.tipo),
        cell: (row) => (
          <span className={`badge-tipo badge-${normalizarTipoUsuario(row.tipo).toLowerCase()}`}>
            {normalizarTipoUsuario(row.tipo)}
          </span>
        ),
      },
      {
        name: "Status",
        center: true,
        width: "130px",
        sortable: true,
        selector: (row) => (row.ativo ? "Ativo" : "Inativo"),
        cell: (row) => (
          <span className={`badge-status-usuario ${row.ativo ? "ativo" : "inativo"}`}>
            {row.ativo ? "Ativo" : "Inativo"}
          </span>
        ),
      },
      {
        name: "Contato",
        grow: 1.6,
        minWidth: "210px",
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
        width: "230px",
        cell: (row) => (
          <div className="acoes-usuario-table">
            <button className="btn-ver" onClick={() => abrirModal(row)}>
              <FiEye size={15} />
              Ver
            </button>


          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <LoadingScreen
        title="Carregando clientes"
        subtitle="Estamos organizando a lista de clientes cadastrados."
      />
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="clientes-container">
        <h1 className="titulo-clientes">Gerenciamento de Usuários</h1>

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
              <label>Tipo de usuário</label>
              <select
                value={tipoUsuarioFiltro}
                onChange={(e) => setTipoUsuarioFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Cliente">Clientes</option>
                <option value="Colaborador">Colaboradores</option>
                <option value="Gerente">Gerentes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-card-top">
            <div>
              <h2>Lista de usuários</h2>
              <p>{filteredClientes.length} usuário(s) encontrado(s)</p>
            </div>

            <button
              type="button"
              className="btn-novo-usuario"
              onClick={() => navigate("/admin/usuarios/novo")}
            >
              + Novo usuário
            </button>
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
                Nenhum usuário encontrado com os filtros informados.
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
                  {clienteSelecionado.photo
                    ? <img src={clienteSelecionado.photo} alt={clienteSelecionado.nome} className="modal-avatar-img" />
                    : <FiUser size={24} />
                  }
                </div>

                <div>
                  <h2>{clienteSelecionado.nome}</h2>

                  <p>CPF: {clienteSelecionado.cpf}</p>


                </div>
              </div>

              <div className="modal-grid-custom">
                <div className="info-box">
                  <label>Nome</label>
                  {modoEdicao ? (
                    <input
                      value={clienteEditando.nome}
                      onChange={(e) => alterarCampo("nome", e.target.value)}
                    />
                  ) : (
                    <span>{clienteSelecionado.nome}</span>
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
                <div className="pets-section-title">Pets do Usuário</div>

                {clienteSelecionado.pets?.length ? (
                  <div className="pets-list-grid">
                    {clienteSelecionado.pets.map((pet, index) => (
                      <div className="pet-card-modal" key={index}>
                        <strong>{pet.nome}</strong>
                        <span>{pet.tipo}</span>
                        <small>{pet.raca === "SRD" ? "Não informado" : pet.raca}</small>
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
      {modalFotoOpen && clienteFotoSelecionado && (
        <div className="modal-overlay" onClick={() => setModalFotoOpen(false)}>
          <div className="modal-confirm-delete" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalFotoOpen(false)}>✕</button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 90, height: 90, borderRadius: 18, overflow: "hidden", background: "linear-gradient(135deg, #3370eb 0%, #5f8ef0 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {clienteFotoSelecionado.photo
                  ? <img src={clienteFotoSelecionado.photo} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <FiUser size={36} color="#fff" />
                }
              </div>

              <strong style={{ color: "#1f3d7a", fontSize: 16 }}>{clienteFotoSelecionado.nome}</strong>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-editar"
                  style={{ padding: "8px 16px", fontSize: 13, minWidth: "unset", height: "auto" }}
                  onClick={() => document.getElementById("cliente-foto-input").click()}
                >
                  {clienteFotoSelecionado.photo ? "Trocar foto" : "Adicionar foto"}
                </button>

                {clienteFotoSelecionado.photo && (
                  <button
                    className="btn-excluir"
                    style={{ padding: "8px 16px", fontSize: 13, minWidth: "unset", height: "auto" }}
                    onClick={() => salvarFotoCliente("")}
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <input
              id="cliente-foto-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => salvarFotoCliente(reader.result);
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Clientes;
