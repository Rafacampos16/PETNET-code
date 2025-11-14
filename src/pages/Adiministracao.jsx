import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
    };

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-900">
      {/* Top Bar */}
      <header className="w-full bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <button className="text-white text-3xl">☰</button>
        <h1 className="text-2xl font-bold tracking-wide">ADMINISTRACAO</h1>
        <div></div>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 mt-10">
        <Link to="/agendamentos" className="bg-white rounded-xl border p-10 shadow hover:shadow-lg transition text-center text-blue-600 font-bold text-xl">
          AGENDAMENTOS
        </Link>

        <Link to="/clientes" className="bg-white rounded-xl border p-10 shadow hover:shadow-lg transition text-center text-blue-600 font-bold text-xl">
          CLIENTES
        </Link>

        <Link to="/pets" className="bg-white rounded-xl border p-10 shadow hover:shadow-lg transition text-center text-blue-600 font-bold text-xl">
          PETS
        </Link>
      </div>

        <button onClick={handleLogout} className="btn-sair">
        Sair
        </button>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-10 mt-16 pb-16">
        {/* Pie Chart Placeholder */}
        <div className="bg-white rounded-xl border p-6 shadow flex justify-center items-center h-[380px]">
          <p className="text-gray-500">[ Grafico de pizza aqui ]</p>
        </div>

        {/* Bar Chart Placeholder */}
        <div className="bg-white rounded-xl border p-6 shadow flex justify-center items-center h-[380px]">
          <p className="text-gray-500">[ Grafico de barras aqui ]</p>
        </div>
      </div>
    </div>

    
  );
}
