import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '@/lib/amplify-config';
import './globals.css';

Amplify.configure(amplifyConfig, { ssr: true });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}