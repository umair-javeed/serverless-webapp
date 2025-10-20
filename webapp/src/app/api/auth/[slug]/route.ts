import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (slug === "sign-in") {
    const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID || process.env.USER_POOL_ID;
    const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || process.env.COGNITO_CLIENT_ID;
    const region = process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";
    const cognitoDomain = process.env.COGNITO_DOMAIN || process.env.NEXT_PUBLIC_COGNITO_DOMAIN;

    const origin = request.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/callback`;
    
    // TEMPORARY DEBUG: Show configuration instead of redirecting
    return NextResponse.json({
      debug: "Auth Configuration Check",
      origin: origin,
      redirectUri: redirectUri,
      cognitoDomain: cognitoDomain,
      region: region,
      clientId: clientId?.substring(0, 15) + "...",
      userPoolId: userPoolId?.substring(0, 15) + "...",
      hasUserPoolId: !!userPoolId,
      hasClientId: !!clientId,
      hasCognitoDomain: !!cognitoDomain,
      envVarsChecked: {
        NEXT_PUBLIC_USER_POOL_ID: !!process.env.NEXT_PUBLIC_USER_POOL_ID,
        USER_POOL_ID: !!process.env.USER_POOL_ID,
        NEXT_PUBLIC_USER_POOL_CLIENT_ID: !!process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
        COGNITO_CLIENT_ID: !!process.env.COGNITO_CLIENT_ID,
        NEXT_PUBLIC_AWS_REGION: !!process.env.NEXT_PUBLIC_AWS_REGION,
        AWS_REGION: !!process.env.AWS_REGION,
        NEXT_PUBLIC_COGNITO_DOMAIN: !!process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
        COGNITO_DOMAIN: !!process.env.COGNITO_DOMAIN
      },
      fullAuthUrl: cognitoDomain && clientId 
        ? `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`
        : "MISSING_REQUIRED_VALUES"
    });
  }

  if (slug === "callback") {
    const code = request.nextUrl.searchParams.get("code");
    
    if (code) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.redirect(new URL("/sign-in?error=auth_failed", request.url));
  }

  if (slug === "sign-out") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.json(
    { ok: true, message: "Use GET /api/auth/sign-in to initiate OAuth flow." },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    { ok: true, message: "Use GET /api/auth/sign-in to initiate OAuth flow." },
    { status: 200 }
  );
}