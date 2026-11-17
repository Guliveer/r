import { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import redirectsData from "../../public/redirects.json";
import { getDefaultRedirect, isSafeUrl } from "@/lib/redirects";
import { fetchPreviewMetadata } from "@/lib/preview";
import { pickRandom, REDIRECT_HEADLINES } from "@/lib/copy";
import PreviewHead from "@/components/PreviewHead";
import type { IndexPageProps, RedirectMap } from "@/types/redirects";
import s from "@/styles/shared.module.css";

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const target = getDefaultRedirect(redirectsData as RedirectMap);

  if (!target || !isSafeUrl(target)) {
    return { props: { target: null, preview: null } };
  }

  const preview = await fetchPreviewMetadata(target);

  return { props: { target, preview } };
};

export default function Home({ target, preview }: IndexPageProps) {
  const [headline, setHeadline] = useState<string>("");

  useEffect(() => {
    setHeadline(pickRandom(REDIRECT_HEADLINES));
    if (target) {
      window.location.replace(target);
    }
  }, [target]);

  return (
    <>
      {target ? <PreviewHead target={target} preview={preview} /> : null}
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
