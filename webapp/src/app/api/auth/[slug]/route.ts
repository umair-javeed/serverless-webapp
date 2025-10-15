import { NextResponse } from "next/server";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Use POST to initiate Cognito sign-in.",
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientId: process.env.COGNITO_CLIENT_ID!,
    });

    const response = await client.send(command);
    return NextResponse.json({ ok: true, tokens: response.AuthenticationResult });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
