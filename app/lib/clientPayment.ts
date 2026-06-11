"use client";

type PaymentRedirectResponse = {
  redirectUrl?: string;
};

const defaultBePaidPaymentUrl = "https://api.bepaid.by/products/prd_5e2c12758bd61836/pay";

export const bePaidPaymentUrl =
  process.env.NEXT_PUBLIC_BEPAID_PAYMENT_URL?.trim() || defaultBePaidPaymentUrl;

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
