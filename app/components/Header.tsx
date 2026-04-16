"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#about", label: "Обо мне" },
  { href: "#services", label: "Услуги" },
  { href: "#contact", label: "Контакты" },
];

const COLORS = {
  text: "#2c302e",
  textSecondary: "rgba(44, 48, 46, 0.8)",
  button: "#6c7b6b",
  buttonHover: "#5f6d5f",
  border: "#f0ede6",
  buttonBorder: "#e5e2dc",
  mobileMenuBg: "#fefdfb",
};

const NavLink = ({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) => {
  const [color, setColor] = useState(COLORS.textSecondary);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setColor(COLORS.text)}
      onMouseLeave={() => setColor(COLORS.textSecondary)}
      className="text-sm font-medium transition-colors whitespace-nowrap px-3 py-2 -mx-1 rounded-md"
      style={{ color, fontFamily: 'var(--font-montserrat), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) => {
  const [color, setColor] = useState(COLORS.text);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setColor(COLORS.button)}
      onMouseLeave={() => setColor(COLORS.text)}
      className="text-base font-medium transition-colors whitespace-nowrap block px-2 py-5 border-b border-[#f0ede6] first:pt-0 last:border-b-0 last:pb-4"
      style={{ color, fontFamily: 'var(--font-montserrat), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}
    >
      {label}
    </Link>
  );
};

const ActionButton = ({ onClick, children, className = "" }: { onClick?: () => void; children: React.ReactNode; className?: string }) => {
  const [bgColor, setBgColor] = useState(COLORS.button);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setBgColor(COLORS.buttonHover)}
      onMouseLeave={() => setBgColor(COLORS.button)}
      className={`cursor-pointer text-sm font-medium text-white rounded-full px-6 py-2 transition-colors border ${className}`}
      style={{
        backgroundColor: bgColor,
        borderColor: COLORS.buttonBorder,
        fontFamily: 'var(--font-montserrat), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      }}
    >
      {children}
    </button>
  );
};

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <span className="relative block h-6 w-6" aria-hidden="true">
    <span
      className={`absolute left-0 top-[5px] block h-[2px] w-6 rounded-full transition-all duration-100 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'translate-y-[7px] rotate-45' : 'translate-y-0 rotate-0'}`}
      style={{ backgroundColor: COLORS.text }}
    />
    <span
      className={`absolute left-0 top-[12px] block h-[2px] w-6 rounded-full transition-all duration-75 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}
      style={{ backgroundColor: COLORS.text }}
    />
    <span
      className={`absolute left-0 top-[19px] block h-[2px] w-6 rounded-full transition-all duration-100 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? '-translate-y-[7px] -rotate-45' : 'translate-y-0 rotate-0'}`}
      style={{ backgroundColor: COLORS.text }}
    />
  </span>
);

export default function Header() {
  const MENU_ANIMATION_MS = 240;
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  const closeMenu = useCallback(() => {
    if (!open || isClosing) return;
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsClosing(true);
    setIsMenuVisible(false);
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      setIsMenuVisible(false);
    }, MENU_ANIMATION_MS);
  }, [open, isClosing]);

  const openMenu = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setOpen(true);
    setIsClosing(false);
    setIsMenuVisible(false);
    rafRef.current = requestAnimationFrame(() => {
      setIsMenuVisible(true);
    });
  }, []);

  const toggleMenu = useCallback(() => {
    if (open && !isClosing) {
      closeMenu();
      return;
    }

    if (!open) {
      openMenu();
    }
  }, [open, isClosing, closeMenu, openMenu]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closeMenu();
    };

    if (open || isClosing) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, isClosing, closeMenu]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!open || isClosing) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    if (open && !isClosing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isClosing, closeMenu]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <header className="w-full bg-white border-b relative z-50" style={{ borderColor: COLORS.border, height: "66px", display: "flex", alignItems: "center" }}>
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center transition-all px-3">
          <Link href="/" className="flex-shrink-0">
            <span
              style={{
                color: COLORS.text,
                letterSpacing: "0.6px",
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: "30px",
                lineHeight: "1.1",
              }}
            >
              Анна Почебыт
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 md:gap-7 items-center">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            <ActionButton onClick={() => { window.location.hash = "contact"; }}>Записаться</ActionButton>
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={toggleMenu}
              className="p-2 cursor-pointer transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95"
            >
              <HamburgerIcon open={open || isClosing} />
            </button>
          </div>
        </div>

        {(open || isClosing) && (
          <div
            ref={menuRef}
            className={`absolute top-[66px] left-0 right-0 border-b flex flex-col gap-0 px-6 py-8 shadow-md max-h-[420px] overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            style={{
              backgroundColor: COLORS.mobileMenuBg,
              borderColor: COLORS.border,
            }}
          >
            <div className="flex flex-col gap-0">
              {NAV_LINKS.map((link) => (
                <MobileNavLink key={link.href} href={link.href} label={link.label} onClick={() => closeMenu()} />
              ))}
            </div>
            <button
              onClick={() => {
                closeMenu();
                window.location.hash = "contact";
              }}
              className="w-full text-base font-medium text-white rounded-full px-6 py-3 transition-colors border mt-6 cursor-pointer"
              style={{
                backgroundColor: COLORS.button,
                borderColor: COLORS.buttonBorder,
                fontFamily: 'var(--font-montserrat), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.buttonHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.button)}
            >
              Записаться
            </button>
          </div>
        )}
      </header>
    );
  }
