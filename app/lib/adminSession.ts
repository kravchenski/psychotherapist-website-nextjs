export const ADMIN_SESSION_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 2;
const ADMIN_SESSION_MAX_AGE_CAP_SECONDS = 60 * 60 * 24 * 30;

export function getAdminSessionMaxAgeSeconds() {
  const raw = process.env.ADMIN_SESSION_MAX_AGE_SECONDS;

  if (!raw) {
    return ADMIN_SESSION_MAX_AGE_SECONDS;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return ADMIN_SESSION_MAX_AGE_SECONDS;
  }

  return Math.min(parsed, ADMIN_SESSION_MAX_AGE_CAP_SECONDS);
}

const encoder = new TextEncoder();

async function createHmacKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

function bytesToHex(input: ArrayBuffer) {
  return Array.from(new Uint8Array(input), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

async function signValue(secret: string, value: string) {
  const key = await createHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToHex(signature);
}

export async function createAdminSessionToken(
  secret: string,
  now = Date.now(),
  maxAgeSeconds = getAdminSessionMaxAgeSeconds(),
) {
  const expiresAt = Math.floor(now / 1000) + maxAgeSeconds;
  const expiresAtRaw = String(expiresAt);
  const signature = await signValue(secret, expiresAtRaw);

  return `${expiresAtRaw}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined, secret: string, now = Date.now()) {
  if (!token) {
    return false;
  }

  const [expiresAtRaw, signature, ...rest] = token.split(".");

  if (rest.length > 0 || !expiresAtRaw || !signature) {
    return false;
  }

  if (!/^\d+$/.test(expiresAtRaw) || !/^[a-f\d]+$/i.test(signature)) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(now / 1000)) {
    return false;
  }

  const expectedSignature = await signValue(secret, expiresAtRaw);
  return timingSafeEqual(signature, expectedSignature);
}