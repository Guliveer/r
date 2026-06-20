import Head from "next/head";
import { useEffect } from "react";
import redirectsData from "../../public/redirects.json";
import { getDefaultRedirect } from "@/lib/redirects";
import type { RedirectMap } from "@/types/redirects";

function isWebUrl(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("https://");
}

export default function Home() {
  const target = getDefaultRedirect(redirectsData as RedirectMap);

  useEffect(() => {
    if (target) {
      window.location.replace(target);
    }
  }, [target]);

  return (
    <>
      <Head>
        <title>Redirecting...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {target && isWebUrl(target) && <meta httpEquiv="refresh" content={`0;url=${target}`} />}
      </Head>
      <div />
    </>
  );
}
