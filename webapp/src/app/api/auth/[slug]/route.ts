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
        { 
          error: "Missing Cognito configuration",
          hasUserPoolId: !!userPoolId,
          hasClientId: !!clientId,
          hasCognitoDomain: !!cognitoDomain
        },
        { status: 500 }
      );
    }

    // Use NEXTAUTH_URL or fallback to request origin
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://main.d2yytqurf9gb03.amplifyapp.com";
    const redirectUri = `${baseUrl}/api/auth/callback`;
    
    const authUrl = `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;

    console.log("Redirecting to Cognito:", authUrl);
    return NextResponse.redirect(authUrl);
  }

  if (slug === "callback") {
    const code = request.nextUrl.searchParams.get("code");
    
    if (code) {
      console.log("Auth callback successful, code received");
      return NextResponse.redirect(new URL("/", request.url));
    }

    const error = request.nextUrl.searchParams.get("error");
    console.log("Auth callback error:", error);
    return NextResponse.redirect(new URL("/sign-in?error=" + error, request.url));
  }

  if (slug === "sign-out") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.json({ ok: true, message: "Auth API" });
}

export async function POST() {
  return NextResponse.json({ ok: true, message: "Use GET" });
}