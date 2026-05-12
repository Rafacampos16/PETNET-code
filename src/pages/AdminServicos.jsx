import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/adminServicos.css";
import serviceService from "../services/serviceService";
import banhoIcon from "../assets/icons/banho.png";
import terapeuticoIcon from "../assets/icons/terapeutico.png";
import tosahigIcon from "../assets/icons/tosahig.png";
import tosamaqIcon from "../assets/icons/tosamaq.png";
import tosaracaIcon from "../assets/icons/tosaraca.png";
import unhaIcon from "../assets/icons/unha.png";
import ouvidoIcon from "../assets/icons/ouvidos.png";
import dentalIcon from "../assets/icons/dental.png";
import cronogramaIcon from "../assets/icons/cronograma.png";
import hidratacaoIcon from "../assets/icons/hidratacao.png";
import peleIcon from "../assets/icons/pele.png";
import porosidadeIcon from "../assets/icons/porosidade.png";


const AdminServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const limparFormulario = () => {
    setForm({ name: "", description: "", servicePicture: null });
    setEditandoId(null);
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    servicePicture: null, // base64
  });

  useEffect(() => {
    serviceService.listar()
      .then((data) => setServicos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar serviços:", err));
  }, []);

  const iconeMap = {
    "Banho": banhoIcon,
    "Banho Terapêutico": terapeuticoIcon,
    "Banho Medicamentoso": terapeuticoIcon,
    "Tosa Higiênica": tosahigIcon,
    "Banho e Tosa Higiênica": tosahigIcon,
    "Tosa (Máq. ou Tesoura)": tosamaqIcon,
    "Banho e Tosa na Máquina": tosamaqIcon,
    "Banho e Tosa na Tesoura": tosaracaIcon,
    "Tosa da raça": tosaracaIcon,
    "Corte de unhas": unhaIcon,
    "Corte de Unha": unhaIcon,
    "Higiene dos Ouvidos": ouvidoIcon,
    "Escovação Dental": dentalIcon,
    "Cronograma Capilar": cronogramaIcon,
    "Hidratação": hidratacaoIcon,
    "Hidratação de Pelagem": hidratacaoIcon,
    "Hidratação de Pele": peleIcon,
    "Teste de Porosidade": porosidadeIcon,
    "Ozonioterapia": terapeuticoIcon,
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvarServico = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      alert("Preencha o nome e a descrição.");
      return;
    }

    try {
      if (editandoId) {
        const atualizado = await serviceService.atualizar(editandoId, form);
        setServicos((prev) =>
          prev.map((s) => (s.id === editandoId ? atualizado : s))
        );
      } else {
        const novo = await serviceService.criar(form);
        setServicos((prev) => [novo, ...prev]);
      }
      limparFormulario();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao salvar serviço.");
    }
  };

  const handleEditar = (servico) => {
    setEditandoId(servico.id);
    setForm({
      name: servico.name,
      description: servico.description,
      servicePicture: servico.picture_blob || null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAlternarStatus = async (servico) => {
    try {
      if (servico.excluded_at) {
        await serviceService.reativar(servico.id);
        setServicos((prev) =>
          prev.map((s) =>
            s.id === servico.id ? { ...s, excluded_at: null } : s
          )
        );
      } else {
        await serviceService.deletar(servico.id);
        setServicos((prev) =>
          prev.map((s) =>
            s.id === servico.id ? { ...s, excluded_at: new Date().toISOString() } : s
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao alterar status.");
    }
  };

  // const handleExcluir = async (id) => {
  //   const confirmar = window.confirm("Deseja excluir este serviço definitivamente?");
  //   if (!confirmar) return;

  //   try {
  //     await serviceService.deletar(id);
  //     setServicos((prev) => prev.filter((s) => s.id !== id));
  //   } catch (err) {
  //     alert(err.response?.data?.error || "Erro ao excluir serviço.");
  //   }
  // };


  const totalAtivos = servicos.filter((servico) => !servico.excluded_at).length;
  const totalInativos = servicos.filter((servico) => servico.excluded_at).length;

  return (
    <>
      <Header />

      <section className="admin-servicos-section">
        <div className="admin-servicos-container">
          <div className="admin-servicos-header">
            <div>
              <span className="admin-servicos-tag">Painel administrativo</span>
              <h2>Gerenciar Serviços</h2>
              <p>
                Cadastre, edite, ative ou desative os serviços exibidos na página pública do PETNET.
              </p>
            </div>

            <div className="admin-servicos-resumo">
              <div>
                <strong>{servicos.length}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{totalAtivos}</strong>
                <span>Ativos</span>
              </div>
              <div>
                <strong>{totalInativos}</strong>
                <span>Inativos</span>
              </div>
            </div>
          </div>

          <div className="admin-servicos-content">
            <form className="admin-servicos-form" onSubmit={handleSalvarServico}>
              <h3>{editandoId ? "Editar serviço" : "Novo serviço"}</h3>

              <label>
                Nome do serviço
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Banho Premium"
                />
              </label>

              <label>
                Descrição
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descreva brevemente o serviço oferecido..."
                />
              </label>
              {/* Feature ainda não implementada, ((não remover)).
              <label>
                Imagem do serviço
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      setForm((prev) => ({ ...prev, servicePicture: reader.result }));
                    reader.readAsDataURL(file);
                  }}
                />
              </label> */}

              <div className="admin-servicos-preview">
                {form.servicePicture && (
                  <div className="admin-servicos-icon-circle">
                    <img src={form.servicePicture || iconeMap[form.name] || banhoIcon} alt="Prévia" style={{ width: 80, height: 80, objectFit: "cover" }} />
                  </div>
                )}
                <div>
                  <strong>{form.name || "Nome do serviço"}</strong>
                  <p>{form.description || "A descrição aparecerá aqui como prévia."}</p>
                </div>
              </div>

              <div className="admin-servicos-form-actions">
                <button type="submit" className="btn-salvar-servico">
                  {editandoId ? "SALVAR ALTERAÇÕES" : "CRIAR SERVIÇO"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    className="btn-cancelar-edicao"
                    onClick={limparFormulario}
                  >
                    CANCELAR
                  </button>
                )}
              </div>
            </form>

            <div className="admin-servicos-lista">
              <div className="admin-servicos-lista-topo">
                <h3>Serviços cadastrados</h3>
                <span>{servicos.length} registros</span>
              </div>

              <div className="admin-servicos-cards">
                {servicos.map((servico) => (
                  <div
                    key={servico.id}
                    className={`admin-servico-card ${servico.excluded_at ? "inativo" : ""}`}
                  >
                    <div className="admin-servico-info">
                      <div className="admin-servicos-icon-circle small">
                        <img src={servico.picture_blob || iconeMap[servico.name] || banhoIcon} alt={servico.name} />
                      </div>

                      <div>
                        <div className="admin-servico-title-line">
                          <h4>{servico.name}</h4>
                          <span className={!servico.excluded_at ? "status ativo" : "status inativo"}>
                            {!servico.excluded_at ? "Ativo" : "Inativo"}
                          </span>
                        </div>

                        <p>{servico.description}</p>
                      </div>
                    </div>

                    <div className="admin-servico-actions">
                      <button
                        type="button"
                        className="btn-editar"
                        onClick={() => handleEditar(servico)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className={!servico.excluded_at ? "btn-desativar" : "btn-ativar"}
                        onClick={() => handleAlternarStatus(servico)}
                      >
                        {!servico.excluded_at ? "Desativar" : "Ativar"}
                      </button>

                      {/* <button
                        type="button"
                        className="btn-excluir"
                        onClick={() => handleExcluir(servico.id)}
                      >
                        Excluir
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminServicos;