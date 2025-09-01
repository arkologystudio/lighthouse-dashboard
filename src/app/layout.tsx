import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/contexts/AuthContext';
import { ToasterWrapper } from '../components/ToasterWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lighthousestudios.xyz'),
  title: {
    default:
      'Lighthouse Dashboard | AI Website Plugins & Web 4.0 Agent Discoverability',
    template: '%s | Lighthouse Dashboard',
  },
  description:
    'Discover Lighthouse Dashboard—your all-in-one AI-powered portal for managing websites, installing AI website plugins, billing, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
  keywords: [
    'AI website plugins',
    'AI website builder',
    'Agent discoverability',
    'Web 4.0 dashboard',
    'Neural search integration',
    'Semantic search tools',
    'AI site management',
    'AI Plugin marketplace',
    'AI website plugins',
    'Website AI optimization',
    'Lighthouse Studios',
  ],
  authors: [{ name: 'Lighthouse Studios' }],
  creator: 'Lighthouse Studios',
  publisher: 'Lighthouse Studios',
  category: 'Technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lighthousestudios.xyz',
    title:
      'Lighthouse Dashboard | AI Website Plugins & Web 4.0 Agent Discoverability',
    description:
      'Discover Lighthouse Dashboard—your all-in-one AI-powered portal for managing websites, installing AI website plugins, billing, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
    siteName: 'Lighthouse Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lighthouse Dashboard - AI Website Plugins & Web 4.0 Agent Discoverability',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Lighthouse Dashboard | AI Website Plugins & Web 4.0 Agent Discoverability',
    description:
      'Discover Lighthouse Dashboard—your all-in-one AI-powered portal for managing websites, installing AI website plugins, billing, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
    images: ['/og-image.png'],
    creator: '@lighthousestudios',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      <AuthProvider>
        {children}
        <ToasterWrapper />
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
