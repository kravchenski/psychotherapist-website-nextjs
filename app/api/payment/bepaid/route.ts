import { NextRequest, NextResponse } from "next/server";
import { getBePaidEnv } from "../../../lib/env";

export const runtime = "nodejs";

const PAYMENT_AMOUNT_BYN_MINOR_UNITS = 10000;
const PAYMENT_DESCRIPTION = "Оплата услуг согласно Публичного договора";

type BePaidCheckoutResponse = {
  checkout?: {
    token?: string;
    redirect_url?: string;
  };
  message?: string;
  errors?: unknown;
};

export async function POST(request: NextRequest) {
  const bePaidEnv = getBePaidEnv();

  if (!bePaidEnv.isConfigured || !bePaidEnv.shopId || !bePaidEnv.secretKey) {
    return NextResponse.json(
      { error: "BePaid payment is not configured" },
      { status: 503 },
    );
  }

  const origin = new URL(request.url).origin;
  const trackingId = `consultation-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

  const checkoutPayload = {
    checkout: {
      test: bePaidEnv.isTest,
      transaction_type: "payment",
      attempts: 3,
      settings: {
        return_url: `${origin}/payment?status=return`,
        success_url: `${origin}/payment?status=success`,
        decline_url: `${origin}/payment?status=decline`,
        fail_url: `${origin}/payment?status=fail`,
        cancel_url: `${origin}/payment?status=cancel`,
        language: "ru",
        auto_return: 3,
        button_next_text: "Вернуться на сайт",
      },
      order: {
        amount: PAYMENT_AMOUNT_BYN_MINOR_UNITS,
        currency: "BYN",
        description: PAYMENT_DESCRIPTION,
        tracking_id: trackingId,
        additional_data: {
          receipt_text: [PAYMENT_DESCRIPTION],
        },
      },
      payment_method: {
        types: ["credit_card"],
      },
    },
  };

  const authHeader = Buffer.from(
    `${bePaidEnv.shopId}:${bePaidEnv.secretKey}`,
    "utf8",
  ).toString("base64");

  try {
    const response = await fetch(bePaidEnv.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Version": "2",
      },
      body: JSON.stringify(checkoutPayload),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as
      | BePaidCheckoutResponse
      | null;
    const redirectUrl = data?.checkout?.redirect_url;

    if (!response.ok || !redirectUrl) {
      return NextResponse.json(
        {
          error: "BePaid did not create a payment page",
          details: data?.message || data?.errors || null,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("BePaid checkout creation failed", error);

    return NextResponse.json(
      { error: "BePaid payment request failed" },
      { status: 502 },
    );
  }
}
