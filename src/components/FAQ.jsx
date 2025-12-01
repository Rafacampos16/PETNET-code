  import React, { useState } from "react";
  import "../styles/faq.css";
  import { ChevronDown } from "lucide-react";
  import { FaPaw, FaRegCommentDots } from "react-icons/fa";


  const FAQ = () => {
    const faqItems = [
      {
        q: "Quanto tempo dura o banho e tosa?",
        a: "O tempo de banho e tosa varia conforme o tamanho, raça e condição da pelagem do pet. Em média, o processo completo leva de 2 a 3 horas. Para raças de pelo longo ou com nós, pode levar mais tempo.",
      },
      {
        q: "Preciso agendar com antecedência?",
        a: "Recomendamos o agendamento prévio, especialmente nos fins de semana e feriados, para garantir o melhor horário para você e seu pet.",
      },
      {
        q: "Quais vacinas meu pet precisa ter?",
        a: "O veterinário fará uma avaliação completa, mas as vacinas essenciais incluem a V8/V10 (cães) ou Tríplice (gatos) e a vacina antirrábica, conforme o calendário de vacinação.",
      },
      {
        q: "Como funciona o banho medicamentoso?",
        a: "O banho medicamentoso é realizado sob orientação veterinária, utilizando shampoos específicos para tratamento de pele, e requer um tempo de ação maior para eficácia.",
      },
      {
        q: "Vocês atendem emergências?",
        a: "Atendemos emergências durante o horário de funcionamento, mas recomendamos ligar antes para que nossa equipe possa se preparar para receber seu pet da melhor forma.  ",
      },
    ];

    const AccordionItem = ({ question, answer }) => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div style={{ backgroundColor: "#fff", border: "1px solid #dbeafe", borderRadius: "8px", marginBottom: "0.75rem" }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: "100%",
              textAlign: "left",
              backgroundColor: "#f8fafc",
              border: "none",
              padding: "1rem 1.25rem",
              fontSize: "1rem",
              fontWeight: "600",
              color: "var(--petnet-blue)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span>{question}</span>
            <ChevronDown
              size={20}
              style={{
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
          {isOpen && (
            <div style={{ padding: "1rem 1.25rem", backgroundColor: "#fff", color: "rgba(0, 0, 0, 0.7)" }}>
              <p>{answer}</p>
            </div>
          )}
        </div>
      );
    };

    return (
      <section id="faq" style={{ backgroundColor: "#f9fafb", padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ textAlign: "center", color: "#3370EB", fontWeight: "700", fontSize: "1.75rem" }}>Dúvidas Frequentes</p>
          <div
            style={{
              width: "80px",
              height: "3px",
              backgroundColor: "#F9EE7C",
              margin: "0 auto 2rem auto",
              borderRadius: "3px",
            }}
          ></div>

          {faqItems.map((item, i) => (
            <AccordionItem key={i} question={item.q} answer={item.a} />
          ))}

          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#eef6ff",
              border: "1px solid #dbeafe",
              borderRadius: "10px",
              padding: "1rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaPaw style={{ color: "#3370EB", fontSize: "1.5rem" }} />
              <p style={{ color: "#3370EB", fontWeight: "600", fontSize: "1rem" }}>Restou alguma dúvida?</p>
            </div>

            <a
              href={`https://wa.me/5512992136141?text=${encodeURIComponent(
                "Olá! Restou uma dúvida e gostaria de mais informações, pode me ajudar?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#F9EE7C",
                color: "#3370EB",
                fontWeight: "600",
                padding: "0.6rem 1.25rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Entre em contato
              <FaRegCommentDots />
            </a>
          </div>
        </div>
      </section>
    );
  };

  export default FAQ;
