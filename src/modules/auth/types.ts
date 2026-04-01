export type AuthFormState = {
  status: 'idle' | 'error';
  message?: string;
};

export const initialAuthFormState: AuthFormState = {
  status: 'idle',
};

export type EmailVerificationRequestState =
  | {
      status: 'idle';
      message?: undefined;
      previewToken?: undefined;
      previewHref?: undefined;
      delivery?: undefined;
      expiresAt?: undefined;
    }
  | {
      status: 'success' | 'error';
      message: string;
      previewToken?: string;
      previewHref?: string;
      delivery?: 'email' | 'preview';
      expiresAt?: string | null;
    };

export const initialEmailVerificationRequestState: EmailVerificationRequestState = {
  status: 'idle',
};
