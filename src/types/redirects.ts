export type RedirectValue = string | RedirectNode;

export interface RedirectNode {
  [key: string]: RedirectValue;
}

export type RedirectMap = RedirectNode & { index?: string };

export interface FlatRedirectEntry {
  slug: string[];
  target: string;
}

export interface RedirectPageProps {
  target: string;
}
