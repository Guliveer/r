import Head from "next/head";
import { useEffect, useState } from "react";
import redirectsData from "../../public/redirects.json";
import { getDefaultRedirect, isWebUrl } from "@/lib/redirects";
import { pickRandom, REDIRECT_HEADLINES } from "@/lib/copy";
import type { RedirectMap } from "@/types/redirects";
import s from "@/styles/shared.module.css";

export default function Home() {
  const target = getDefaultRedirect(redirectsData as RedirectMap);
  const [headline, setHeadline] = useState<string>("");

  useEffect(() => {
    setHeadline(pickRandom(REDIRECT_HEADLINES));
    if (target) {
      window.location.replace(target);
    }
  }, [target]);

  return (
    <>
      <Head>
        <title>Redirecting…</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex, nofollow" />
        {target && isWebUrl(target) && <meta httpEquiv="refresh" content={`0;url=${target}`} />}
      </Head>
      <div className={s.page}>
        <div className={s.card}>
          <p className={`${s.headline} ${s.fadeItem} ${s.delay0}`}>
            {headline || "Redirecting…"}
          </p>
        </div>
      </div>
    </>
  );
}
