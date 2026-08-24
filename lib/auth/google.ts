import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { getGoogleClientId, getGoogleClientSecret } from "@/lib/auth/config";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

export type GoogleTokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

export function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function generateOAuthState(): string {
  return randomBytes(16).toString("hex");
}

export function generateCodeChallenge(verifier: string): string {
  const hash = createHash("sha256").update(verifier).digest();
  return Buffer.from(hash)
    .toString("base64url")
    .replace(/=+$/, "");
}

export function buildGoogleAuthUrl(input: {
  codeChallenge: string;
  state: string;
  redirectUri: string;
  scope?: string;
}): string {
  const url = new URL(GOOGLE_AUTH_ENDPOINT);
  url.searchParams.set("client_id", getGoogleClientId());
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", input.scope ?? "openid email profile");
  url.searchParams.set("state", input.state);
  url.searchParams.set("code_challenge", input.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export async function exchangeCodeForToken(input: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<GoogleTokenResponse> {
  const params = new URLSearchParams();
  params.set("code", input.code);
  params.set("client_id", getGoogleClientId());
  params.set("client_secret", getGoogleClientSecret());
  params.set("redirect_uri", input.redirectUri);
  params.set("grant_type", "authorization_code");
  params.set("code_verifier", input.codeVerifier);

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Google token exchange failed (${response.status}) ${body}`);
  }

  return (await response.json()) as GoogleTokenResponse;
}

export async function fetchGoogleUser(
  accessToken: string,
): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google user info (${response.status})`);
  }

  return (await response.json()) as GoogleUserInfo;
}
