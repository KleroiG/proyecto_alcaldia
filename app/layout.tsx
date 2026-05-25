import type { Metadata, Viewport } from 'next'
import { DM_Sans, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
});
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sogamoso Tourism | Discover the City of the Sun',
  description: 'Explore the rich culture, heritage, and natural beauty of Sogamoso, Boyacá, Colombia. Discover archaeological sites, stunning landscapes, and authentic Muisca traditions.',
  keywords: ['Sogamoso', 'Colombia', 'tourism', 'Boyacá', 'Muisca', 'culture', 'travel'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0D6B4C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${dmSans.variable} font-sans antialiased`} suppressHydrationWarning>
        {children} 
        <Analytics />
      </body>
    </html>
  )
}
