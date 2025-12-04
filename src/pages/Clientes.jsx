import React, { useState, useEffect } from "react";
import "../styles/clientes.css";
import ClienteImg from "../assets/images/Cliente.png";
import SearchIcon from "../assets/icons/search.png";
import { userService } from "../services/userService";

const Clientes = () => {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await userService.listUsers();
        // trata resposta que pode vir { data: [...] } ou já vir o array diretamente
        const raw = dados?.data ?? dados;
        setClientes(Array.isArray(raw) ? raw : [raw]);
        console.log("Clientes:", raw);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
        setClientes([]);
      }
    };

    carregar();
  }, []);

  const filteredClientes = clientes.filter((c) => {
    const searchTerm = (search || "").toLowerCase();

    const name = c.name?.toLowerCase() || "";
    const email = c.email?.toLowerCase() || "";
    const cpf = c.cpf?.toLowerCase() || "";
    const type = c.type?.toLowerCase() || "";

    return (
      name.includes(searchTerm) ||
      email.includes(searchTerm) ||
      cpf.includes(searchTerm) ||
      type.includes(searchTerm)
    );
  });

  const suggestions = clientes
    .filter((c) => {
      const n = (c.name || c.email || c.cpf || "").toLowerCase();
      return n.includes((search || "").toLowerCase());
    })
    .slice(0, 6);

  const selecionarSugestao = (valor) => {
    setSearch(valor);
    setShowSuggestions(false);
  };

  const displayName = (c) => c.name || c.email || c.cpf || "Sem nome";

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
              <li
                key={s.cpf ?? index}
                onClick={() => selecionarSugestao(displayName(s))}
              >
                {displayName(s)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <main className="clientes-list">
        {filteredClientes.map((cliente, index) => {
          const contato = cliente.contacts?.[0];   // primeiro contato
          const endereco = cliente.addresses?.[0]; // primeiro endereço

          return (
            <div key={cliente.cpf ?? index} className="card-cliente">

              {/* LADO ESQUERDO */}
              <div className="card-left">
                <img
                  src={cliente.picture_url || ClienteImg}
                  alt={displayName(cliente)}
                  className="cliente-img"
                />

                <div className="cliente-info-principal">
                  <h3>{displayName(cliente)}</h3>

                  <p><strong>Email:</strong> {cliente.email || "—"}</p>

                  <p><strong>Telefone:</strong> {contato?.number || "—"}</p>
                </div>
              </div>

              {/* LADO DIREITO */}
              <div className="card-infos">
                <p><strong>CPF:</strong> {cliente.cpf || "—"}</p>
                <p><strong>Tipo:</strong> {cliente.type || "—"}</p>

                <p>
                  <strong>Endereço:</strong>{" "}
                  {endereco
                    ? `${endereco.location}${endereco.complement ? " - " + endereco.complement : ""}`
                    : "—"}
                </p>
              </div>

            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Clientes;
