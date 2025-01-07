"use client";

import { Inter } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/lib/theme'

const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'MediChat AI',
//   description: 'Your Intelligent Medical Assistant for Anatomy & Physiology',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
