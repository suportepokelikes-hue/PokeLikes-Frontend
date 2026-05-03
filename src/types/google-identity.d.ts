declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(options: GoogleIdentityInitializeOptions): void;
          renderButton(
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin' | 'signup';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            },
          ): void;
          cancel(): void;
        };
      };
    };
  }
}

type GoogleCredentialResponse = {
  credential?: string;
  select_by?: string;
};

type GoogleIdentityInitializeOptions = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  ux_mode?: 'popup' | 'redirect';
  context?: 'signin' | 'signup' | 'use';
};

export {};
