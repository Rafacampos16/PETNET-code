import React, { useState } from "react";
import "../styles/footer.css";
import emailjs from "emailjs-com";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, X } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    if (!email) return alert("Digite um e-mail válido");

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { email },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setIsModalOpen(true);
        setEmail("");
      })
      .catch((error) => {
        console.error("Erro ao enviar:", error);
        alert("Ocorreu um erro ao enviar seu e-mail. Tente novamente.");
      });

  };

  return (
    <>
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>PETNET</h3>
            <p>Cuidando do seu melhor amigo com amor e profissionalismo desde 2010.</p>
            <div className="social-icons">
              <Facebook size={18} />
              <Instagram size={18} />
              <Twitter size={18} />
            </div>
          </div>

          <div>
            <h4>Contato</h4>
            <p>
              <MapPin size={14} /> Av. Nair Toledo de Mira - Jardim Paulista
              <br />
              São José dos Campos - SP
            </p>
            <p><Phone size={14} /> (11) 3456-7890</p>
            <p><Mail size={14} /> contato@petnet.com.br</p>
          </div>

          <div>
            <h4>Horário</h4>
            <p>Segunda - Sexta: <b>8h às 19h</b></p>
            <p>Sábado: <b>8h às 17h</b></p>
            <p>Domingo: <b>Fechado</b></p>
            <p>Feriados: <b>9h às 15h</b></p>
          </div>

          <div>
            <h4>Inscreva-se</h4>
            <p>Receba nossas novidades e promoções exclusivas.</p>

            <form onSubmit={sendEmail} className="newsletter-form">
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Inscreva-se</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2025 PETNET. Todos os direitos reservados.
        </div>
      </footer>

      {/* MODAL DE CONFIRMAÇÃO */}
  
      {isModalOpen && (
      <div className="modal-bg">
        <div className="modal-confirmacao">
          <h2>Inscrição realizada!</h2>
          <p>Você foi inscrito com sucesso e receberá novidades em breve 🐾</p>
          <button onClick={() => setIsModalOpen(false)}>Fechar</button>
        </div>
      </div>
      )}

    </>
  );
};

export default Footer;
