import React from "react";
import "../styles/services.css";
import { Bath, Stethoscope, Package, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Services = () => {

  const navigate = useNavigate();
  const services = [
    {
      icon: Bath,
      title: "Banho e Tosa",
      description:
        "Banhos com produtos específicos para cada tipo de pelagem e tosa higiênica ou estética conforme a necessidade do seu pet.",
      items: ["Banho medicinal", "Tosa higiênica", "Tosa estética"],
    },
    {
      icon: Stethoscope,
      title: "Veterinário",
      description:
        "Atendimento veterinário completo para garantir a saúde e o bem-estar do seu animal de estimação. Nossa equipe cuida com carinho e atenção em cada consulta.",
      items: ["Consultas de rotina", "Vacinação", "Exames laboratoriais"],
    },
    {
      icon: Package,
      title: "Pacotes Mensais",
      description:
        "Garanta o bem-estar contínuo do seu melhor amigo com nossos pacotes de banho e tosa, que oferecem economia e saúde.",
      items: ["Economia Garantida", "Saúde e Higiene Constantes", "Comodidade Exclusiva"],
    },
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2 className="services-title">Nossos Serviços</h2>
        <div className="linha-amarela"></div>
        <p className="services-subtitle">
          Oferecemos uma variedade de serviços para garantir que seu pet esteja sempre saudável, limpo e feliz.
        </p>

        <div className="services-grid">
          {services.map(({ icon: Icon, title, description, items }, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">
                <Icon size={48} color="#fff" />
              </div>

              <div className="service-content">
                <h3>{title}</h3>
                <p>{description}</p>

                <ul className="service-list">
                  {items.map((item, index) => (
                    <li key={index}>
                      <CheckCircle size={18} className="check-icon" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="service-button" onClick={() => navigate("/servicos")}>
                Ver mais
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
