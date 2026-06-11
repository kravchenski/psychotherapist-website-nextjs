"use client";

type PaymentRedirectResponse = {
  redirectUrl?: string;
};

export async function redirectToBePaid() {
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
