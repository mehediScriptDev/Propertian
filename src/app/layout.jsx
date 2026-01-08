import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata = {
  title: "Quiah Group - Real Estate Montreal",
  description:
    'Leading real estate company in Montreal - Buy, Rent, Sell Properties',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${manrope.variable} notranslate`} translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      {/*
        Suppress hydration warnings on the body element to avoid console noise
        when browser extensions or client-only runtime code add attributes
        (e.g. `cz-shortcut-listen`) that won't be present on the server HTML.
        This does not change rendered output — it only silences React's
        hydration mismatch warnings for this subtree.
      */}
      <body suppressHydrationWarning className="bg-background-light text-charcoal dark:bg-background-dark dark:text-soft-grey">
        {children}
      </body>
    </html>
  );
}
