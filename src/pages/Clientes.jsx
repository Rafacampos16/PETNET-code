import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../styles/clientes.css";

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
      <div className="pets-header">🐾 Pets do cliente</div>

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

  useEffect(() => {
    const fakeClientes = [
      {
        id: 1,
        nome: "Rafaela Campos",
        email: "rafaela.campos@email.com",
        cpf: "123.456.789-00",
        telefone: "(12) 99123-4567",
        endereco: "Rua das Flores",
        numero: "120",
        bairro: "Centro",
        cidade: "Guaratinguetá",
        estado: "SP",
        cep: "12500-000",
        pets: [
          { nome: "Thor", tipo: "Cachorro", raca: "Golden Retriever" },
          { nome: "Luna", tipo: "Gato", raca: "Siamês" },
        ],
      },
      {
        id: 2,
        nome: "Carlos Silva",
        email: "carlos.silva@email.com",
        cpf: "987.654.321-00",
        telefone: "(11) 98888-1111",
        endereco: "Av Paulista",
        numero: "1500",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01310-200",
        pets: [{ nome: "Rex", tipo: "Cachorro", raca: "Pastor Alemão" }],
      },
      {
        id: 3,
        nome: "Marina Souza",
        email: "marina.souza@email.com",
        cpf: "222.333.444-55",
        telefone: "(11) 97777-8888",
        endereco: "Rua Campinas",
        numero: "340",
        bairro: "Centro",
        cidade: "Campinas",
        estado: "SP",
        cep: "13010-000",
        pets: [{ nome: "Mimi", tipo: "Gato", raca: "Persa" }],
      },
      {
        id: 4,
        nome: "João Pereira",
        email: "joao.pereira@email.com",
        cpf: "111.222.333-44",
        telefone: "(12) 99666-5555",
        endereco: "Rua da Serra",
        numero: "98",
        bairro: "Independência",
        cidade: "Taubaté",
        estado: "SP",
        cep: "12010-000",
        pets: [{ nome: "Mel", tipo: "Cachorro", raca: "Shih-Tzu" }],
      },
      {
        id: 5,
        nome: "Fernanda Lima",
        email: "fernanda.lima@email.com",
        cpf: "555.666.777-88",
        telefone: "(21) 98877-6655",
        endereco: "Av Atlântica",
        numero: "250",
        bairro: "Copacabana",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        cep: "22070-000",
        pets: [
          { nome: "Nina", tipo: "Gato", raca: "Persa" },
          { nome: "Bob", tipo: "Cachorro", raca: "Poodle" },
        ],
      },
      {
        id: 6,
        nome: "Pedro Alves",
        email: "pedro.alves@email.com",
        cpf: "444.222.888-11",
        telefone: "(31) 97744-2211",
        endereco: "Rua Minas Gerais",
        numero: "780",
        bairro: "Savassi",
        cidade: "Belo Horizonte",
        estado: "MG",
        cep: "30140-000",
        pets: [{ nome: "Toby", tipo: "Cachorro", raca: "Beagle" }],
      },
      {
        id: 7,
        nome: "Juliana Rocha",
        email: "juliana.rocha@email.com",
        cpf: "999.888.777-66",
        telefone: "(19) 98811-2233",
        endereco: "Rua XV de Novembro",
        numero: "410",
        bairro: "Centro",
        cidade: "Piracicaba",
        estado: "SP",
        cep: "13400-000",
        pets: [{ nome: "Simba", tipo: "Gato", raca: "Maine Coon" }],
      },
      {
        id: 8,
        nome: "Lucas Martins",
        email: "lucas.martins@email.com",
        cpf: "101.202.303-40",
        telefone: "(41) 97777-1234",
        endereco: "Rua das Araucárias",
        numero: "520",
        bairro: "Centro",
        cidade: "Curitiba",
        estado: "PR",
        cep: "80010-000",
        pets: [
          { nome: "Max", tipo: "Cachorro", raca: "Labrador" },
          { nome: "Bella", tipo: "Cachorro", raca: "Border Collie" },
        ],
      },
      {
        id: 9,
        nome: "Patricia Gomes",
        email: "patricia.gomes@email.com",
        cpf: "606.707.808-90",
        telefone: "(51) 98888-4321",
        endereco: "Rua Borges de Medeiros",
        numero: "95",
        bairro: "Centro",
        cidade: "Porto Alegre",
        estado: "RS",
        cep: "90020-000",
        pets: [{ nome: "Lili", tipo: "Gato", raca: "Angorá" }],
      },
      {
        id: 10,
        nome: "Ricardo Santos",
        email: "ricardo.santos@email.com",
        cpf: "909.808.707-60",
        telefone: "(62) 99999-5555",
        endereco: "Av Goiás",
        numero: "300",
        bairro: "Centro",
        cidade: "Goiânia",
        estado: "GO",
        cep: "74010-000",
        pets: [],
      },
      {
        id: 11,
        nome: "Camila Duarte",
        email: "camila.duarte@email.com",
        cpf: "321.654.987-10",
        telefone: "(27) 98822-5566",
        endereco: "Rua Vitória",
        numero: "210",
        bairro: "Praia do Canto",
        cidade: "Vitória",
        estado: "ES",
        cep: "29055-000",
        pets: [{ nome: "Fred", tipo: "Cachorro", raca: "Bulldog" }],
      },
      {
        id: 12,
        nome: "André Oliveira",
        email: "andre.oliveira@email.com",
        cpf: "852.741.963-20",
        telefone: "(71) 98877-9988",
        endereco: "Av Oceânica",
        numero: "140",
        bairro: "Barra",
        cidade: "Salvador",
        estado: "BA",
        cep: "40140-130",
        pets: [{ nome: "Luna", tipo: "Gato", raca: "Sphynx" }],
      },
      {
        id: 13,
        nome: "Bruna Carvalho",
        email: "bruna.carvalho@email.com",
        cpf: "456.123.789-30",
        telefone: "(48) 98844-6677",
        endereco: "Rua das Gaivotas",
        numero: "65",
        bairro: "Ingleses",
        cidade: "Florianópolis",
        estado: "SC",
        cep: "88058-000",
        pets: [{ nome: "Bolt", tipo: "Cachorro", raca: "Husky Siberiano" }],
      },
      {
        id: 14,
        nome: "Felipe Andrade",
        email: "felipe.andrade@email.com",
        cpf: "963.852.741-40",
        telefone: "(85) 98811-2233",
        endereco: "Av Beira Mar",
        numero: "700",
        bairro: "Meireles",
        cidade: "Fortaleza",
        estado: "CE",
        cep: "60165-121",
        pets: [{ nome: "Pipoca", tipo: "Gato", raca: "SRD" }],
      },
      {
        id: 15,
        nome: "Daniela Martins",
        email: "daniela.martins@email.com",
        cpf: "741.963.852-50",
        telefone: "(61) 98866-3322",
        endereco: "SQN 210",
        numero: "12",
        bairro: "Asa Norte",
        cidade: "Brasília",
        estado: "DF",
        cep: "70872-000",
        pets: [
          { nome: "Zeus", tipo: "Cachorro", raca: "Doberman" },
          { nome: "Maya", tipo: "Cachorro", raca: "Akita" },
        ],
      },
    ];

    setClientes(fakeClientes);
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

  const alterarCampo = (campo, valor) => {
    setClienteEditando({
      ...clienteEditando,
      [campo]: valor,
    });
  };

  const salvarEdicao = () => {
    const novosClientes = clientes.map((c) => {
      if (c.id === clienteEditando.id) {
        return clienteEditando;
      }
      return c;
    });

    setClientes(novosClientes);
    setClienteSelecionado(clienteEditando);
    setModoEdicao(false);
  };

  const excluirCliente = (id) => {
    const novos = clientes.filter((c) => c.id !== id);
    setClientes(novos);
    fecharModal();
  };

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
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "55px",
      },
    },

    headCells: {
      style: {
        backgroundColor: "#3370eb",
        color: "#fff",
        fontWeight: "600",
      },
    },

    striped: {
      default: {
        backgroundColor: "#eef4ff",
      },
    },
  };

  const columns = [
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
    },

    {
      name: "CPF",
      selector: (row) => row.cpf,
    },

    {
      name: "Telefone",
      selector: (row) => row.telefone,
    },

    {
      name: "Email",
      selector: (row) => row.email,
    },

    {
      name: (
        <div className="coluna-filtro">
          Cidade
          <select onChange={(e) => setCidadeFiltro(e.target.value)}>
            <option value="">Todas</option>
            <option>Guaratinguetá</option>
            <option>São Paulo</option>
            <option>Rio de Janeiro</option>
          </select>
        </div>
      ),
      selector: (row) => row.cidade,
    },

    {
      name: (
        <div className="coluna-filtro">
          Estado
          <select onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Todos</option>
            <option>SP</option>
            <option>RJ</option>
          </select>
        </div>
      ),
      selector: (row) => row.estado,
    },

    {
      name: "Pets",
      selector: (row) => row.pets?.length || 0,
      center: true,
      width: "90px",
      cell: (row) => (
        <span className="pet-count">🐾 {row.pets?.length || 0}</span>
      ),
    },
    {
      name: "Ações",
      cell: (row) => (
        <button className="btn-ver" onClick={() => abrirModal(row)}>
          Ver Cliente
        </button>
      ),
    },
  ];

  return (
    <div className="clientes-container">
      <h1 className="titulo-clientes">Gerenciamento de Clientes</h1>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Buscar cliente por nome, CPF ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-big"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredClientes}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
        expandableRows
        expandableRowsComponent={PetsExpand}
      />

      {modalOpen && clienteSelecionado && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={fecharModal}>
              ✕
            </button>

            <h2>Cliente</h2>

            <div className="modal-grid">
              <div>
                <label>Nome</label>

                {modoEdicao ? (
                  <input
                    value={clienteEditando.nome}
                    onChange={(e) => alterarCampo("nome", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.nome}</p>
                )}
              </div>

              <div>
                <label>CPF</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.cpf}
                    onChange={(e) => alterarCampo("cpf", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.cpf}</p>
                )}
              </div>

              <div>
                <label>Email</label>

                {modoEdicao ? (
                  <input
                    value={clienteEditando.email}
                    onChange={(e) => alterarCampo("email", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.email}</p>
                )}
              </div>

              <div>
                <label>Telefone</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.telefone}
                    onChange={(e) => alterarCampo("telefone", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.telefone}</p>
                )}
              </div>

              <div>
                <label>Endereço</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.endereco}
                    onChange={(e) => alterarCampo("endereco", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.endereco}</p>
                )}
              </div>

              <div>
                <label>Número</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.numero}
                    onChange={(e) => alterarCampo("numero", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.numero}</p>
                )}
              </div>

              <div>
                <label>Bairro</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.bairro}
                    onChange={(e) => alterarCampo("bairro", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.bairro}</p>
                )}
              </div>

              <div>
                <label>Cidade</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.cidade}
                    onChange={(e) => alterarCampo("cidade", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.cidade}</p>
                )}
              </div>

              <div>
                <label>Estado</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.estado}
                    onChange={(e) => alterarCampo("estado", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.estado}</p>
                )}
              </div>

              <div>
                <label>CEP</label>
                {modoEdicao ? (
                  <input
                    value={clienteEditando.cep}
                    onChange={(e) => alterarCampo("cep", e.target.value)}
                  />
                ) : (
                  <p>{clienteSelecionado.cep}</p>
                )}
              </div>
            </div>

            <div className="pets-section">
              <h3>Pets do Cliente</h3>

              {clienteSelecionado.pets?.length ? (
                <ul className="pets-list">
                  {clienteSelecionado.pets.map((pet, index) => (
                    <li key={index}>
                      <strong>{pet.nome}</strong> — {pet.tipo} ({pet.raca})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum pet cadastrado</p>
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
                onClick={() => excluirCliente(clienteSelecionado.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
