import React from "react";
import { DayPicker } from "react-day-picker";
import {
  addMonths,
  endOfMonth,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth
} from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-day-picker/style.css";

const InteractiveCalendar = ({
  selectedDate,
  onSelectDate,
  disponibilidadePorData
}) => {
  const today = startOfDay(new Date());
  const inicioMesAtual = startOfMonth(today);
  const fimProximoMes = endOfMonth(addMonths(today, 1));

  const datasBloqueadas = Object.entries(disponibilidadePorData)
    .filter(([, status]) => status === "bloqueada")
    .map(([data]) => new Date(`${data}T12:00:00`));

  const datasSemHorarios = Object.entries(disponibilidadePorData)
    .filter(([, status]) => status === "semHorarios")
    .map(([data]) => new Date(`${data}T12:00:00`));

  const datasDisponiveis = Object.entries(disponibilidadePorData)
    .filter(([, status]) => status === "disponivel")
    .map(([data]) => new Date(`${data}T12:00:00`));

  const isDataIndisponivel = (date) => {
    const dia = startOfDay(date);

    return (
      isBefore(dia, today) ||
      isBefore(dia, inicioMesAtual) ||
      isAfter(dia, fimProximoMes)
    );
  };

  return (
    <div className="interactive-calendar">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        locale={ptBR}
        showOutsideDays
        fixedWeeks
        disabled={(date) => isDataIndisponivel(date)}
        modifiers={{
          blocked: datasBloqueadas,
          full: datasSemHorarios,
          available: datasDisponiveis
        }}
        modifiersClassNames={{
          blocked: "day-invalid",
          full: "day-full",
          available: "day-available",
          selected: "day-selected-custom"
        }}
      />
    </div>
  );
};

export default InteractiveCalendar;