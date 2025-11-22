import React from "react";
import "../styles/about.css";
import DogImg from "../assets/icons/dog.jpg";
import { CheckCircle } from "lucide-react";

const About = () => {
  const checkItems = [
    "Equipe especializada",
    "Ambiente acolhedor",
    "Produtos premium",
    "Atendimento personalizado",
  ];

  return (
    <section id="about" className="section-padding about-section">
      <div className="container">
        <h1 className="section-title-large">Sobre o PETNET</h1>
        <div className="linha-amarela"></div>

        <div className="about-content">
          {/* Imagem */}
          <div className="about-image">
            <img
              src={DogImg}
              alt="Veterinário examinando um cão"
              className="about-dog"
            />
          </div>

          {/* Texto */}
          <div className="about-text">
            <h2>
              Cuidando com <span>amor e profissionalismo</span>
            </h2>

            <p>
              O PETNET nasceu da paixão por animais e do desejo de oferecer
              serviços de alta qualidade. Há mais de 28 anos, cuidamos dos
              animais de estimação da nossa comunidade com dedicação e carinho.
            </p>

            <p>
              Nossa equipe é formada por profissionais qualificados e
              apaixonados por animais, sempre atualizados com as melhores
              técnicas e produtos de mercado pet.
            </p>

            <div className="check-item-grid">
              {checkItems.map((item, i) => (
                <div key={i} className="check-item">
                  <CheckCircle size={20} className="check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
