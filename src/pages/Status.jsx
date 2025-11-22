import React, { useState } from "react";
import "../styles/status.css";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const StatusPage = () => {
  const [pets, setPets] = useState([
    {
      id: "1",
      name: "Pitufa",
      dono: "Mariana Guerra",
      especie: "Gato",
      servico: "Veterinário",
      peso: "1.5 kg",
      raca: "RND",
      porte: "PP",
      observacao: "Não gosta da cor vermelha.",
      status: "nao-finalizados",
    },
    {
      id: "2",
      name: "Thor",
      dono: "Eduardo Santos",
      especie: "Cachorro",
      servico: "Banho e Tosa",
      peso: "22 kg",
      raca: "Vira-lata",
      porte: "Médio",
      observacao: "Tem alergia a shampoo perfumado.",
      status: "nao-finalizados",
    },
    {
      id: "3",
      name: "Luna",
      dono: "Camila Freitas",
      especie: "Gato",
      servico: "Consulta de Rotina",
      peso: "3.2 kg",
      raca: "Siamês",
      porte: "P",
      observacao: "Muito dócil.",
      status: "em-andamento",
    },
    {
      id: "4",
      name: "Rex",
      dono: "Matheus Silva",
      especie: "Cachorro",
      servico: "Veterinário",
      peso: "35 kg",
      raca: "Pastor Alemão",
      porte: "G",
      observacao: "Ansioso com pessoas desconhecidas.",
      status: "em-andamento",
    },
    {
      id: "5",
      name: "Kiara",
      dono: "Juliana Souza",
      especie: "Cachorro",
      servico: "Banho",
      peso: "7 kg",
      raca: "Shih-tzu",
      porte: "P",
      observacao: "Precisa cortar as unhas.",
      status: "finalizados",
    },
    {
      id: "6",
      name: "Mingau",
      dono: "Gabriel Rocha",
      especie: "Gato",
      servico: "Banho Medicamentoso",
      peso: "4 kg",
      raca: "Persa",
      porte: "P",
      observacao: "Tratamento de pele.",
      status: "nao-finalizados",
    },
    {
      id: "7",
      name: "Pandora",
      dono: "Larissa Reis",
      especie: "Cachorro",
      servico: "Tosa Higiênica",
      peso: "9 kg",
      raca: "Poodle",
      porte: "P",
      observacao: "Late bastante.",
      status: "em-andamento",
    },
    {
      id: "8",
      name: "Bob",
      dono: "Pedro Henrique",
      especie: "Cachorro",
      servico: "Consulta Veterinária",
      peso: "15 kg",
      raca: "Beagle",
      porte: "M",
      observacao: "Come demais.",
      status: "finalizados",
    },
    {
      id: "9",
      name: "Nina",
      dono: "Ana Júlia",
      especie: "Cachorro",
      servico: "Banho e Tosa",
      peso: "5.5 kg",
      raca: "Pug",
      porte: "P",
      observacao: "Dificuldade respiratória leve.",
      status: "nao-finalizados",
    },
    {
      id: "10",
      name: "Zeca",
      dono: "Rodrigo Mendes",
      especie: "Gato",
      servico: "Consulta",
      peso: "4.8 kg",
      raca: "Maine Coon",
      porte: "M",
      observacao: "Muito carinhoso e sociável.",
      status: "finalizados",
    },
  ]);

  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");


  const openModal = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPet(null);
    setIsModalOpen(false);
  };


  // Agora tudo usando o MESMO padrão
  const statusMap = {
    "nao-finalizados": "NÃO FINALIZADOS",
    "em-andamento": "EM ANDAMENTO",
    "finalizados": "FINALIZADOS",
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const petId = result.draggableId;
    const newStatus = result.destination.droppableId;

    setPets((prev) =>
      prev.map((p) =>
        p.id === petId ? { ...p, status: newStatus } : p
      )
    );
  };

  return (
    <div className="status-container">
      <h1 className="status-title">STATUS DO AGENDAMENTO</h1>
      <p className="status-subtitle">
        Arraste os cards entre as colunas para alterar o status do atendimento
        ou clique em <strong>“Ver detalhes”</strong> para editar manualmente.
      </p>


      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="status-columns">
          {Object.keys(statusMap).map((statusKey) => (
            <Droppable droppableId={statusKey} key={statusKey}>
              {(provided, snapshot) => (
                <div
                  className={`status-column ${
                    snapshot.isDraggingOver ? "drag-over" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="column-header">
                    {statusMap[statusKey]}
                  </div>

                  {pets
                    .filter((p) => p.status === statusKey)
                    .map((pet, index) => (
                      <Draggable
                        key={pet.id}
                        draggableId={pet.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="pet-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="pet-card-header">
                              PET: {pet.name}
                            </div>

                           <div className="pet-details">
                              <p><strong>Serviço:</strong> {pet.servico}</p>
                              <p><strong>Observações:</strong> {pet.observacao}</p>

                              <button
                                className="detalhes-btn"
                                onClick={() => openModal(pet)}
                              >
                                Ver detalhes
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

            {isModalOpen && selectedPet && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Pet</h2>

            <p><strong>Nome:</strong> {selectedPet.name}</p>
            <p><strong>Dono:</strong> {selectedPet.dono}</p>
            <p><strong>Espécie:</strong> {selectedPet.especie}</p>
            <p><strong>Serviço:</strong> {selectedPet.servico}</p>
            <p><strong>Peso:</strong> {selectedPet.peso}</p>
            <p><strong>Raça:</strong> {selectedPet.raca}</p>
            <p><strong>Porte:</strong> {selectedPet.porte}</p>
            <p><strong>Observação:</strong> {selectedPet.observacao}</p>

              <button
                className="edit-status-btn"
                onClick={() => {
                  setNewStatus(selectedPet.status); 
                  setIsEditingStatus(true);
                }}
              >
                Editar status
              </button>

              {isEditingStatus && (
          <div className="edit-status-box">
            <label>Selecione o novo status:</label>

            <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="naoFinalizados">Não finalizados</option>
                <option value="emAndamento">Em andamento</option>
                <option value="finalizados">Finalizados</option>
              </select>

              <button
                className="save-status-btn"
                onClick={() => {
                  setPets((prev) =>
                    prev.map((p) =>
                      p.id === selectedPet.id ? { ...p, status: newStatus } : p
                    )
                  );
                  setIsEditingStatus(false);
                  setIsModalOpen(false);
                }}
              >
                Salvar
              </button>
            </div>
          )}


            <button className="close-modal-btn" onClick={closeModal}>
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StatusPage;
