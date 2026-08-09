import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans, Roboto } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

// Norwige — an all-italic display serif (ROV house face). Four weights
// for typographic hierarchy on the login + studio screens.
const norwige = localFont({
  src: [
    {
      path: "../public/norwige-font-family-1750004186-0/Norwige-LightItalic-BF68175f322ddb6.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/norwige-font-family-1750004186-0/Norwige-MediumItalic-BF68175f325d0c2.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/norwige-font-family-1750004186-0/Norwige-SemiBoldItalic-BF68175f326e730.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/norwige-font-family-1750004186-0/Norwige-ExtraBoldItalicItalic-BF68175f3224386.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-norwige",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "SAM SUEN — Artist",
  description:
    "SAM SUEN — Atlanta-based Korean Chinese hip-hop artist. Emotional storytelling meets confident rap delivery.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html>, not <body>: globals.css defines
    // --font-display / --font-body on :root in terms of them, and a :root
    // token can't reference a variable that only exists further down the
    // tree — it resolves to nothing and silently falls back to Tailwind's
    // default sans.
    <html
      lang="en"
      className={`${bebas.variable} ${dmSans.variable} ${norwige.variable} ${roboto.variable}`}
    >
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
