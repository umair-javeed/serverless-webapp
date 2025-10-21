import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (slug === "sign-in") {
    const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID || process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || process.env.COGNITO_USER_POOL_CLIENT_ID;
    const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || process.env.COGNITO_DOMAIN;

    if (!userPoolId || !clientId || !cognitoDomain) {
      return NextResponse.json(
        { error: "Missing Cognito configuration" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://serverless-webapp.vercel.app";
    const redirectUri = `${baseUrl}/api/auth/callback`;
    
    const authUrl = `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return NextResponse.redirect(authUrl);
  }

  if (slug === "callback") {
    const code = request.nextUrl.searchParams.get("code");
    const error = request.nextUrl.searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/sign-in?error=" + error, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/sign-in?error=no_code", request.url));
    }

    const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || process.env.COGNITO_USER_POOL_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || process.env.COGNITO_DOMAIN;
    const baseUrl = process.env.NEXTAUTH_URL || "https://serverless-webapp.vercel.app";
    const redirectUri = `${baseUrl}/api/auth/callback`;

    try {
      const tokenUrl = `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/token`;
      
      const headers: HeadersInit = {
        "Content-Type": "application/x-www-form-urlencoded",
      };

      if (clientSecret) {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        headers["Authorization"] = `Basic ${auth}`;
      }
      
      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers,
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId!,
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        return NextResponse.redirect(new URL("/sign-in?error=token_exchange_failed", request.url));
      }

      const tokens = await tokenResponse.json();
      const response = NextResponse.redirect(new URL("/auth-callback", request.url));
      
      response.cookies.set("idToken", tokens.id_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: tokens.expires_in || 3600,
      });
      
      response.cookies.set("accessToken", tokens.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: tokens.expires_in || 3600,
      });
      
      if (tokens.refresh_token) {
        response.cookies.set("refreshToken", tokens.refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60,
        });
      }

      return response;
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(new URL("/sign-in?error=callback_failed", request.url));
    }
  }

  if (slug === "sign-out") {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("idToken");
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  return NextResponse.json({ ok: true });
}

export async function POST() {
  return NextResponse.json({ ok: true });
}