import React, { useState } from "react";
import "../styles/Pets.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Pets() {
  const [form, setForm] = useState({
    nome: "",
    especie: "",
    raca: "",
    porte: "",
    peso: "",
    nascimento: "",
    sexo: "",
    foto: null,
  });


  const [erros, setErros] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFileChange(e) {
    setForm({ ...form, foto: e.target.files[0] });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const camposObrigatorios = [
      "nome",
      "especie",
      "raca",
      "porte",
      "peso",
      "nascimento",
      "sexo",
    ];

    let novosErros = {};

    camposObrigatorios.forEach((campo) => {
      if (!form[campo] || form[campo].toString().trim() === "") {
        novosErros[campo] = true;
      }
    });

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      alert("Preencha todos os campos obrigatorios!");
      return;
    }

    setErros({});
    alert("Pet cadastrado com sucesso!");
    // aqui você pode limpar o form ou fazer o envio real (API)...

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      alert("Preencha todos os campos obrigatorios!");
      return;
    }

    // 🔥 LIMPAR CAMPOS DEPOIS DO SUCESSO
    setForm({
      nome: "",
      especie: "",
      raca: "",
      porte: "",
      peso: "",
      nascimento: "",
      sexo: "",
    });

  }

  // função auxiliar para garantir submit quando o botão está fora do form
  function enviarFormularioExternamente() {
    const f = document.getElementById("petForm");
    if (!f) return;

    // requestSubmit dispara o evento submit e respeita validações nativas
    if (typeof f.requestSubmit === "function") {
      f.requestSubmit();
      return;
    }

    // fallback: dispatchEvent de um submit cancelable (também chama onSubmit)
    const ev = new Event("submit", { bubbles: true, cancelable: true });
    f.dispatchEvent(ev);
  }

  return (
    <>
      <Header />

      <div className="container pets-container">
        <h1 className="topo2">CADASTRE SEU PET</h1>

        {/* observação: id igual a petForm */}
        <form id="petForm" className="form" onSubmit={handleSubmit}>
          <div className="form-left font">
            <label>NOME DO PET/APELIDO</label>
            <input
              type="text"
              name="nome"
              placeholder="Digite o nome/apelido do seu pet"
              onChange={handleChange}
              value={form.nome}
              className={erros.nome ? "input-erro" : ""}
            />

            <label>ESPÉCIE</label>
            <select
              name="especie"
              onChange={handleChange}
              value={form.especie}
              className={erros.especie ? "input-erro" : ""}
            >
              <option value="">Escolha a espécie</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
            </select>

            <label>RAÇA</label>
            <input
              type="text"
              name="raca"
              placeholder="Informe a raça do seu pet"
              onChange={handleChange}
              value={form.raca}
              className={erros.raca ? "input-erro" : ""}
            />

            <div className="linhas dupla">
              <div>
                <label>PORTE</label>
                <select
                  name="porte"
                  onChange={handleChange}
                  value={form.porte}
                  className={erros.porte ? "input-erro" : ""}
                >
                  <option value="">Escolha o porte</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div>
                <label>PESO</label>
                <input
                  type="number"
                  name="peso"
                  placeholder="Informe o peso em kg"
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  value={form.peso}
                  className={erros.peso ? "input-erro" : ""}
                />
              </div>
            </div>

            <div className="linhas dupla">
              <div>
                <label>DATA DE NASCIMENTO</label>
                <input
                  type="date"
                  name="nascimento"
                  onChange={handleChange}
                  value={form.nascimento}
                  className={erros.nascimento ? "input-erro" : ""}
                />
              </div>

              <div>
                <label>SEXO</label>
                <select
                  name="sexo"
                  onChange={handleChange}
                  value={form.sexo}
                  className={erros.sexo ? "input-erro" : ""}
                >
                  <option value="">Selecione</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>
            </div>
          </div>

          <div className="upload-area">
            {form.foto ? (
              <div className="preview-container">
                <img
                  src={URL.createObjectURL(form.foto)}
                  alt="Prévia do pet"
                  className="preview-img"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => setForm({ ...form, foto: null })}
                >
                  REMOVER A FOTO
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <input type="file" onChange={handleFileChange} />
                <span>CARREGUE UMA FOTO DO SEU PET AQUI</span>
              </label>
            )}
          </div>
        </form>

        {/* botão fora do form - centralizado - chama requestSubmit/fallback */}
        <button
          type="button"
          className="btn"
          onClick={enviarFormularioExternamente}
          style={{ display: "block", margin: "40px auto 80px auto" }}
        >
          CADASTRAR
        </button>
      </div>

      <Footer />
    </>
  );
}

export default Pets;
