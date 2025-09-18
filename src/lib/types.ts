export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  lead: string;
  content: Array<{ tag: string; content: string; classes?: string; language?: string }>;
  tags: string[];
}
