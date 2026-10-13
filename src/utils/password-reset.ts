// Флаг, что пользователь запросил код восстановления на /forgot-password
const PASSWORD_RESET_REQUESTED_KEY = 'passwordResetRequested';

export function markPasswordResetRequested(): void {
  localStorage.setItem(PASSWORD_RESET_REQUESTED_KEY, 'true');
}

export function isPasswordResetRequested(): boolean {
  return localStorage.getItem(PASSWORD_RESET_REQUESTED_KEY) === 'true';
}

export function clearPasswordResetRequested(): void {
  localStorage.removeItem(PASSWORD_RESET_REQUESTED_KEY);
}
