import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import { ToastContainer } from 'react-hot-toast';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: 'Rubica - Your Premier Classified Ads Platform',
  description: 'Discover and post classified ads on Rubica. Find services, connect with people, and explore opportunities in your area.',
  keywords: 'classified ads, services, marketplace, directory, local business',
  authors: [{ name: 'Rubica Team' }],
  creator: 'Rubica',
  publisher: 'Rubica',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Rubica - Your Premier Classified Ads Platform',
    description: 'Discover and post classified ads on Rubica. Find services, connect with people, and explore opportunities in your area.',
    url: process.env.SITE_URL || 'http://localhost:3000',
    siteName: 'Rubica',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rubica - Classified Ads Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rubica - Your Premier Classified Ads Platform',
    description: 'Discover and post classified ads on Rubica. Find services, connect with people, and explore opportunities in your area.',
    images: ['/images/og-image.jpg'],
    creator: '@rubica',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`${montserrat.className} antialiased`}>
        <AuthProvider>
          {children}
          <ToastContainer
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}