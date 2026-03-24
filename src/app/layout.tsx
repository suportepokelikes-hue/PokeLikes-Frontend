import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Instabarato Frontend',
  description: 'Frontend web da plataforma Instabarato',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
