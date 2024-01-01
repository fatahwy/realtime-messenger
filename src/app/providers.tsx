'use client'

import { NextUIProvider } from '@nextui-org/react'
import { AppProgressBar } from 'next-nprogress-bar';
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <AppProgressBar
        height="10px"
        color="#fffd00"
      />
      <NextThemesProvider attribute="class" defaultTheme="light">

        {children}
      </NextThemesProvider>
    </NextUIProvider>
  )
}