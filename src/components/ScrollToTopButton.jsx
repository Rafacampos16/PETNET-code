import React, { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: showButton ? "#f9ee7c" : "transparent",
        border: "0",
        outline: "none",
        boxShadow: showButton ? "0 4px 15px rgba(0,0,0,0.15)" : "none",
        cursor: showButton ? "pointer" : "default",
        opacity: showButton ? 1 : 0,
        transform: showButton ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.3s ease",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: showButton ? "auto" : "none",
      }}
      aria-label="Voltar ao topo"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3370eb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;