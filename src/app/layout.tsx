import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Likes Uai',
  description: 'Frontend web da plataforma Likes Uai com area publica, cliente e admin.',
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
