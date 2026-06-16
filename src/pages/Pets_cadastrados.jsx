import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";

import { useNavigate } from "react-router-dom";
import "../styles/petsRegistrados.css";
import PetImg from "../assets/images/cao.png";
import PetImg2 from "../assets/images/gato.png";
import petService from "../services/petService";
import { userService } from "../services/userService";
import LoadingScreen from "../components/LoadingScreen";
import AdminSidebar from "../components/AdminSidebar";
import { FiSearch, FiCalendar, FiTag, FiPlus, FiEye, FiEdit2 } from "react-icons/fi";

const ExpandedPetInfo = ({ data }) => {
  return (
    <div className="pet-expand">
      <div className="pet-expand-header">
        <FiTag size={16} />
        Detalhes do pet
      </div>

      <div className="pet-expand-grid">
        <div className="pet-expand-card">
          <label>Observação</label>
          <span>{data.observations || "Nenhuma observação cadastrada"}</span>
        </div>

        <div className="pet-expand-card">
          <label>Data de nascimento</label>
          <span>{data.birth_date || "Não informada"}</span>
        </div>

        <div className="pet-expand-card">
          <label>Nome do dono</label>
          <span>{data.owner_name || "Não informado"}</span>
        </div>
      </div>
    </div>
  );
};

export const traduzirPorte = (size) => {
  switch (size) {
    case "S":
      return "Pequeno";
    case "M":
      return "Médio";
    case "L":
      return "Grande";
    case "XL":
      return "Gigante"
    default:
      return size;
  }
};

export const traduzirSRD = (breed) => {
  switch (breed) {
    case "SRD":
      return "Não informado"
    default:
      return breed;
  }
}

export const traduzirSexo = (sex) => {
  switch (sex) {
    case "F":
      return "Fêmea";

    case "M":
      return "Macho";

    default:
      return sex || "—";
  }
};

const formatarData = (data) => {
  if (!data) return "";
  return new Date(data).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
};

const Pets_cadastrados = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isDev = localStorage.getItem("isDev") === "true";
  const podeVerMenuAdmin = isAdmin || isDev;
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [especieFiltro, setEspecieFiltro] = useState("");
  const [porteFiltro, setPorteFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [petEditando, setPetEditando] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [petParaExcluir, setPetParaExcluir] = useState(null);
  const [modalFotoOpen, setModalFotoOpen] = useState(false);
  const [petFotoSelecionado, setPetFotoSelecionado] = useState(null);

  function abrirModalFoto(pet) {
    setPetFotoSelecionado(pet);
    setModalFotoOpen(true);
  }

  async function salvarFotoPet(base64) {
    try {
      if (base64) {
        await petService.atualizar(petFotoSelecionado.id, { petPicture: base64 });
        setPets((prev) =>
          prev.map((p) => p.id === petFotoSelecionado.id ? { ...p, photo: base64 } : p)
        );
        setPetFotoSelecionado((prev) => ({ ...prev, photo: base64 }));
      } else {
        await petService.removerFoto(petFotoSelecionado.id); // 👈 DELETE direto
        setPets((prev) =>
          prev.map((p) => p.id === petFotoSelecionado.id ? { ...p, photo: null } : p)
        );
        setModalFotoOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao salvar foto.");
    }
  }

  function abrirConfirmacaoExclusao(pet) {
    setPetParaExcluir(pet);
    setConfirmDeleteOpen(true);
  }

  function fecharConfirmacaoExclusao() {
    setPetParaExcluir(null);
    setConfirmDeleteOpen(false);
  }

  async function confirmarExclusao() {
    if (!petParaExcluir) return;
    try {
      await petService.deletar(petParaExcluir.id);
      setPets((prev) => prev.filter((p) => p.id !== petParaExcluir.id));
      fecharConfirmacaoExclusao();
      fecharModal();
      alert("Pet excluído com sucesso!");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao excluir pet.");
    }
  }

  function abrirModal(pet) {
    setPetSelecionado(pet);
    setPetEditando({ ...pet, birth_date: pet.birth_date_raw });
    setModoEdicao(false);
    setModalOpen(true);
  }

  function fecharModal() {
    setModalOpen(false);
  }

  function alterarCampo(campo, valor) {
    setPetEditando((prev) => ({ ...prev, [campo]: valor }));
  }

  async function salvarEdicao() {
    try {
      const bodyPet = {
        name: petEditando.name,
        species: petEditando.species === "Cachorro" ? "dog" : petEditando.species === "Gato" ? "cat" : petEditando.species,
        breed: petEditando.breed === "Não informado" ? "SRD" : petEditando.breed,
        size: petEditando.size === "Pequeno" ? "S" : petEditando.size === "Médio" ? "M" : petEditando.size === "Grande" ? "L" : petEditando.size === "Gigante" ? "XL" : petEditando.size,
        weight:
          petEditando.weight &&
            petEditando.weight !== "Não informado"
            ? Number(
              String(petEditando.weight).replace(" kg", "")
            )
            : null,

        sex:
          petEditando.sex === "Fêmea"
            ? "F"
            : petEditando.sex === "Macho"
              ? "M"
              : null,
        observations: petEditando.observations || "",
        user_cpf: petEditando.user_cpf,
        birth_date: petEditando.birth_date
          ? new Date(petEditando.birth_date + "T00:00:00").toISOString()
          : null,
      };

      await petService.atualizar(petEditando.id, bodyPet);

      setPets((prev) =>
        prev.map((p) => p.id === petEditando.id
          ? {
            ...p,
            ...petEditando,
            birth_date: formatarData(petEditando.birth_date),
            birth_date_raw: petEditando.birth_date,
          }
          : p
        )
      );
      setPetSelecionado((prev) => ({
        ...prev,
        ...petEditando,
        birth_date: formatarData(petEditando.birth_date),
      }));
      setModoEdicao(false);
      alert("Pet atualizado com sucesso!");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao atualizar pet.");
    }
  }

  useEffect(() => {
    const carregar = async () => {
      try {
        let dados = [];
        let allUsers = [];

        if (isAdmin) {
          dados = await petService.listar();

          const usersRes = await userService.listUsers();
          allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];

          setUsers(allUsers);
        } else {
          dados = await petService.listar_meus_pets();
        }

        if (Array.isArray(dados) && dados.length > 0) {
          const petsFormatados = dados.map((pet) => {
            const dono = allUsers.find((u) => u.cpf === pet.user_cpf);

            return {
              id: pet.id,
              name: pet.name,
              species: pet.species,
              breed: traduzirSRD(pet.breed),
              size: traduzirPorte(pet.size),
              weight:
                pet.weight !== null &&
                  pet.weight !== undefined &&
                  pet.weight !== ""
                  ? `${pet.weight} kg`
                  : "—",

              birth_date: formatarData(pet.birth_date),

              birth_date_raw: pet.birth_date
                ? pet.birth_date.split("T")[0]
                : "",

              sex: traduzirSexo(pet.sex),
              observations: pet.observations,
              user_cpf: pet.user_cpf,
              owner_name: dono?.name || localStorage.getItem("userName") || "Não informado",
              photo: pet.petPicture || "",
            };
          });

          setPets(petsFormatados);
        } else {
          setPets([]);
        }
      } catch (err) {
        console.error("Erro ao carregar pets:", err);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [isAdmin]);

  const filteredPets = pets.filter((pet) => {
    const termo = search.toLowerCase();

    const name = pet.name?.toLowerCase() || "";
    const species = pet.species?.toLowerCase() || "";
    const breed = pet.breed?.toLowerCase() || "";
    const size = pet.size?.toLowerCase() || "";
    const weight = String(pet.weight || "").toLowerCase();
    const sex = pet.sex?.toLowerCase() || "";
    const observations = pet.observations?.toLowerCase() || "";
    const ownerName = pet.owner_name?.toLowerCase() || "";
    const birthDate = pet.birth_date?.toLowerCase() || "";

    return (
      (name.includes(termo) ||
        species.includes(termo) ||
        breed.includes(termo) ||
        size.includes(termo) ||
        weight.includes(termo) ||
        sex.includes(termo) ||
        observations.includes(termo) ||
        ownerName.includes(termo) ||
        birthDate.includes(termo)) &&
      (especieFiltro === "" || pet.species === especieFiltro) &&
      (porteFiltro === "" || pet.size === porteFiltro)
    );
  });

  const especiesUnicas = [...new Set(pets.map((p) => p.species).filter(Boolean))].sort();
  const portesUnicos = [...new Set(pets.map((p) => p.size).filter(Boolean))].sort();

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
        minHeight: "72px",
        fontSize: "14px",
        color: "#1f2937",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eef2ff",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f8fbff",
        cursor: "pointer",
        transition: "0.2s ease",
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
        name: "Pet",
        sortable: true,
        grow: 1.6,
        minWidth: "280px",
        cell: (row) => {
          const isDog =
            row.species?.toLowerCase() === "cachorro" ||
            row.species?.toLowerCase() === "dog";

          return (
            <div className="pet-main-cell">
              <div
                className="pet-avatar"
                style={{ cursor: "pointer", position: "relative" }}
                onClick={(e) => { e.stopPropagation(); abrirModalFoto(row); }}
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector(".pet-avatar-hover");
                  if (overlay) overlay.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector(".pet-avatar-hover");
                  if (overlay) overlay.style.opacity = 0;
                }}
              >
                <img
                  src={row.photo || (isDog ? PetImg : PetImg2)}
                  alt={row.name}
                  className={row.photo ? "pet-avatar-img pet-avatar-foto" : "pet-avatar-img"}
                />
                <div
                  className="pet-avatar-hover"
                  style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 14, opacity: 0, transition: "opacity 0.2s",
                    fontSize: 10, fontWeight: 800, color: "#fff", textAlign: "center",
                    padding: 4,
                  }}
                >
                  <FiEdit2 size={16} color="#fff" />
                </div>
              </div>

              <div className="pet-main-info">
                <span className="pet-name-cell">{row.name}</span>
                <span className="pet-owner-cell">Dono: {row.owner_name}</span>
              </div>
            </div>
          );
        },
      },
      {
        name: "Espécie / Raça",
        grow: 1.3,
        minWidth: "210px",
        cell: (row) => (
          <div className="pet-stack-cell">
            <span className="pet-species-badge">{row.species}</span>
            <span className="pet-secondary-text">{row.breed}</span>
          </div>
        ),
      },
      {
        name: "Porte",
        center: true,
        width: "120px",
        cell: (row) => <span className="badge-size">{row.size}</span>,
      },
      {
        name: "Peso",
        center: true,
        width: "110px",
        selector: (row) => row.weight,
        cell: (row) => <span className="badge-weight">{row.weight}</span>,
      },
      {
        name: "Sexo",
        center: true,
        width: "140px",
        cell: (row) => {
          const sexo = row.sex || "Não informado";

          const classeSexo =
            sexo === "Fêmea"
              ? "female"
              : sexo === "Macho"
                ? "male"
                : "";

          return (
            <span className={`badge-sex ${classeSexo}`}>
              {sexo}
            </span>
          );
        },
      },
      {
        name: "Nascimento",
        center: true,
        width: "170px",
        cell: (row) => (
          <span className="birth-cell">
            <FiCalendar size={14} />
            {row.birth_date || "--/--/----"}
          </span>
        ),
      },
      {
        name: "Ações",
        center: true,
        width: "120px",
        cell: (row) => (
          <button className="btn-ver" onClick={() => abrirModal(row)}>
            <FiEye size={15} />
            Ver
          </button>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <LoadingScreen
        title="Carregando pets"
        subtitle="Estamos organizando a lista de pets cadastrados."
      />
    );
  }


  return (
    <>
      {podeVerMenuAdmin && <AdminSidebar />}

      <div
        className={`petsReg-container ${podeVerMenuAdmin
          ? "petsReg-container-admin"
          : "petsReg-container-cliente"
          }`}
      >
        <h1 className="petsReg-title">Pets registrados</h1>

        <div className="pets-toolbar">
          <div className="pets-search-box">
            <FiSearch className="pets-search-icon-modern" />
            <input
              type="text"
              placeholder="Buscar por nome do pet, nome do dono, espécie, raça..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pets-search-input-modern"
            />
          </div>

          <div className="pets-toolbar-right">
            <div className="pets-filters">
              <div className="pets-filter-group">
                <label>Espécie</label>
                <select
                  value={especieFiltro}
                  onChange={(e) => setEspecieFiltro(e.target.value)}
                >
                  <option value="">Todas</option>
                  {especiesUnicas.map((especie) => (
                    <option key={especie} value={especie}>
                      {especie}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pets-filter-group pets-filter-small">
                <label>Porte</label>
                <select
                  value={porteFiltro}
                  onChange={(e) => setPorteFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  {portesUnicos.map((porte) => (
                    <option key={porte} value={porte}>
                      {porte}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn-add-pet-table"
              onClick={() => navigate("/pets?novo=true")}
            >
              <FiPlus size={18} />
              Cadastrar novo pet
            </button>
          </div>
        </div>

        <div className="pets-table-card">
          <div className="pets-table-top">
            <div>
              <h2>Lista de pets</h2>
              <p>{filteredPets.length} pet(s) encontrado(s)</p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredPets}
            pagination
            responsive
            highlightOnHover
            persistTableHead
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={ExpandedPetInfo}
            noDataComponent={
              <div className="pets-empty-table">
                Nenhum pet encontrado com os filtros informados.
              </div>
            }
          />
        </div>
      </div>

      {modalOpen && petSelecionado && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-cliente" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharModal}>✕</button>

            <div className="modal-header-custom">
              <div style={{ width: 58, height: 58, borderRadius: 18, overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #eef4ff 0%, #dce8ff 100%)", border: "1px solid #dbe7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={petSelecionado.photo || (petSelecionado.species?.toLowerCase().includes("cachorro") ? PetImg : PetImg2)}
                  alt={petSelecionado.name}
                  style={{ width: petSelecionado.photo ? "100%" : "38px", height: petSelecionado.photo ? "100%" : "38px", objectFit: petSelecionado.photo ? "cover" : "contain", borderRadius: 18 }}
                />
              </div>
              <div>
                <h2>{petSelecionado.name}</h2>
                <p>Dono: {petSelecionado.owner_name}</p>
              </div>
            </div>

            <div className="modal-grid-custom">
              <div className="info-box">
                <label>Nome</label>
                {modoEdicao
                  ? <input value={petEditando.name} onChange={(e) => alterarCampo("name", e.target.value)} />
                  : <span>{petSelecionado.name}</span>}
              </div>

              <div className="info-box">
                <label>Espécie</label>
                {modoEdicao
                  ? <select value={petEditando.species} onChange={(e) => alterarCampo("species", e.target.value)}>
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                  </select>
                  : <span>{petSelecionado.species}</span>}
              </div>

              <div className="info-box">
                <label>Raça</label>
                {modoEdicao
                  ? <input value={petEditando.breed} onChange={(e) => alterarCampo("breed", e.target.value)} />
                  : <span>{petSelecionado.breed}</span>}
              </div>

              <div className="info-box">
                <label>Porte</label>
                {modoEdicao
                  ? <select value={petEditando.size} onChange={(e) => alterarCampo("size", e.target.value)}>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                    <option value="Gigante">Gigante</option>
                  </select>
                  : <span>{petSelecionado.size}</span>}
              </div>

              <div className="info-box">
                <label>Peso</label>
                {modoEdicao ? (
                  <input
                    type="number"
                    value={
                      petEditando.weight === "Não informado"
                        ? ""
                        : String(petEditando.weight || "").replace(" kg", "")
                    }
                    onChange={(e) =>
                      alterarCampo("weight", e.target.value)
                    }
                    placeholder="Não informado"
                  />
                ) : (
                  <span>
                    {petSelecionado.weight || "Não informado"}
                  </span>
                )}
              </div>

              <div className="info-box">
                <label>Sexo</label>

                {modoEdicao ? (
                  <select
                    value={
                      petEditando.sex === "Não informado"
                        ? ""
                        : petEditando.sex || ""
                    }
                    onChange={(e) =>
                      alterarCampo("sex", e.target.value)
                    }
                  >
                    <option value="">Não informado</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                ) : (
                  <span>
                    {petSelecionado.sex || "Não informado"}
                  </span>
                )}
              </div>
              <div className="info-box">
                <label>Data de nascimento</label>
                {modoEdicao
                  ? <input
                    type="date"
                    value={petEditando.birth_date || ""}
                    onChange={(e) => alterarCampo("birth_date", e.target.value)}
                  />
                  : <span>{petSelecionado.birth_date || "Não informada"}</span>}
              </div>

              <div className="info-box info-box-full">
                <label>Observações</label>
                {modoEdicao
                  ? <input value={petEditando.observations || ""} onChange={(e) => alterarCampo("observations", e.target.value)} />
                  : <span>{petSelecionado.observations || "Nenhuma observação"}</span>}
              </div>


            </div>

            <div className="modal-buttons">
              {modoEdicao
                ? <button className="btn-salvar" onClick={salvarEdicao}>Salvar</button>
                : <button className="btn-editar" onClick={() => setModoEdicao(true)}>Editar</button>
              }
              <button className="btn-excluir" onClick={() => abrirConfirmacaoExclusao(petSelecionado)}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteOpen && petParaExcluir && (
        <div className="modal-overlay">
          <div className="modal-confirm-delete">
            <button className="modal-close" onClick={fecharConfirmacaoExclusao}>✕</button>

            <div className="confirm-delete-icon">🐾</div>

            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir o pet{" "}
              <strong>{petParaExcluir.name}</strong>?
            </p>
            <span className="confirm-delete-warning">
              Essa ação não poderá ser desfeita.
            </span>

            <div className="confirm-delete-buttons">
              <button className="btn-cancelar-exclusao" onClick={fecharConfirmacaoExclusao}>
                Cancelar
              </button>
              <button className="btn-confirmar-exclusao" onClick={confirmarExclusao}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {modalFotoOpen && petFotoSelecionado && (
        <div className="modal-overlay" onClick={() => setModalFotoOpen(false)}>
          <div className="modal-confirm-delete" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalFotoOpen(false)}>✕</button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 90, height: 90, borderRadius: 18, overflow: "hidden", background: "linear-gradient(135deg, #eef4ff 0%, #dce8ff 100%)", border: "1px solid #dbe7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {petFotoSelecionado.photo
                  ? <img src={petFotoSelecionado.photo} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <img
                    src={petSelecionado.species?.toLowerCase().includes("cachorro") ? PetImg : PetImg2}
                    alt="pet"
                    style={{ width: 38, height: 38, objectFit: "contain" }}
                  />
                }
              </div>

              <strong style={{ color: "#1f3d7a", fontSize: 16 }}>{petFotoSelecionado.name}</strong>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-editar"
                  style={{ padding: "8px 16px", fontSize: 13, minWidth: "unset", height: "auto" }}
                  onClick={() => document.getElementById("foto-input-mini").click()}
                >
                  {petFotoSelecionado.photo ? "Trocar foto" : "Adicionar foto"}
                </button>

                {petFotoSelecionado.photo && (
                  <button
                    className="btn-excluir"
                    style={{ padding: "8px 16px", fontSize: 13, minWidth: "unset", height: "auto" }}
                    onClick={() => salvarFotoPet("")}
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <input
              id="foto-input-mini"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => salvarFotoPet(reader.result);
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Pets_cadastrados;