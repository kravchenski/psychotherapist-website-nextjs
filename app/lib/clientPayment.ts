"use client";

type PaymentRedirectResponse = {
  redirectUrl?: string;
};

export const bePaidPaymentUrl = process.env.NEXT_PUBLIC_BEPAID_PAYMENT_URL?.trim();

export async function redirectToBePaid() {
  if (bePaidPaymentUrl) {
    window.location.href = bePaidPaymentUrl;
    return;
  }

  const response = await fetch("/api/payment/bepaid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json().catch(() => null)) as
    | PaymentRedirectResponse
    | null;

  if (!response.ok || !data?.redirectUrl) {
    throw new Error("Payment redirect is unavailable");
  }

  window.location.href = data.redirectUrl;
}

export function redirectToPaymentFallback() {
  window.location.href = "/payment";
}
