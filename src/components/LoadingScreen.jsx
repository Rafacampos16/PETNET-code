import React from "react";
import "../styles/loading.css";
import pawCatIcon from "../assets/icons/paw-cat.png";

export default function LoadingScreen({
  title = "Carregando",
  subtitle = "Estamos preparando tudo para você...",
}) {
  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="loading-icon-wrapper">
          <div className="loading-icon-circle">
            <img src={pawCatIcon} alt="Carregando" className="loading-icon-img" />
          </div>
        </div>

        <h2 className="loading-title">{title}</h2>
        <p className="loading-subtitle">{subtitle}</p>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}