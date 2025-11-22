import React, { useState } from "react";
import "../styles/petsRegistrados.css"; 
import SearchIcon from "../assets/icons/search.png";
import PetImg from "../assets/images/patas.png";

const Pets_cadastrados = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const clientes = [
    { nome: "Pitufa", especie: "Gato", raca: "RND", dono: "Mariana Guerra", peso: "1.5 kg", porte: "PP", servico: "Veterinário", obs: "não gosta da cor vermelha" },
    { nome: "Thor", especie: "Cachorro", raca: "Labrador", dono: "Ana Clara da Silva", peso: "32 kg", porte: "G", servico: "Banho e Tosa", obs: "muito dócil" },
    { nome: "Mia", especie: "Gato", raca: "Siamês", dono: "João Santos Souza", peso: "4 kg", porte: "PP", servico: "Veterinário", obs: "assustada com estranhos" },
    { nome: "Luna", especie: "Cachorro", raca: "Poodle", dono: "Carla Moura", peso: "6 kg", porte: "P", servico: "Banho e Tosa", obs: "adora petiscos" },
    { nome: "Nina", especie: "Gato", raca: "Vira-lata", dono: "Lucas Andrade", peso: "3 kg", porte: "PP", servico: "Veterinário", obs: "muito curiosa" },
    { nome: "Bob", especie: "Cachorro", raca: "Golden Retriever", dono: "Beatriz Souza", peso: "28 kg", porte: "G", servico: "Hotelzinho", obs: "muito energético" },
    { nome: "Meg", especie: "Cachorro", raca: "Shih-tzu", dono: "Ricardo Ramos", peso: "5 kg", porte: "P", servico: "Banho e Tosa", obs: "odeia chuva" },
    { nome: "Jade", especie: "Gato", raca: "Persa", dono: "Marcelo Castro", peso: "5 kg", porte: "P", servico: "Veterinário", obs: "calma e silenciosa" },
    { nome: "Bidu", especie: "Cachorro", raca: "Beagle", dono: "Sofia Ribeiro", peso: "12 kg", porte: "M", servico: "Hotelzinho", obs: "fareja tudo" },
    { nome: "Amora", especie: "Gato", raca: "Angorá", dono: "Rita Nunes", peso: "3.8 kg", porte: "PP", servico: "Veterinário", obs: "adora colo" },
    { nome: "Zeus", especie: "Cachorro", raca: "Pastor Alemão", dono: "Pedro Carvalho", peso: "34 kg", porte: "G", servico: "Treinamento", obs: "muito obediente" },
    { nome: "Lola", especie: "Cachorro", raca: "Bulldog", dono: "Fernanda Luz", peso: "18 kg", porte: "M", servico: "Banho e Tosa", obs: "ronca muito" },
    { nome: "Toby", especie: "Cachorro", raca: "SRD", dono: "Eduardo Ramos", peso: "9 kg", porte: "P", servico: "Veterinário", obs: "late para motos" },
    { nome: "Kiara", especie: "Gato", raca: "Maine Coon", dono: "Caroline Moura", peso: "6 kg", porte: "M", servico: "Veterinário", obs: "adora caixas" },
    { nome: "Scooby", especie: "Cachorro", raca: "Dogue Alemão", dono: "Rogério Costa", peso: "55 kg", porte: "GG", servico: "Hotelzinho", obs: "gigante super dócil" },
    { nome: "Cacau", especie: "Gato", raca: "Bombay", dono: "Lívia Mendes", peso: "4 kg", porte: "PP", servico: "Veterinário", obs: "bem reservado" },
    { nome: "Pingo", especie: "Cachorro", raca: "Pinscher", dono: "Helena Duarte", peso: "2.5 kg", porte: "PP", servico: "Banho e Tosa", obs: "nervoso porém fofo" },
    { nome: "Nico", especie: "Gato", raca: "Sphynx", dono: "Fábio Lima", peso: "3.5 kg", porte: "PP", servico: "Veterinário", obs: "ama cobertores" },
    { nome: "Mel", especie: "Cachorro", raca: "Cocker Spaniel", dono: "Renata Silva", peso: "14 kg", porte: "M", servico: "Banho e Tosa", obs: "extremamente dócil" },
    { nome: "Pipoca", especie: "Gato", raca: "SRD", dono: "Daniel Almeida", peso: "2 kg", porte: "PP", servico: "Veterinário", obs: "muito brincalhona" }
  ];

  const filteredClientes = clientes.filter((c) => {
    const searchTerm = search.toLowerCase();

    return (
      c.nome.toLowerCase().includes(searchTerm) ||
      c.especie.toLowerCase().includes(searchTerm) ||
      c.raca.toLowerCase().includes(searchTerm) ||
      c.dono.toLowerCase().includes(searchTerm) ||
      c.peso.toLowerCase().includes(searchTerm) ||
      c.porte.toLowerCase().includes(searchTerm) ||
      c.servico.toLowerCase().includes(searchTerm) ||
      c.obs.toLowerCase().includes(searchTerm)
    );
  });

  const suggestions = clientes
    .filter((c) => c.nome.toLowerCase().includes(search.toLowerCase()))
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
          placeholder="Buscar por nome, dono, espécie..."
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
              <li key={index} onClick={() => selecionarSugestao(s.nome)}>
                {s.nome}
              </li>
            ))}
          </ul>
        )}
      </div>

      <main className="petsReg-list">
        {filteredClientes.map((cliente, index) => (
          <div key={index} className="petsReg-card">

            <div className="petsReg-left">
              <img src={PetImg} alt="cliente" className="petsReg-img" />

              <div className="petsReg-info">
                <h3>{cliente.nome}</h3>
                <p><strong>Dono:</strong> {cliente.dono}</p>
                <p><strong>Espécie:</strong> {cliente.especie}</p>
              </div>
            </div>

            <div className="petsReg-details">
              <p><strong>Serviço:</strong> {cliente.servico}</p>
              <p><strong>Peso:</strong> {cliente.peso}</p>
              <p><strong>Raça:</strong> {cliente.raca}</p>
              <p><strong>Porte:</strong> {cliente.porte}</p>
              <p className="petsReg-obs">
                <strong>Observação:</strong> {cliente.obs}
              </p>
            </div>

          </div>
        ))}
      </main>
    </div>
  );
};

export default Pets_cadastrados;
