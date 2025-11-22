import React, { useState } from "react";
import "../styles/clientes.css";
import ClienteImg from "../assets/images/Cliente.png";
import SearchIcon from "../assets/icons/search.png"; // IMPORT DO ÍCONE DE BUSCA

const Clientes = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const clientes = [
    { nome: "Ana Clara da Silva", email: "anacsilva123@gmail.com", cpf: "123.456.789-10", telefone: "(12) 98111-2222", endereco: "Rua Sete de Setembro, nº 12, Centro", cep: "123456-000" },
    { nome: "João Santos Souza", email: "joaosantossouza@gmail.com", cpf: "768.890.431-78", telefone: "(12) 99123-4455", endereco: "Rua José Bonifácio, nº 78, Centro", cep: "123456-000" },
    { nome: "Carla Moura", email: "carlam@gmail.com", cpf: "222.444.888-99", telefone: "(12) 99711-3333", endereco: "Rua Bahia, 89", cep: "12675-111" },
    { nome: "Lucas Andrade", email: "lucas.andrade@yahoo.com", cpf: "554.771.998-31", telefone: "(13) 99845-1221", endereco: "Av. Santos Dumont, 920", cep: "11222-990" },
    { nome: "Beatriz Souza", email: "bia.souza@gmail.com", cpf: "998.654.221-12", telefone: "(11) 99122-3344", endereco: "Rua Porto Velho, 22", cep: "06712-144" },
    { nome: "Ricardo Ramos", email: "ricardo.r@gmail.com", cpf: "124.333.442-99", telefone: "(21) 99912-0344", endereco: "Av. Beira Mar, 612", cep: "22022-010" },
    { nome: "Marcelo Castro", email: "marcelo.castro@gmail.com", cpf: "111.666.555-32", telefone: "(31) 99110-7733", endereco: "Av. Amazonas, 1120", cep: "30150-350" }
  ];

const filteredClientes = clientes.filter((c) => {
  const searchTerm = search.toLowerCase();

  return (
    c.nome.toLowerCase().includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm) ||
    c.telefone.toLowerCase().includes(searchTerm) ||
    c.cpf.toLowerCase().includes(searchTerm) ||
    c.endereco.toLowerCase().includes(searchTerm) ||
    c.cep.toLowerCase().includes(searchTerm)
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
    <div className="clientes-container">
      <h1 className="titulo-clientes">CLIENTES</h1>

      <div className="search-container">
        <img src={SearchIcon} alt="Buscar" className="search-icon" />

        <input
          type="text"
          placeholder="Pesquisar por nome, email, CPF..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          className="search-input"
        />

        {search && showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-box">
            {suggestions.map((s, index) => (
              <li key={index} onClick={() => selecionarSugestao(s.nome)}>
                {s.nome}
              </li>
            ))}
          </ul>
        )}
      </div>

    <main className="clientes-list">
      {filteredClientes.map((cliente, index) => (
        <div key={index} className="card-cliente">
          
          <div className="card-left">
            <img src={ClienteImg} alt="cliente" className="cliente-img" />
            
            <div className="cliente-info-principal">
              <h3>{cliente.nome}</h3>
              <p><strong>Email:</strong> {cliente.email}</p>
            </div>
          </div>

          <div className="card-infos">
            <p><strong>CPF/CNPJ:</strong> {cliente.cpf}</p>
            <p><strong>Telefone:</strong> {cliente.telefone}</p>
            <p><strong>Endereço:</strong> {cliente.endereco}</p>
            <p><strong>CEP:</strong> {cliente.cep}</p>
          </div>

        </div>
      ))}
    </main>
    </div>
  );
};

export default Clientes;
