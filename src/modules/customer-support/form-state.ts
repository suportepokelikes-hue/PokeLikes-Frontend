export type SupportFormState = {
  status: 'idle' | 'error';
  message?: string;
};

export const initialSupportFormState: SupportFormState = {
  status: 'idle',
};
