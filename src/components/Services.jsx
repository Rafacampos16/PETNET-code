import React from "react";
import "../styles/services.css";
import {
  Bath,
  Stethoscope,
  Package,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const services = [
    {
      icon: Bath,
      title: "Banho e Tosa",
      description:
        "Banhos com produtos especificos para cada tipo de pelagem e tosa higienica ou estetica conforme a necessidade do seu pet.",
      items: ["Banho medicinal", "Tosa higienica", "Tosa estetica"]
    },
    {
      icon: Stethoscope,
      title: "Veterinario",
      description:
        "Atendimento veterinario completo para garantir a saude e o bem-estar do seu animal com carinho, seguranca e atencao.",
      items: ["Consultas de rotina", "Vacinacao", "Exames laboratoriais"]
    },
    {
      icon: Package,
      title: "Pacotes Mensais",
      description:
        "Mais economia, praticidade e cuidado continuo para manter o seu melhor amigo sempre bem cuidado.",
      items: ["Economia garantida", "Saude constante", "Comodidade exclusiva"]
    }
  ];

  return (
    <section
      id="services"
      className="services-section"
      style={{
        padding: "5rem 1rem",
        background:
          "linear-gradient(180deg, #eef6ff 0%, #f7fbff 100%)"
      }}
    >
      <div className="container">
        <div
          className="services-heading"
          style={{
            textAlign: "center",
            maxWidth: "720px",
            margin: "0 auto 3rem"
          }}
        >
          <h2
            className="services-title"
            style={{
              fontSize: "2.2rem",
              fontWeight: "900",
              color: "var(--petnet-blue)",
              marginBottom: "0.4rem"
            }}
          >
            Nossos Servicos
          </h2>

          <div
            style={{
              width: "100px",
              height: "4px",
              backgroundColor: "var(--petnet-yellow)",
              margin: "0 auto 1.3rem",
              borderRadius: "999px"
            }}
          ></div>

          <p
            className="services-subtitle"
            style={{
              color: "rgba(0, 0, 0, 0.72)",
              fontSize: "1rem",
              lineHeight: "1.7"
            }}
          >
            Solucoes pensadas para oferecer conforto, saude e bem-estar em cada
            etapa do cuidado com o seu pet.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: "1.5rem",
            alignItems: "stretch"
          }}
        >
          {services.map(({ icon: Icon, title, description, items }, i) => (
            <article
              key={i}
              className="service-card"
              style={{
                width: "100%",
                minWidth: "0",
                background: "rgba(255, 255, 255, 0.92)",
                borderRadius: "26px",
                padding: "1.5rem",
                border: "1px solid rgba(51, 112, 235, 0.08)",
                boxShadow: "0 16px 32px rgba(31, 61, 123, 0.08)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  marginBottom: "1rem",
                  textAlign: "center"
                }}
              >
                <div
                  className="service-icon"
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, var(--petnet-blue), #5f94ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    margin: "0 auto 1rem auto"
                  }}
                >
                  <Icon size={34} />
                </div>

                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "800",
                    color: "var(--petnet-blue)",
                    margin: 0
                  }}
                >
                  {title}
                </h3>
              </div>

              <p
                style={{
                  color: "rgba(0, 0, 0, 0.72)",
                  fontSize: "0.97rem",
                  lineHeight: "1.65",
                  marginBottom: "1.2rem"
                }}
              >
                {description}
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.4rem 0",
                  display: "grid",
                  gap: "0.7rem",
                  flexGrow: 1
                }}
              >
                {items.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      color: "#1f2c47",
                      fontSize: "0.95rem",
                      fontWeight: "600"
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: "var(--petnet-blue)", flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/servicos")}
                onMouseEnter={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #F9EE7C, #FFE666)";
                  e.target.style.color = "#1f2c47";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, var(--petnet-blue), #5f94ff)";
                  e.target.style.color = "white";
                }}
                style={{
                  marginTop: "auto",
                  background: "linear-gradient(135deg, var(--petnet-blue), #5f94ff)",
                  color: "white",
                  fontWeight: "800",
                  border: "none",
                  borderRadius: "16px",
                  padding: "0.9rem 1rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  transition: "all 0.25s ease"
                }}
              >
                Ver mais
                <ArrowRight size={18} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;