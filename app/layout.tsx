import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'QRPrint — Print, without the wait', description: 'Send documents to your local print shop.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
