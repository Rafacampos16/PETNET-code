import React from "react";
import "../styles/footer.css";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>PETNET</h3>
          <p>
            Cuidando do seu melhor amigo com amor e profissionalismo desde 2010.
          </p>
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
          <p>
            <Phone size={14} /> (11) 3456-7890
          </p>
          <p>
            <Mail size={14} /> contato@petnet.com.br
          </p>
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
          <input type="email" placeholder="Seu e-mail" />
          <button>Inscreva-se</button>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2025 PETNET. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
