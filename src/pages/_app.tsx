import type { AppProps } from "next/app";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/style.css";

const geist = Geist({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={geist.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
