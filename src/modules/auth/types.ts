export type AuthFormState =
  | {
      status: 'idle';
      message?: undefined;
      redirectPath?: undefined;
    }
  | {
      status: 'error';
      message?: string;
      redirectPath?: undefined;
    }
  | {
      status: 'success';
      message?: string;
      redirectPath: string;
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
