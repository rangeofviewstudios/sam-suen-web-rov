import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dream Asia Fest — Fan Access | Sam Suen",
  description: "Exclusive fan drop for Dream Asia Fest. Unlock an unreleased track and share your shots with Sam.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Dream Asia Fest — Fan Access",
    description: "Unlock an unreleased Sam Suen track and share your photos from the show.",
    images: ["/images/rapred.jpeg"],
  },
};

export default function WS2026Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
