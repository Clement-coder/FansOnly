import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Providers } from "./providers/provider"



export const metadata: Metadata = {
  title: "FansOnly - Decentralized Loyalty Platform",
  description: "Connect with your fans and build lasting loyalty through decentralized rewards",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.className}`}>
        <Providers>
  <Navbar />
        {children}
        <Footer />
        <Analytics />
                <SpeedInsights />
        </Providers>
      

      </body>
    </html>
  )
}
