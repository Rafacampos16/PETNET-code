import React, { useState, useEffect } from "react";
import "../styles/petsRegistrados.css"; 
import SearchIcon from "../assets/icons/search.png";
import PetImg from "../assets/images/cao.png";
import PetImg2 from "../assets/images/gato.png";
import petService from "../services/petService";

const Pets_cadastrados = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await petService.listar();
        setClientes(dados);
        console.log("PETS:", dados);
      } catch (err) {
        console.error("Erro ao carregar pets:", err);
      }
    };

    carregar();
  }, []);

  const filteredClientes = clientes.filter((c) => {
    const searchTerm = search.toLowerCase();

    const name = c.name?.toLowerCase() || "";
    const species = c.species?.toLowerCase() || "";
    const breed = c.breed?.toLowerCase() || "";
    const size = c.size?.toLowerCase() || "";
    const weight = c.weight?.toLowerCase() || "";
    const sex = c.sex?.toLowerCase() || "";
    const observations = c.observations?.toLowerCase() || "";
    const user = c.user_cpf?.toLowerCase() || "";

    return (
      name.includes(searchTerm) ||
      species.includes(searchTerm) ||
      breed.includes(searchTerm) ||
      size.includes(searchTerm) ||
      weight.includes(searchTerm) ||
      sex.includes(searchTerm) ||
      observations.includes(searchTerm) ||
      user.includes(searchTerm)
    );
  });

  const suggestions = clientes
    .filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6);

  const selecionarSugestao = (nome) => {
    setSearch(nome);
    setShowSuggestions(false);
  };

  return (
    <div className="petsReg-container">
      <h1 className="petsReg-title">PETS</h1>

      <div className="petsReg-search-container">
        <img src={SearchIcon} alt="Buscar" className="petsReg-search-icon" />

        <input
          type="text"
          placeholder="Buscar por nome, CPF do dono, espécie..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          className="petsReg-search-input"
        />

        {search && showSuggestions && suggestions.length > 0 && (
          <ul className="petsReg-suggestions-box">
            {suggestions.map((s, index) => (
              <li key={index} onClick={() => selecionarSugestao(s.name)}>
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <main className="petsReg-list">
        {filteredClientes.map((cliente, index) => (
          <div key={index} className="petsReg-card">

            <div className="petsReg-left">
              <img
                src={
                  cliente.species?.toLowerCase() === "cachorro" ||
                  cliente.species?.toLowerCase() === "dog"
                    ? PetImg
                    : PetImg2
                }
                alt="cliente"
                className="petsReg-img"
              />


              <div className="petsReg-info">
                <h3>{cliente.name}</h3>
                <p><strong>Dono (CPF):</strong> {cliente.user_cpf}</p>
                <p><strong>Espécie:</strong> {cliente.species}</p>
              </div>
            </div>

            <div className="petsReg-details">
              <p><strong>Peso:</strong> {cliente.weight}</p>
              <p><strong>Raça:</strong> {cliente.breed}</p>
              <p><strong>Porte:</strong> {cliente.size}</p>
              <p><strong>Sexo:</strong> {cliente.sex}</p>
              <p className="petsReg-obs">
                <strong>Observação:</strong> {cliente.observations || "Nenhuma"}
              </p>
            </div>

          </div>
        ))}
      </main>
    </div>
  );
};

export default Pets_cadastrados;
