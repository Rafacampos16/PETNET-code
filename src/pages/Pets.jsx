import React, { useState } from "react";
import "../styles/Pets.css";
import Header from "../components/Header";
import petService from "../services/petService";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiCheck,
  FiUploadCloud,
  FiCalendar,
  FiTag,
  FiHeart,
} from "react-icons/fi";

function Pets() {
  const navigate = useNavigate();
  const usuarioLogado = localStorage.getItem("isUser") === "true";

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    size: "",
    weight: "",
    birth_date: "",
    sex: "",
    picture_url: null,
    observations: "",
  });

  const [erros, setErros] = useState({});

  function resetForm() {
    setForm({
      name: "",
      species: "",
      breed: "",
      size: "",
      weight: "",
      birth_date: "",
      sex: "",
      picture_url: null,
      observations: "",
    });

    setErros({});
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFileChange(e) {
    setForm({ ...form, picture_url: e.target.files[0] });
  }

  function validarCampos() {
    const novosErros = {};
    const faltando = [];

    if (!form.name.trim()) {
      novosErros.name = true;
      faltando.push("Nome");
    }
    if (!form.species.trim()) {
      novosErros.species = true;
      faltando.push("Espécie");
    }
    if (!form.breed.trim()) {
      novosErros.breed = true;
      faltando.push("Raça");
    }
    if (!form.size.trim()) {
      novosErros.size = true;
      faltando.push("Porte");
    }
    if (!form.weight) {
      novosErros.weight = true;
      faltando.push("Peso");
    }
    if (!form.birth_date.trim()) {
      novosErros.birth_date = true;
      faltando.push("Data de nascimento");
    }
    if (!form.sex.trim()) {
      novosErros.sex = true;
      faltando.push("Sexo");
    }

    return { novosErros, faltando };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { novosErros, faltando } = validarCampos();
    setErros(novosErros);

    if (faltando.length > 0) {
      alert(
        "Preencha os seguintes campos obrigatórios:\n\n- " +
          faltando.join("\n- ")
      );
      return;
    }

    try {
      const user_cpf = "58389179890";

      const speciesMap = {
        CACHORRO: "dog",
        GATO: "cat",
      };

      const sizeMap = {
        PEQUENO: "S",
        MEDIO: "M",
        GRANDE: "L",
        GIGANTE: "G",
      };

      const sexMap = {
        MACHO: "M",
        FEMEA: "F",
      };

      const data = {
        name: form.name,
        species: speciesMap[form.species],
        breed: form.breed,
        size: sizeMap[form.size],
        weight: Number(form.weight),
        birth_date: new Date(form.birth_date).toISOString(),
        sex: sexMap[form.sex],
        user_cpf: user_cpf,
        observations: form.observations,
      };

      console.log("BODY FINAL MAPEADO ===>", data);

      const response = await petService.criar(data);
      console.log("SUCESSO:", response);
      alert("Pet cadastrado com sucesso!");

      resetForm();
    } catch (erro) {
      console.error("ERRO COMPLETO ===> ", erro);
      console.error("ERRO DATA ===> ", erro.response?.data);
      alert("Erro ao cadastrar o pet.");
    }
  };

  function enviarFormularioExternamente() {
    const f = document.getElementById("petForm");
    if (!f) return;

    if (typeof f.requestSubmit === "function") {
      f.requestSubmit();
      return;
    }

    const ev = new Event("submit", { bubbles: true, cancelable: true });
    f.dispatchEvent(ev);
  }

  return (
    <>
      <Header />

      {!usuarioLogado ? (
        <div className="pet-lock-page">
          <div className="pet-lock-card">
            <div className="pet-lock-icon-wrapper">
              <div className="pet-lock-icon-circle">
                <FiLock size={58} />
              </div>
            </div>

            <h1 className="pet-lock-title">Cadastre seu pet</h1>

            <p className="pet-lock-text">
              Para cadastrar seu pet e acompanhar as informações dele, faça login
              na sua conta.
            </p>

            <button
              className="pet-lock-login-btn"
              onClick={() => navigate("/conta")}
            >
              Acessar minha conta
            </button>

            <p className="pet-lock-create-text">
              Ainda não tem uma conta?{" "}
              <span onClick={() => navigate("/criarconta")}>Criar conta</span>
            </p>

            <div className="pet-lock-divider"></div>

            <div className="pet-lock-benefits">
              <div className="pet-lock-benefit">
                <FiCheck size={18} />
                <span>Cadastrar seus pets com segurança</span>
              </div>

              <div className="pet-lock-benefit">
                <FiCheck size={18} />
                <span>Manter os dados do pet organizados</span>
              </div>

              <div className="pet-lock-benefit">
                <FiCheck size={18} />
                <span>Acompanhar histórico e informações cadastradas</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="pets-page">
          <div className="pets-container">
            <div className="pets-hero">
              <div className="pets-hero-badge">Cadastro Petnet</div>
              <h1 className="topo2">Cadastre seu pet</h1>
              <p className="pets-subtitle">
                Preencha os dados com carinho para manter o perfil do seu pet
                sempre completo, organizado e pronto para os próximos cuidados.
              </p>
            </div>

            <div className="pets-card">
              <div className="pets-card-top">
                <div>
                  <h2>Informações do pet</h2>
                  <p>Todos os campos marcados como obrigatórios devem ser preenchidos.</p>
                </div>

                <div className="pets-top-tags">
                  <span>
                    <FiHeart size={14} />
                    Cadastro seguro
                  </span>
                  <span>
                    <FiTag size={14} />
                    Perfil completo
                  </span>
                </div>
              </div>

              <form id="petForm" className="form" onSubmit={handleSubmit}>
                <div className="form-left">
                  <div className="form-section">
                    <h3 className="form-section-title">Dados principais</h3>

                    <label>NOME DO PET/APELIDO</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Digite o nome/apelido do seu pet"
                      onChange={handleChange}
                      value={form.name}
                      className={erros.name ? "input-erro" : ""}
                    />

                    <label>ESPÉCIE</label>
                    <select
                      name="species"
                      onChange={handleChange}
                      value={form.species}
                      className={erros.species ? "input-erro" : ""}
                    >
                      <option value="">Escolha a espécie</option>
                      <option value="CACHORRO">CACHORRO</option>
                      <option value="GATO">GATO</option>
                    </select>

                    <label>RAÇA</label>
                    <input
                      type="text"
                      name="breed"
                      placeholder="Informe a raça do seu pet"
                      onChange={handleChange}
                      value={form.breed}
                      className={erros.breed ? "input-erro" : ""}
                    />
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Características</h3>

                    <div className="linhas dupla">
                      <div>
                        <label>PORTE</label>
                        <select
                          name="size"
                          onChange={handleChange}
                          value={form.size}
                          className={erros.size ? "input-erro" : ""}
                        >
                          <option value="">Escolha o porte</option>
                          <option value="PEQUENO">PEQUENO</option>
                          <option value="MEDIO">MEDIO</option>
                          <option value="GRANDE">GRANDE</option>
                        </select>
                      </div>

                      <div>
                        <label>PESO</label>
                        <input
                          type="number"
                          name="weight"
                          placeholder="Informe o peso em kg"
                          onChange={handleChange}
                          min="0"
                          step="0.5"
                          value={form.weight}
                          className={erros.weight ? "input-erro" : ""}
                        />
                      </div>
                    </div>

                    <div className="linhas dupla">
                      <div>
                        <label>DATA DE NASCIMENTO</label>
                        <div className="input-icon-wrapper">
                          <FiCalendar className="input-icon" />
                          <input
                            type="date"
                            name="birth_date"
                            onChange={handleChange}
                            value={form.birth_date}
                            className={erros.birth_date ? "input-erro input-with-icon" : "input-with-icon"}
                          />
                        </div>
                      </div>

                      <div>
                        <label>SEXO</label>
                        <select
                          name="sex"
                          onChange={handleChange}
                          value={form.sex}
                          className={erros.sex ? "input-erro" : ""}
                        >
                          <option value="">Selecione</option>
                          <option value="FEMEA">FÊMEA</option>
                          <option value="MACHO">MACHO</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Observação</h3>

                    <label>OBSERVAÇÃO</label>
                    <textarea
                      name="observations"
                      placeholder="Digite uma observação sobre o pet (opcional)"
                      onChange={handleChange}
                      value={form.observations}
                      rows={5}
                    />
                  </div>
                </div>

                <div className="upload-column">
                  <div className="upload-card">
                    <h3 className="upload-title">Foto do pet</h3>
                    <p className="upload-subtitle">
                      Adicione uma foto para deixar o perfil ainda mais completo.
                    </p>

                    <div className="upload-area">
                      {form.picture_url ? (
                        <div className="preview-container">
                          <img
                            src={URL.createObjectURL(form.picture_url)}
                            alt="Prévia do pet"
                            className="preview-img"
                          />
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() =>
                              setForm({ ...form, picture_url: null })
                            }
                          >
                            Remover foto
                          </button>
                        </div>
                      ) : (
                        <label className="upload-label">
                          <input type="file" onChange={handleFileChange} />
                          <div className="upload-placeholder">
                            <FiUploadCloud size={42} />
                            <span>CARREGUE UMA FOTO DO SEU PET AQUI</span>
                            <small>PNG, JPG ou JPEG</small>
                          </div>
                        </label>
                      )}
                    </div>

                    <div className="upload-tip">
                      Uma boa foto ajuda a identificar o pet com mais facilidade.
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="pets-actions">
              <button
                type="button"
                className="btn"
                onClick={enviarFormularioExternamente}
              >
                Cadastrar pet
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Pets;