import { useEffect } from "react";
import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import redirectsData from "../../public/redirects.json";
import { flattenPaths, resolveRedirect } from "@/lib/redirects";
import type { RedirectMap, RedirectPageProps } from "@/types/redirects";

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

  if (!target) {
    return { notFound: true };
  }

  return { props: { target, slug: segments } };
};

function isWebUrl(uri: string): boolean {
  return uri.startsWith("http://") || uri.startsWith("https://");
}

export default function Redirect({ target }: RedirectPageProps) {
  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <>
      <Head>
        <title>Redirecting...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {isWebUrl(target) && <meta httpEquiv="refresh" content={`0;url=${target}`} />}
      </Head>
      <div>
        Redirecting to:
        <br />
        {target}
        <br />
        <br />
        Click <a href={target}>here</a> if you are not redirected automatically.
      </div>
    </>
  );
}
