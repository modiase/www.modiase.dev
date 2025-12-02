export type ContentBlock =
  | { id: string; tag: 'markdown'; content: string; classes?: string }
  | { id: string; tag: 'aside'; content: string; classes?: string }
  | { id: string; tag: 'code'; content: string; language: string; classes?: string };

export type ContentBlockType = 'markdown' | 'aside' | 'code';

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  lead: string;
  content: ContentBlock[];
  tags: string[];
  hidden: boolean;
}
