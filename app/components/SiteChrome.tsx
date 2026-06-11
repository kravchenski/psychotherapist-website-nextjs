"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import type { ReactNode } from "react";
import type { HomeContent } from "../types/content";

type SiteChromeProps = {
  children: ReactNode;
  footerContent: HomeContent["footer"];
};

export default function SiteChrome({ children, footerContent }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer content={footerContent} />
      <ScrollToTop />
    </>
  );
}
