import React, { useState } from "react";
import "../styles/minha_conta.css";
import SinoIcon from "../assets/icons/sininho.png";
import SinoIconHover from "../assets/icons/sininho-h.png";
import IconSenha from "../assets/icons/lock.png";
import IconSenhaHover from "../assets/icons/lock-h.png";
import IconEdit from "../assets/icons/edit.png";
import IconEditHover from "../assets/icons/edit-h.png";
import IconLogout from "../assets/icons/logout.png";
import IconLogoutHover from "../assets/icons/logout-h.png";


export default function MinhaConta() {
  // ============================
  // ESTADOS PRINCIPAIS
  // ============================
  const [foto, setFoto] = useState(null);
  const [hoverSino, setHoverSino] = useState(false);
  const [hoverSenha, setHoverSenha] = useState(false);
  const [hoverEdit, setHoverEdit] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);



  const [dados, setDados] = useState({
    nome: "Mariana Oliveira Silva",
    email: "marina.oliveira@gmail.com",
    telefone: "(12) 98876-4321",
    endereco: "Rua das Orquídeas, 245 – Guaratinguetá/SP",
  });

  const [formEditar, setFormEditar] = useState(dados);
  const [abaEditar, setAbaEditar] = useState("pessoal");

  const [modalAgendamentos, setModalAgendamentos] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalNotificacoes, setModalNotificacoes] = useState(false);

  // ============================
  // FUNÇÕES
  // ============================
  function handleFoto(e) {
    const file = e.target.files[0];
    if (file) setFoto(file);
  }

  function abrirModalEditar() {
    setFormEditar(dados);
    setAbaEditar("pessoal");
    setModalEditar(true);
  }

  function atualizarCampo(e) {
    setFormEditar({
      ...formEditar,
      [e.target.name]: e.target.value,
    });
  }

  function salvarAlteracoes(e) {
    e.preventDefault();
    setDados(formEditar);
    setModalEditar(false);
  }

  function sair() {
    localStorage.clear();
    window.location.href = "/conta";
  }

  // ============================
  // RENDER
  // ============================
  return (
    <div className="container-conta">
      {/* CABEÇALHO */}
      <div className="top-bar">
        <h1 className="titulo-conta">MINHA CONTA</h1>

       <img
        src={hoverSino ? SinoIconHover : SinoIcon}
        alt="Notificações"
        className="icone-sino"
        onClick={() => setModalNotificacoes(true)}
        onMouseEnter={() => setHoverSino(true)}
        onMouseLeave={() => setHoverSino(false)}
        />

      </div>

      <p className="subtitulo-conta">
        Mantenha seu perfil sempre atualizado e acompanhe os agendamentos do seu pet.
      </p>

      {/* ÁREA PRINCIPAL */}
      <div className="area-info">
        {/* ESQUERDA */}
        <div className="info-esquerda">
          <div className="info-bloco">
            <h2 className="titulo-section">Nome do tutor</h2>
            <p className="info-item">
              {dados.nome}
              <button className="edit-btn" onClick={abrirModalEditar}>
                Editar
              </button>
            </p>
          </div>

          <div className="info-bloco">
            <h2 className="titulo-section">E-mail</h2>
            <p className="info-item">
              {dados.email}
              <button className="edit-btn" onClick={abrirModalEditar}>
                Editar
              </button>
            </p>
          </div>

          <div className="info-bloco">
            <h2 className="titulo-section">Telefone</h2>
            <p className="info-item">
              {dados.telefone}
              <button className="edit-btn" onClick={abrirModalEditar}>
                Editar
              </button>
            </p>
          </div>

          <div className="info-bloco">
            <h2 className="titulo-section">Endereço</h2>
            <p className="info-item">
              {dados.endereco}
              <button className="edit-btn" onClick={abrirModalEditar}>
                Editar
              </button>
            </p>
          </div>
        </div>

       {/* DIREITA - FOTO */}
<div className="foto-area">
  <h2 className="titulo-section foto-titulo">Foto do pet ou tutor</h2>

  <div className="foto-container">
    <label className="upload-box">
      {foto ? (
        <img src={URL.createObjectURL(foto)} className="foto-preview" />
      ) : (
        <p>SEM FOTO</p>
      )}
      <input type="file" accept="image/*" onChange={handleFoto} />
    </label>
  </div>

  {!foto ? (
    <button className="foto-btn" onClick={() => document.querySelector("#fileInputFake").click()}>
      Adicionar foto
    </button>
  ) : (
    <div className="foto-btns">
      <button className="foto-btn trocar" onClick={() => document.querySelector("#fileInputFake").click()}>
        Trocar foto
      </button>
      <button className="foto-btn remover" onClick={() => setFoto(null)}>
        Remover foto
      </button>
    </div>
  )}

  {/* input escondido só pro botão chamar */}
  <input
    id="fileInputFake"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handleFoto}
  />
</div>
      </div>

      <div className="linha"></div>

      {/* PREFERÊNCIAS */}
      <h2 className="titulo-section">Preferências</h2>
      <div className="prefs-box">
        <div className="toggle-line">
          <span>Receber lembretes</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="toggle-line">
          <span>Receber promoções</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="linha"></div>

      {/* AGENDAMENTOS */}
      <h2 className="titulo-section">Meus Agendamentos</h2>
      <table className="tabela-agendamentos">
        <thead>
          <tr>
            <th>Serviço</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Banho e tosa</td>
            <td>10/10/2025</td>
            <td>15:00</td>
            <td className="status concluido">Concluído</td>
          </tr>
          <tr>
            <td>Escovação dental</td>
            <td>15/10/2025</td>
            <td>10:30</td>
            <td className="status aguardando">Aguardando</td>
          </tr>
          <tr>
            <td>Hidratação</td>
            <td>20/10/2025</td>
            <td>14:00</td>
            <td className="status agendado">Agendado</td>
          </tr>
        </tbody>
      </table>

      <button
        className="ver-agendamentos"
        onClick={() => setModalAgendamentos(true)}
      >
        Ver todos os agendamentos
      </button>

      <div className="linha"></div>

      {/* AÇÕES */}
      <div className="acoes-lista">

        <p
            onMouseEnter={() => setHoverSenha(true)}
            onMouseLeave={() => setHoverSenha(false)}
        >
            <img
            src={hoverSenha ? IconSenhaHover : IconSenha}
            alt="Alterar senha"
            className="acao-icon"
            />
            Alterar senha
        </p>

        <p
            onMouseEnter={() => setHoverEdit(true)}
            onMouseLeave={() => setHoverEdit(false)}
        >
            <img
            src={hoverEdit ? IconEditHover : IconEdit}
            alt="Atualizar informações do pet"
            className="acao-icon"
            />
            Atualizar informações do pet
        </p>

        <p
            className="sair-btn"
            onClick={sair}
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
        >
            <img
            src={hoverLogout ? IconLogoutHover : IconLogout}
            alt="Sair da conta"
            className="acao-icon"
            />
            Sair da conta
        </p>

        </div>

      {/* ============================
          MODAL AGENDAMENTOS
      ============================ */}
     {modalAgendamentos && (
  <div className="modal-bg" onClick={() => setModalAgendamentos(false)}>
    <div className="modal-agendamentos" onClick={(e) => e.stopPropagation()}>

      <div className="agend-topo">
        <h2>Todos os Agendamentos</h2>
        <button className="btn-close-x" onClick={() => setModalAgendamentos(false)}>×</button>
      </div>

      <div className="agend-lista">

        <div className="agend-item">
          <span className="agend-title">Banho e Tosa</span>
          <p className="agend-info">10/10/2025 às 15:00</p>
          <span className="agend-status concluido">Concluído</span>
        </div>

        <div className="agend-item">
          <span className="agend-title">Escovação Dental</span>
          <p className="agend-info">15/10/2025 às 10:30</p>
          <span className="agend-status aguardando">Aguardando</span>
        </div>

        <div className="agend-item">
          <span className="agend-title">Hidratação</span>
          <p className="agend-info">20/10/2025 às 14:00</p>
          <span className="agend-status agendado">Agendado</span>
        </div>

        {/* Novos itens que você pediu */}
        <div className="agend-item">
          <span className="agend-title">Corte de Unhas</span>
          <p className="agend-info">25/10/2025 às 16:00</p>
          <span className="agend-status agendado">Agendado</span>
        </div>

        <div className="agend-item">
          <span className="agend-title">Consulta Veterinária</span>
          <p className="agend-info">30/10/2025 às 09:00</p>
          <span className="agend-status aguardando">Aguardando</span>
        </div>

      </div>

    </div>
  </div>
)}


      {/* ============================
          MODAL EDITAR COM TABS
      ============================ */}
      {modalEditar && (
        <div className="modal-bg" onClick={() => setModalEditar(false)}>
          <div className="modal modal-editar" onClick={(e) => e.stopPropagation()}>
            
            <div className="tabs-editar">
              <button
                className={abaEditar === "pessoal" ? "tab ativa" : "tab"}
                onClick={() => setAbaEditar("pessoal")}
              >
                Dados pessoais
              </button>

              <button
                className={abaEditar === "endereco" ? "tab ativa" : "tab"}
                onClick={() => setAbaEditar("endereco")}
              >
                Endereço
              </button>
            </div>

            <h2 className="modal-titulo">Editar Informações</h2>

            <form className="form-editar" onSubmit={salvarAlteracoes}>
              {abaEditar === "pessoal" && (
                <>
                  <label>
                    Nome
                    <input
                      name="nome"
                      type="text"
                      value={formEditar.nome}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    E-mail
                    <input
                      name="email"
                      type="email"
                      value={formEditar.email}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Telefone
                    <input
                      name="telefone"
                      type="text"
                      value={formEditar.telefone}
                      onChange={atualizarCampo}
                    />
                  </label>
                </>
              )}

              {abaEditar === "endereco" && (
                <>
                  <label>
                    Endereço completo
                    <input
                      name="endereco"
                      type="text"
                      value={formEditar.endereco}
                      onChange={atualizarCampo}
                    />
                  </label>
                </>
              )}

              <div className="botoes-editar">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setModalEditar(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================
          MODAL NOTIFICAÇÕES
      ============================ */}
      {modalNotificacoes && (
        <div className="modal-bg" onClick={() => setModalNotificacoes(false)}>
            <div className="modal modal-notificacoes" onClick={(e) => e.stopPropagation()}>

            <div className="notif-topo">
                <h2>Notificações</h2>
                <button className="btn-close-x" onClick={() => setModalNotificacoes(false)}>×</button>
            </div>

            <div className="notif-lista">
                <div className="notif-item">
                <span className="notif-titulo">Agendamento amanhã</span>
                <p className="notif-desc">Seu pet tem um banho marcado amanhã às 15h.</p>
                </div>

                <div className="notif-item">
                <span className="notif-titulo">Promoção ativa</span>
                <p className="notif-desc">Banho e tosa com 20% OFF até sexta!</p>
                </div>
            </div>

            </div>
        </div>
        )}
    </div>
  );
}
