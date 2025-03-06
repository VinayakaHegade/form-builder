import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Form Builder',
  description: 'Easily create your job form with our intuitive form builder',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} text-gray-1k mx-auto min-h-dvh max-w-[90rem] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
