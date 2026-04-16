"use client";

import { useState } from "react";

export default function PhoneCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      aria-label="Скопировать номер телефона"
      title={copied ? "Скопировано" : "Скопировать"}
      onClick={handleCopyPhone}
      className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[rgba(108,123,107,0.25)] transition-colors hover:bg-[rgba(108,123,107,0.1)]"
    >
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${copied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 9.75A1.75 1.75 0 0 1 10.75 8h8.5A1.75 1.75 0 0 1 21 9.75v8.5A1.75 1.75 0 0 1 19.25 20h-8.5A1.75 1.75 0 0 1 9 18.25v-8.5Z" stroke="#4f5f4e" strokeWidth="1.8" />
          <path d="M5.75 16A1.75 1.75 0 0 1 4 14.25v-8.5A1.75 1.75 0 0 1 5.75 4h8.5A1.75 1.75 0 0 1 16 5.75" stroke="#4f5f4e" strokeWidth="1.8" />
        </svg>
      </span>
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${copied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12.5L9.2 16.5L19 7.5" stroke="#4f5f4e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
