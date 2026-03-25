import { getServerSession } from '@/lib/auth/cookies';
import { PublicHome } from '@/modules/app-shell/public-home';

export default async function HomePage() {
  const session = await getServerSession();

  return <PublicHome session={session} />;
}
