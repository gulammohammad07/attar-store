import { NextRequest, NextResponse } from "next/server";
import {
  GOOGLE_OAUTH_COOKIE_NAME,
  getGoogleRedirectUri,
  isGoogleOAuthConfigured,
} from "@/lib/auth/config";
import {
  buildGoogleAuthUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  generateOAuthState,
} from "@/lib/auth/google";
import { getSafeRedirectPath } from "@/lib/auth/url";

export const dynamic = "force-dynamic";

const OAUTH_STATE_TTL_SECONDS = 600;

export async function GET(request: NextRequest) {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/sign-in?error=google-not-configured", request.nextUrl),
    );
  }

  const next = getSafeRedirectPath(
    request.nextUrl.searchParams.get("next"),
    "/account",
  );

  const state = generateOAuthState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const redirectUri = getGoogleRedirectUri();

  const response = NextResponse.redirect(
    buildGoogleAuthUrl({ codeChallenge, state, redirectUri }),
  );

  response.cookies.set(
    GOOGLE_OAUTH_COOKIE_NAME,
    JSON.stringify({ state, codeVerifier, next }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: OAUTH_STATE_TTL_SECONDS,
    },
  );

  return response;
}
