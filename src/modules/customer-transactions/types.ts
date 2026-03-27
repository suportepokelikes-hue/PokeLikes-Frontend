export type TransactionFormState = {
  status: 'idle' | 'error';
  message?: string;
};

export const initialTransactionFormState: TransactionFormState = {
  status: 'idle',
};
