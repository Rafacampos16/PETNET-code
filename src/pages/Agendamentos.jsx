import React, { useState } from "react";
import "../styles/agendamentos.css";
import Calendar from "../components/Calendar";
import Pata from "../assets/icons/pata-h.png";
import CalendarIcon from "../assets/icons/calendar.png";
import CalendarIconHover from "../assets/icons/calendar-h.png";
import TimeIcon from "../assets/icons/time.png";
import TimeIconHover from "../assets/icons/time-h.png";

const Agendamentos = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [serviceErrorMsg, setServiceErrorMsg] = useState("");
  const [cpf, setCpf] = useState("");

    const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número

    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setCpf(value);
    };


  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );

    setServiceErrorMsg(""); // remove mensagem quando selecionar algo
  };

  const validarCampos = () => {
    const cliente = document.querySelector("input[placeholder='Digite o CPF']").value;
    const pet = document.querySelector("select").value;
    const data = document.getElementById("dataInput").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFim = document.getElementById("horaFim").value;

    let newErrors = {};

    if (!cliente) newErrors.cliente = true;
    if (!pet || pet === "Selecione o nome do pet") newErrors.pet = true;
    if (!data) newErrors.data = true;
    if (!horaInicio) newErrors.inicio = true;
    if (!horaFim) newErrors.fim = true;
    if (selectedServices.length === 0) {
      newErrors.servicos = true;
      setServiceErrorMsg("Selecione pelo menos um serviço");
    }

    setErrors(newErrors);

    // Se tiver erro, parar
    if (Object.keys(newErrors).length > 0) return;

    // Se tudo ok
    alert("Agendamento realizado com sucesso!");

    // Limpar campos
    setCpf("");
    document.querySelector("input[placeholder='Digite o CPF']").value = "";
    document.getElementById("dataInput").value = "";
    document.getElementById("horaInicio").value = "";
    document.getElementById("horaFim").value = "";
    document.querySelector("select").value = "Selecione o nome do pet";
    setSelectedServices([]);
    setServiceErrorMsg("");
  };

  return (
    <div className="agendamento-container">
      <h1 className="topo2">
        <span className="icon"><img src={Pata} alt="pata" /></span> AGENDAMENTO
      </h1>

      <div className="agendamento-grid">

        <div className="form-left-agendamento">

          <label>Selecione o cliente</label>
            <input
            type="text"
            placeholder="Digite o CPF"
            value={cpf}
            onChange={handleCpfChange}
            maxLength="14"
            className={errors.cliente ? "input-error" : ""}
            />


          <label>Selecione o pet</label>
          <div className={`input-icon-right ${errors.pet ? "input-error" : ""}`}>
            <select>
              <option>Selecione o nome do pet</option>
              <option>Rex</option>
              <option>Mel</option>
              <option>Thor</option>
              <option>Luna</option>
              <option>Bob</option>
            </select>
          </div>

          <label>Selecione a data</label>
          <div className={`input-icon-right ${errors.data ? "input-error" : ""}`}>
            <input 
              type="date"
              id="dataInput"
              onFocus={(e) => e.target.showPicker()}
            />
          </div>

          <label>Escolha o(s) serviços</label>
          <div className="services-grid">
            {[
              "Banho", "Banho terapêutico", "Tosa Higiênica",
              "Tosa(máq. ou tesoura)", "Tosa da raça", "Corte de unhas",
              "Higiene dos ouvidos", "Escovação dental", "Cronograma Capilar",
              "Hidratação Pelagem", "Hidratação Pele", "Teste de porosidade"
            ].map((service) => (
              <button
                key={service}
                className={`service-btn ${selectedServices.includes(service) ? "active" : ""}`}
                onClick={() => toggleService(service)}
              >
                {service}
              </button>
            ))}
          </div>

          {serviceErrorMsg && <p className="erro-service">{serviceErrorMsg}</p>}

          <label>Defina o horário do agendamento</label>
          <div className="linhas-dupla">
            <div>
              <label>Início</label>
              <div className={`input-icon-right ${errors.inicio ? "input-error" : ""}`}>
                <input type="time" id="horaInicio" onFocus={(e) => e.target.showPicker()}/>
              </div>
            </div>

            <div>
              <label>Término</label>
              <div className={`input-icon-right ${errors.fim ? "input-error" : ""}`}>
                <input type="time" id="horaFim" onFocus={(e) => e.target.showPicker()}/>
              </div>
            </div>
          </div>
        </div>

        <div className="calendar-area">
          <div className="calendar-box">
            <Calendar />
          </div>

          <div className="legend">
            <p><span className="leg invalid"></span> Data inválida</p>
            <p><span className="leg full"></span> Horários esgotados</p>
            <p><span className="leg available"></span> Horários disponíveis</p>
          </div>
        </div>
      </div>

      <button className="btn-agendar" onClick={validarCampos}>AGENDAR</button>
    </div>
  );
};

export default Agendamentos;
