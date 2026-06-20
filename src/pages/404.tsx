import { useEffect, useState } from "react";
import Head from "next/head";
import { pickRandom, NOT_FOUND_HEADLINES, NOT_FOUND_GITHUB_BUTTONS } from "@/lib/copy";
import s from "@/styles/shared.module.css";
import c from "@/styles/404.module.css";

export default function NotFound() {
  const [headline, setHeadline] = useState<string>("");
  const [githubButton, setGithubButton] = useState<string>("");

  useEffect(() => {
    setHeadline(pickRandom(NOT_FOUND_HEADLINES));
    setGithubButton(pickRandom(NOT_FOUND_GITHUB_BUTTONS));
  }, []);

  return (
    <>
      <Head>
        <title>404 — Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
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
          <div className={`${c.actions} ${s.fadeItem} ${s.delay3}`}>
            <a href="/" className={c.back}>← Go back</a>
            <a
              href="https://github.com/Guliveer"
              target="_blank"
              rel="noopener noreferrer"
              className={s.button}
            >
              {githubButton || "Take me somewhere real ↗"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
