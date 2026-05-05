import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Анна Почебыт | Психолог-психотерапевт в Гродно",
  description: "Помощь в преодолении стресса, тревоги и жизненных трудностей. Безопасное пространство для разговоров о чувствах и отношениях.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
