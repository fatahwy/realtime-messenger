import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';

import ToasterContext from '../context/ToasterContext'
import AuthContext from '../context/AuthContext'
import { Providers } from './providers'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Messenger',
  description: "Let's talk to everyone",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        <ToasterContext />
        <AuthContext>
          <Providers>
            {children}
          </Providers>
        </AuthContext>
      </body>
    </html>
  )
}
