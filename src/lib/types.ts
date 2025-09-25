export type ContentBlock =
  | { tag: 'markdown'; content: string; classes?: string }
  | { tag: 'aside'; content: string; classes?: string }
  | { tag: 'code'; content: string; language: string; classes?: string };

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  lead: string;
  content: ContentBlock[];
  tags: string[];
}
