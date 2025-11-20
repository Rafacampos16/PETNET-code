import React, { useState } from "react";
import "../styles/calendar.css";
import Modal from "./Modal";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);


  // STATUS EXEMPLO
  const statusMap = {
    invalid: [3, 10, 21],
    full: [7, 11, 18],
    available: [1, 5, 12, 22, 27]
  };

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getStatus = (day) => {
    if (statusMap.invalid.includes(day)) return "invalid";
    if (statusMap.full.includes(day)) return "full";
    if (statusMap.available.includes(day)) return "available";
    return "";
  };

  const handleDayClick = (day, status) => {
    if (!status) return;
    setSelectedDay(day);
    setModalType(status);
    setModalOpen(true);
  };


  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e-${i}`} className="empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const status = getStatus(i);

      days.push(
        <div
          key={i}
          className={`day ${status}`}
          onClick={() => handleDayClick(i, status)}
        >
          <span className="day-number">{i}</span>
          <div className="status-line"></div>
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth}>{"<"}</button>
          <h3>{months[currentMonth]} {currentYear}</h3>
          <button onClick={nextMonth}>{">"}</button>
        </div>

        <div className="weekdays">
          <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div>
          <div>Qui</div><div>Sex</div><div>Sab</div>
        </div>

        <div className="days">{renderDays()}</div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        dia={selectedDay}
        horarios={["08:00", "09:30", "11:00", "14:00", "16:00"]}
        horariosOcupados={["08:00", "09:30", "11:00"]}
      />
    </>
  );
};

export default Calendar;
