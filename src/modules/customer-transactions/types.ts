export type TransactionFormState = {
  status: 'idle' | 'error' | 'blocked';
  message?: string;
  actionHref?: string;
  actionLabel?: string;
};

export const initialTransactionFormState: TransactionFormState = {
  status: 'idle',
};
