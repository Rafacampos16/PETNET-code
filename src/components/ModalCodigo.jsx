import React, { useState, useEffect, useRef } from "react";
import "../styles/modalCodigo.css";

export default function ModalCodigo({ email, onClose, onSuccess }) {
  const [codigo, setCodigo] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // TIMER DO BOTÃO REENVIAR
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // DIGITAÇÃO E MOVIMENTO ENTRE CAIXAS
  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newCodigo = [...codigo];
      newCodigo[index] = value;
      setCodigo(newCodigo);

      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !codigo[index]) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const finalCode = codigo.join("");
    console.log("Código inserido:", finalCode);

    if (finalCode === "123456") {
      onSuccess();
    } else {
      alert("Código incorreto!");
    }
  };

  const handleResend = () => {
    console.log("Código reenviado para:", email);
    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="modal-bg">
      <div className="modal-codigo">
        <h2 className="titulo-modal">Digite o código que enviamos para seu e-mail.</h2>

        <p className="email-texto">{email}</p>

        <div className="code-inputs">
          {codigo.map((num, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={num}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="code-box"
            />
          ))}
        </div>

        <button className="btn-confirmar" onClick={handleSubmit}>
          Confirmar
        </button>

        <button
          className="btn-reenviar"
          onClick={handleResend}
          disabled={!canResend}
        >
          {canResend ? "Reenviar código" : `Reenviar código em ${timer}s`}
        </button>

        <button className="fechar" onClick={onClose}>X</button>
      </div>
    </div>
  );
}
