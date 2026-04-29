import { getServerSession } from '@/lib/auth/cookies';
import { redirectAuthenticatedUser } from '@/lib/auth/guards';
import { PublicHome } from '@/modules/app-shell/public-home';

export default async function HomePage() {
  await redirectAuthenticatedUser();
  const session = await getServerSession();

  return <PublicHome session={session} />;
}
