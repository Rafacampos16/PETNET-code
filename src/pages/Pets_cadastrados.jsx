import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { FiSearch, FiCalendar, FiUser, FiTag } from "react-icons/fi";
import "../styles/petsRegistrados.css";
import PetImg from "../assets/images/cao.png";
import PetImg2 from "../assets/images/gato.png";
import petService from "../services/petService";

const mockPets = [
  {
    id: 1,
    name: "Thor",
    species: "Cachorro",
    breed: "Golden Retriever",
    size: "Grande",
    weight: "32 kg",
    birth_date: "12/05/2020",
    sex: "Macho",
    observations: "Pet dócil e muito ativo. Gosta bastante de brincar.",
    user_cpf: "123.456.789-00",
    photo: "",
  },
  {
    id: 2,
    name: "Luna",
    species: "Gato",
    breed: "Siamês",
    size: "Pequeno",
    weight: "4 kg",
    birth_date: "03/09/2021",
    sex: "Fêmea",
    observations: "Mais assustada no início, mas se adapta rápido.",
    user_cpf: "123.456.789-00",
    photo: "",
  },
  {
    id: 3,
    name: "Rex",
    species: "Cachorro",
    breed: "Pastor Alemão",
    size: "Grande",
    weight: "35 kg",
    birth_date: "21/01/2019",
    sex: "Macho",
    observations: "Precisa de atenção com alimentação.",
    user_cpf: "987.654.321-00",
    photo: "",
  },
  {
    id: 4,
    name: "Mimi",
    species: "Gato",
    breed: "Persa",
    size: "Pequeno",
    weight: "5 kg",
    birth_date: "14/11/2022",
    sex: "Fêmea",
    observations: "",
    user_cpf: "222.333.444-55",
    photo: "",
  },
  {
    id: 5,
    name: "Mel",
    species: "Cachorro",
    breed: "Shih-Tzu",
    size: "Pequeno",
    weight: "7 kg",
    birth_date: "08/07/2021",
    sex: "Fêmea",
    observations: "Tem alergia a alguns produtos de banho.",
    user_cpf: "111.222.333-44",
    photo: "",
  },
];

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
          <label>CPF do dono</label>
          <span>{data.user_cpf || "Não informado"}</span>
        </div>
      </div>
    </div>
  );
};

const Pets_cadastrados = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [especieFiltro, setEspecieFiltro] = useState("");
  const [porteFiltro, setPorteFiltro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await petService.listar();

        if (Array.isArray(dados) && dados.length > 0) {
          setPets(dados);
        } else {
          setPets(mockPets);
        }
      } catch (err) {
        console.error("Erro ao carregar pets:", err);
        setPets(mockPets);
      }
    };

    carregar();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const termo = search.toLowerCase();

    const name = pet.name?.toLowerCase() || "";
    const species = pet.species?.toLowerCase() || "";
    const breed = pet.breed?.toLowerCase() || "";
    const size = pet.size?.toLowerCase() || "";
    const weight = String(pet.weight || "").toLowerCase();
    const sex = pet.sex?.toLowerCase() || "";
    const observations = pet.observations?.toLowerCase() || "";
    const user = pet.user_cpf?.toLowerCase() || "";
    const birthDate = pet.birth_date?.toLowerCase() || "";

    return (
      (name.includes(termo) ||
        species.includes(termo) ||
        breed.includes(termo) ||
        size.includes(termo) ||
        weight.includes(termo) ||
        sex.includes(termo) ||
        observations.includes(termo) ||
        user.includes(termo) ||
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
        cell: (row) => {
          const isDog =
            row.species?.toLowerCase() === "cachorro" ||
            row.species?.toLowerCase() === "dog";

          return (
            <div className="pet-main-cell">
              <div className="pet-avatar">
                <img
                  src={row.photo || (isDog ? PetImg : PetImg2)}
                  alt={row.name}
                  className="pet-avatar-img"
                />
              </div>

              <div className="pet-main-info">
                <span className="pet-name-cell">{row.name}</span>
                <span className="pet-owner-cell">Dono: {row.user_cpf}</span>
              </div>
            </div>
          );
        },
      },
      {
        name: "Espécie / Raça",
        grow: 1.3,
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
        width: "120px",
        cell: (row) => (
          <span className={`badge-sex ${row.sex?.toLowerCase() === "fêmea" ? "female" : "male"}`}>
            {row.sex}
          </span>
        ),
      },
      {
        name: "Nascimento",
        center: true,
        width: "150px",
        cell: (row) => (
          <span className="birth-cell">
            <FiCalendar size={14} />
            {row.birth_date || "--"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="petsReg-container">
      <h1 className="petsReg-title">Pets registrados</h1>

      <div className="pets-toolbar">
        <div className="pets-search-box">
          <FiSearch className="pets-search-icon-modern" />
          <input
            type="text"
            placeholder="Buscar por nome do pet, CPF do dono, espécie, raça..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pets-search-input-modern"
          />
        </div>

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
  );
};

export default Pets_cadastrados;