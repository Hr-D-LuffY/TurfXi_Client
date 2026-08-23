import type { Metadata } from 'next';
import { AppProviders } from '@/providers/AppProviders';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'TurfXI',
  description: 'Book turfs, split the bill, find players.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
