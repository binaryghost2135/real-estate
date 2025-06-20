
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yourwebsite.com'; // Remember to set this in your environment variables or update directly

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Properties for Sale & Rent in Kandivali, Mumbai | HomeFind',
  description: 'Explore a wide range of apartments, flats, and houses for sale and rent in Kandivali East & West, Mumbai. Find your dream home with HomeFind Kandivali today!',
  keywords: ['properties kandivali', 'flats kandivali', 'apartments kandivali', 'buy home kandivali', 'rent home kandivali', 'real estate mumbai', 'kandivali east', 'kandivali west', 'property search'],
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
  openGraph: {
    title: 'Properties for Sale & Rent in Kandivali, Mumbai | HomeFind',
    description: 'Explore a wide range of apartments, flats, and houses for sale and rent in Kandivali East & West, Mumbai. Find your dream home with HomeFind Kandivali today!',
    url: siteUrl,
    siteName: 'HomeFind Kandivali',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8aG9tZXxlbnwwfHx8fDE3NTA0MTE5MTd8MA&ixlib=rb-4.1.0&q=80&w=1200&h=630', // Example OG image
        width: 1200,
        height: 630,
        alt: 'A beautiful modern home exterior.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Properties for Sale & Rent in Kandivali, Mumbai | HomeFind',
    description: 'Explore a wide range of apartments, flats, and houses for sale and rent in Kandivali East & West, Mumbai. Find your dream home with HomeFind Kandivali today!',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8aG9tZXxlbnwwfHx8fDE3NTA0MTE5MTd8MA&ixlib=rb-4.1.0&q=80&w=1200&h=600'], // Example Twitter image
    // site: '@yourtwitterhandle', // Optional: Add your Twitter handle
    // creator: '@creatorhandle', // Optional: Add content creator's Twitter handle
  },
  // verification: { // Optional: Add verification tokens for search consoles
  //   google: 'your-google-site-verification-token',
  //   yandex: 'your-yandex-verification-token',
  //   other: {
  //     me: ['my-email@example.com', 'my-link'],
  //   },
  // },
  // alternates: { // Optional: For multilingual sites or canonical URLs
  //   canonical: '/',
  //   languages: {
  //     'en-US': '/en-US',
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
