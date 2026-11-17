import { useEffect, useState } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import redirectsData from "../../public/redirects.json";
import { flattenPaths, resolveRedirect, isSafeUrl, getDisplayUrl } from "@/lib/redirects";
import { fetchPreviewMetadata } from "@/lib/preview";
import { pickRandom, REDIRECT_HEADLINES } from "@/lib/copy";
import PreviewHead from "@/components/PreviewHead";
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

  const preview = await fetchPreviewMetadata(target);

  return { props: { target, preview } };
};

export default function Redirect({ target, preview }: RedirectPageProps) {
  const [headline, setHeadline] = useState<string>("");

  useEffect(() => {
    setHeadline(pickRandom(REDIRECT_HEADLINES));
    window.location.replace(target);
  }, [target]);

  const displayUrl = preview?.title ?? getDisplayUrl(target);

  return (
    <>
      <PreviewHead target={target} preview={preview} />
      <div className={s.page}>
        <div className={s.card}>
          <p className={`${s.headline} ${s.fadeItem} ${s.delay0}`}>
            {headline || "Redirecting…"}
          </p>
          <hr className={`${s.rule} ${s.fadeItem} ${s.delay1}`} />
          <span
            className={`${s.destination} ${s.fadeItem} ${s.delay1}`}
            aria-label={`Redirecting to ${getDisplayUrl(target)}`}
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
