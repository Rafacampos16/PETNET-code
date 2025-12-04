import React, { useState } from "react";
import "../styles/Pets.css";
import Header from "../components/Header";
import petService from "../services/petService";
import Footer from "../components/Footer";

function Pets() {
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    size: "",
    weight: "",
    birth_date: "",
    sex: "",
    picture_url: null,
  });

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
  });

  setErros({});
}


  const [erros, setErros] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFileChange(e) {
    setForm({ ...form, picture_url: e.target.files[0] });
  }

  // VALIDAÇÃO DOS CAMPOS
 function validarCampos() {
  const novosErros = {};
  const faltando = [];

  if (!form.name.trim()) { novosErros.name = true; faltando.push("Nome"); }
  if (!form.species.trim()) { novosErros.species = true; faltando.push("Espécie"); }
  if (!form.breed.trim()) { novosErros.breed = true; faltando.push("Raça"); }
  if (!form.size.trim()) { novosErros.size = true; faltando.push("Porte"); }
  if (!form.weight) { novosErros.weight = true; faltando.push("Peso"); }
  if (!form.birth_date.trim()) { novosErros.birth_date = true; faltando.push("Data de Nascimento"); }
  if (!form.sex.trim()) { novosErros.sex = true; faltando.push("Sexo"); }

  return { novosErros, faltando };
}



  const handleSubmit = async (e) => {
  e.preventDefault();

  // Executa validação
  const { novosErros, faltando } = validarCampos();
  setErros(novosErros);

  // Se houver campos faltando, mostrar alert e impedir envio
  if (faltando.length > 0) {
    alert("Preencha os seguintes campos obrigatórios:\n\n- " + faltando.join("\n- "));
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
    };

    console.log("BODY FINAL MAPEADO ===>", data);

    const response = await petService.criar(data);
    console.log("SUCESSO:", response);
    alert("Pet cadastrado com sucesso!");

    resetForm(); // limpa os campos


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

      <div className="container pets-container">
        <h1 className="topo2">CADASTRE SEU PET</h1>

        <form id="petForm" className="form" onSubmit={handleSubmit}>
          <div className="form-left font">
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
                <input
                  type="date"
                  name="birth_date"
                  onChange={handleChange}
                  value={form.birth_date}
                  className={erros.birth_date ? "input-erro" : ""}
                />
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
                  onClick={() => setForm({ ...form, picture_url: null })}
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
