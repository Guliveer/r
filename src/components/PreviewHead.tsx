import Head from "next/head";
import { getDisplayUrl, isWebUrl } from "@/lib/redirects";
import type { PreviewMetadata } from "@/types/redirects";

interface PreviewHeadProps {
  target: string;
  preview?: PreviewMetadata | null;
}

export default function PreviewHead({ target, preview }: PreviewHeadProps) {
  const displayUrl = getDisplayUrl(target);
  const title = preview?.title ?? displayUrl;
  const description = preview?.description ?? null;
  const image = preview?.image ?? null;
  const siteName = preview?.siteName ?? null;
  const type = preview?.type ?? "website";
  const isWeb = isWebUrl(target);

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0a0a0a" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="robots" content="noindex, nofollow" />
      {description && <meta name="description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {siteName && <meta property="og:site_name" content={siteName} />}
      {image && <meta property="og:image" content={image} />}
      {isWeb && <meta property="og:url" content={target} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
      {isWeb && <meta httpEquiv="refresh" content={`0;url=${target}`} />}
    </Head>
  );
}
