import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pokelike',
  description: 'Frontend web da plataforma Pokelike com area publica, cliente e admin.',
  icons: {
    icon: '/brand/logo.jpeg',
    shortcut: '/brand/logo.jpeg',
    apple: '/brand/logo.jpeg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="app-body">
        <div className="site-frame">
          <div className="site-backdrop" />
          {children}
        </div>
      </body>
    </html>
  );
}
