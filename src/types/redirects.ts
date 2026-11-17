export type RedirectValue = string | RedirectNode;

export interface RedirectNode {
  [key: string]: RedirectValue;
}

export type RedirectMap = RedirectNode & { index?: string };

export interface FlatRedirectEntry {
  slug: string[];
  target: string;
}

export interface PreviewMetadata {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  type: string | null;
}

export interface RedirectPageProps {
  target: string;
  preview?: PreviewMetadata | null;
}

export interface IndexPageProps {
  target: string | null;
  preview: PreviewMetadata | null;
}
