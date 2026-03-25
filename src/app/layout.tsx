import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

import './globals.css';

import { LanguageThemeProvider } from '@/contexts/LanguageThemeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Auto Pulse - Premium Otomotiv Analiz Platformu',
  description: 'Teknik araç verileri, canlı katalog, VIN çözümleme ve yapay zeka özetleri.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased selection:bg-primary-container selection:text-on-primary-container`}>
        <LanguageThemeProvider>{children}</LanguageThemeProvider>
      </body>
    </html>
  );
}
