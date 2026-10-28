export const AMOUNT_RE = /^\d*[.,]?\d{0,9}$/;

export const formatDepositDraft = (value: number) =>
  value === 0 ? '' : value.toString().replace('.', ',');
