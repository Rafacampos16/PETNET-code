const STORAGE_KEY = "petnet_notificacoes";

export function listarNotificacoes() {
  const notificacoes = localStorage.getItem(STORAGE_KEY);
  return notificacoes ? JSON.parse(notificacoes) : [];
}

export function salvarNotificacao(notificacao) {
  const notificacoesAtuais = listarNotificacoes();

  const novaNotificacao = {
    id: Date.now(),
    lida: false,
    criadaEm: new Date().toISOString(),
    ...notificacao,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([novaNotificacao, ...notificacoesAtuais])
  );

  return novaNotificacao;
}

export function marcarNotificacaoComoLida(id) {
  const notificacoes = listarNotificacoes();

  const atualizadas = notificacoes.map((notificacao) =>
    notificacao.id === id ? { ...notificacao, lida: true } : notificacao
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizadas));
}

export function criarNotificacaoConfirmacaoAgendamento(agendamento) {
  return salvarNotificacao({
    tipo: "CONFIRMACAO_AGENDAMENTO",
    titulo: "Agendamento confirmado",
    descricao: `O atendimento do pet ${agendamento.petNome} foi agendado para ${agendamento.dataFormatada} às ${agendamento.horaInicio}.`,
  });
}