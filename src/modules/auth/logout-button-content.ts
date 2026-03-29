export function getLogoutButtonView(label = 'Sair', pending = false) {
  return {
    label,
    disabled: pending,
    visibleLabel: pending ? 'Saindo...' : label,
  };
}
