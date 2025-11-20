import React from "react";
import "../styles/Modal.css";

export default function Modal({ open, onClose, type, horarios = [], horariosOcupados = [] }) {
  if (!open) return null;

 const renderContent = () => {
    switch (type) {
      case "invalid":
        return (
          <p>Essa data nao esta disponivel para agendamento devido a restricoes ou feriados. Escolha outra data no calendario.</p>
        );

      case "full":
        return (
          <>
            <p>Todos os horarios desse dia ja estao reservados.</p>
            <h4>Horarios agendados:</h4>
            <ul className="lista">
              {horariosOcupados.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </>
        );

      case "available":
        return (
          <>
            <p>Horarios disponiveis:</p>
            <div className="horarios">
              {horarios.map((h, i) => (
                <button key={i} className="btn-horario">{h}</button>
              ))}
            </div>
          </>
        );

      default:
        return <p>Erro ao carregar informacoes.</p>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close" onClick={onClose}>X</button>
        {renderContent()}
      </div>
    </div>
  );
}

