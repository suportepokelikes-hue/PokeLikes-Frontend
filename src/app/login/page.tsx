import { redirectAuthenticatedUser } from '@/lib/auth/guards';
import { loginAction } from '@/modules/auth/actions';
import { AuthForm } from '@/modules/auth/auth-form';
import { initialAuthFormState } from '@/modules/auth/types';

export default async function LoginPage() {
  await redirectAuthenticatedUser();

  return (
    <AuthForm
      title="Entre para continuar no cliente ou no admin."
      eyebrow="Acesso"
      description="O frontend ja esta pronto para bootstrap de sessao. Este passo conecta o login real ao backend V1 e redireciona pelo papel retornado."
      fields={[
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'voce@likesuai.com',
          autoComplete: 'email',
        },
        {
          name: 'password',
          label: 'Senha',
          type: 'password',
          placeholder: 'Sua senha',
          autoComplete: 'current-password',
        },
      ]}
      submitLabel="Entrar"
      alternateHref="/register"
      alternateLabel="Criar conta"
      alternatePrompt="Ainda nao tem cadastro?"
      action={loginAction}
      initialState={initialAuthFormState}
    />
  );
}
