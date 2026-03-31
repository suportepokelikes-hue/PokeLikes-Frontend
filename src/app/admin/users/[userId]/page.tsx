import { redirect } from 'next/navigation';

type AdminUserDetailRouteProps = {
  params: Promise<{ userId: string }>;
};

export default async function AdminUserDetailRoute({ params }: AdminUserDetailRouteProps) {
  const { userId } = await params;
  redirect(`/admin/users?editUserId=${encodeURIComponent(userId)}`);
}
