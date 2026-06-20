import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";
import "@/style.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
