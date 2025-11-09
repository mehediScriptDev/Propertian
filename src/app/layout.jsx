import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata = {
  title: 'Quiah Group - Real Estate Montreal',
  description:
    'Leading real estate company in Montreal - Buy, Rent, Sell Properties',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
