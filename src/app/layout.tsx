import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elan.crelivio.com"),
  title: "Elan Innovate | Building with Momentum",
  description:
    "A venture-building institution. We help entrepreneurs turn ideas into scalable ventures, and help existing businesses grow, through agency services, incubation, and acceleration.",
  openGraph: {
    title: "Elan Innovate | Building with Momentum",
    description:
      "We build businesses for scale, with momentum. Applications for our first incubation cohort are open now.",
    type: "website",
    siteName: "Elan Innovate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elan Innovate | Building with Momentum",
    description:
      "We build businesses for scale, with momentum. Applications open now.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={montserrat.variable}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}