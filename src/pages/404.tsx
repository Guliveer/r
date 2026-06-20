import { useEffect, useState } from "react";
import Head from "next/head";
import { pickRandom, NOT_FOUND_HEADLINES } from "@/lib/copy";
import s from "@/styles/shared.module.css";
import c from "@/styles/404.module.css";

export default function NotFound() {
  const [headline, setHeadline] = useState<string>("");

  useEffect(() => {
    setHeadline(pickRandom(NOT_FOUND_HEADLINES));
  }, []);

  return (
    <>
      <Head>
        <title>404 — Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={s.page}>
        <div className={s.card}>
          <p className={`${c.code} ${s.fadeItem} ${s.delay0}`}>404</p>
          <p className={`${s.headline} ${s.fadeItem} ${s.delay1}`}>
            {headline || "Lost in redirect."}
          </p>
          <hr className={`${s.rule} ${s.fadeItem} ${s.delay2}`} />
          <p className={`${c.sub} ${s.fadeItem} ${s.delay2}`}>
            This path leads nowhere.
          </p>
          <p className={`${c.subItalic} ${s.fadeItem} ${s.delay2}`}>
            (Or maybe everywhere.)
          </p>
          <a href="/" className={`${c.back} ${s.fadeItem} ${s.delay3}`}>
            ← Go back
          </a>
        </div>
      </div>
    </>
  );
}
