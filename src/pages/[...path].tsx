import { useEffect, useState } from "react";
import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import redirectsData from "../../public/redirects.json";
import { flattenPaths, resolveRedirect, isSafeUrl, isWebUrl, getDisplayUrl } from "@/lib/redirects";
import { pickRandom, REDIRECT_HEADLINES } from "@/lib/copy";
import type { RedirectMap, RedirectPageProps } from "@/types/redirects";
import s from "@/styles/shared.module.css";

const map = redirectsData as RedirectMap;

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = flattenPaths(map);
  const paths = entries.map((entry) => ({ params: { path: entry.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<RedirectPageProps> = async ({ params }) => {
  const segments = params?.path as string[] | undefined;

  if (!segments || segments.length === 0) {
    return { notFound: true };
  }

  const target = resolveRedirect(segments, map);

  if (!target || !isSafeUrl(target)) {
    return { notFound: true };
  }

  return { props: { target } };
};

export default function Redirect({ target }: RedirectPageProps) {
  const [headline, setHeadline] = useState<string>("");

  useEffect(() => {
    setHeadline(pickRandom(REDIRECT_HEADLINES));
    window.location.replace(target);
  }, [target]);

  const displayUrl = getDisplayUrl(target);

  return (
    <>
      <Head>
        <title>{`→ ${displayUrl}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex, nofollow" />
        {isWebUrl(target) && <meta httpEquiv="refresh" content={`0;url=${target}`} />}
      </Head>
      <div className={s.page}>
        <div className={s.card}>
          <p className={`${s.headline} ${s.fadeItem} ${s.delay0}`}>
            {headline || "Redirecting…"}
          </p>
          <hr className={`${s.rule} ${s.fadeItem} ${s.delay1}`} />
          <span
            className={`${s.destination} ${s.fadeItem} ${s.delay1}`}
            aria-label={`Redirecting to ${displayUrl}`}
          >
            {displayUrl}
          </span>
          <a
            href={target}
            rel="noopener noreferrer"
            className={`${s.button} ${s.fadeItem} ${s.delay2}`}
          >
            Open manually ↗
          </a>
        </div>
      </div>
    </>
  );
}
