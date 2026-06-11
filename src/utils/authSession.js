const SESSION_LIMIT = 24 * 60 * 60 * 1000; // 24 horas

export function isSessionExpired() {
  const loginTime = localStorage.getItem("loginTime");

  if (!loginTime) {
    return true;
  }

  const loggedAt = Number(loginTime);

  if (Number.isNaN(loggedAt)) {
    return true;
  }

  return Date.now() - loggedAt > SESSION_LIMIT;
}

export function clearSession() {
  localStorage.removeItem("userCpf");
  localStorage.removeItem("userName");
  localStorage.removeItem("userType");
  localStorage.removeItem("loginTime");

  localStorage.removeItem("isAdmin");
  localStorage.removeItem("isColaborador");
  localStorage.removeItem("isUser");
}