export type AffiliateApplyFormState = {
  status: 'idle' | 'error';
  message?: string;
};

export const initialAffiliateApplyFormState: AffiliateApplyFormState = {
  status: 'idle',
};
