import emailjs from "emailjs-com";

export async function enviarEmailConfirmacaoAgendamento(agendamento) {
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRM_AGENDAMENTO_ID,
    {
      email: agendamento.clienteEmail,
      nome_cliente: agendamento.clienteNome,
      nome_pet: agendamento.petNome,
      colaborador: agendamento.colaboradorNome,
      data: agendamento.dataFormatada,
      horario: agendamento.horaInicio,
      duracao: agendamento.duracaoLabel,
      servicos: agendamento.servicos.map((s) => s.name).join(", "),
      observacao: agendamento.observacao || "Nenhuma observação informada",
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
}