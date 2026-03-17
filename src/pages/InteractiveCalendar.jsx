import React from "react";
import { DayPicker } from "react-day-picker";
import { isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-day-picker/style.css";

const InteractiveCalendar = ({
  selectedDate,
  onSelectDate,
  horariosPorData
}) => {
  const today = startOfDay(new Date());

  const datasSemHorario = Object.entries(horariosPorData)
    .filter(([, horarios]) => horarios.length === 0)
    .map(([data]) => new Date(`${data}T12:00:00`));

  const datasComHorario = Object.entries(horariosPorData)
    .filter(([, horarios]) => horarios.length > 0)
    .map(([data]) => new Date(`${data}T12:00:00`));

  return (
    <div className="interactive-calendar">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        locale={ptBR}
        showOutsideDays
        fixedWeeks
        disabled={(date) => isBefore(startOfDay(date), today)}
        modifiers={{
          full: datasSemHorario,
          available: datasComHorario
        }}
        modifiersClassNames={{
          full: "day-full",
          available: "day-available",
          selected: "day-selected-custom"
        }}
      />
    </div>
  );
};

export default InteractiveCalendar;