import { redirectAuthenticatedUser } from '@/lib/auth/guards';
import { registerAction } from '@/modules/auth/actions';
import { AuthForm } from '@/modules/auth/auth-form';
import { initialAuthFormState } from '@/modules/auth/types';

export default async function RegisterPage() {
  await redirectAuthenticatedUser();

  return (
    <AuthForm
      title="Crie sua conta para iniciar wallet, pagamentos e pedidos."
      eyebrow="Cadastro"
      description="O cadastro segue o contrato atual do backend: nome, email, telefone e senha. A sessao ja nasce bootstrapada quando o backend responder com sucesso."
      fields={[
        {
          name: 'name',
          label: 'Nome',
          type: 'text',
          placeholder: 'Seu nome completo',
          autoComplete: 'name',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'voce@exemplo.com',
          autoComplete: 'email',
        },
        {
          name: 'phone',
          label: 'Telefone',
          type: 'tel',
          placeholder: '(11) 99999-9999',
          autoComplete: 'tel',
        },
        {
          name: 'password',
          label: 'Senha',
          type: 'password',
          placeholder: 'Crie uma senha',
          autoComplete: 'new-password',
        },
      ]}
      submitLabel="Criar conta"
      alternateHref="/login"
      alternateLabel="Entrar"
      alternatePrompt="Ja possui acesso?"
      action={registerAction}
      initialState={initialAuthFormState}
    />
  );
}
