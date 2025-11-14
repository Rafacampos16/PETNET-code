import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PataIcon from "../assets/icons/pata.png";
import PetsIcon from "../assets/icons/pets.png";
import ContaIcon from "../assets/icons/conta.png";
import PetsIconHover from "../assets/icons/pets-h.png";
import PataIconHover from "../assets/icons/pata-h.png";
import ContaIconHover from "../assets/icons/conta-h.png";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  const [petsHover, setPetsHover] = useState(false);
  const [pataHover, setPataHover] = useState(false);
  const [contaHover, setContaHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div
            className="logo-center"
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              color: "white",
              textDecoration: "none",
            }}
          >
            PETNET
          </div>

          {/* Botão do menu hambúrguer */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          </div>

          {/* Itens do menu desktop */}
          <div className="header-right">
            <div
              className="menu-item"
              onMouseEnter={() => setPetsHover(true)}
              onMouseLeave={() => setPetsHover(false)}
              onClick={() => navigate("/servicos")}
            >
              <img
                src={petsHover ? PetsIconHover : PetsIcon}
                alt="Serviços"
                className="icon-link"
              />
              <span
                style={{
                  color: petsHover ? "var(--petnet-yellow)" : "white",
                }}
              >
                Serviços
              </span>
            </div>

            <div
              className="menu-item"
              onMouseEnter={() => setPataHover(true)}
              onMouseLeave={() => setPataHover(false)}
              onClick={() => navigate("/pets")}
            >
              <img
                src={pataHover ? PataIconHover : PataIcon}
                alt="Pets"
                className="icon-link"
              />
              <span
                style={{
                  color: pataHover ? "var(--petnet-yellow)" : "white",
                }}
              >
                Pets
              </span>
            </div>

            <div
              className="menu-item"
              onMouseEnter={() => setContaHover(true)}
              onMouseLeave={() => setContaHover(false)}
              onClick={() => navigate("/conta")}
            >
              <img
                src={contaHover ? ContaIconHover : ContaIcon}
                alt="Conta"
                className="icon-link"
              />
              <span
                style={{
                  color: contaHover ? "var(--petnet-yellow)" : "white",
                }}
              >
                Conta
              </span>
            </div>
          </div>

          {/* Menu lateral (mobile) */}
          <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
            <span onClick={() => { navigate("/servicos"); setMenuOpen(false); }}>Serviços</span>
            <span onClick={() => { navigate("/pets"); setMenuOpen(false); }}>Pets</span>
            <span onClick={() => { navigate("/conta"); setMenuOpen(false); }}>Conta</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
