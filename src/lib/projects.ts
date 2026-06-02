/**
 * Loads all markdown projects at build time via import.meta.glob.
 * Each .md file stores project metadata in frontmatter.
 */

interface MarkdownModule {
  default: import('vue').Component;
  frontmatter?: Record<string, any>;
  [key: string]: any;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  url?: string;
  github?: string;
  image?: string;
  tags: string[];
  date: string;
}

const modules = import.meta.glob<MarkdownModule>('/content/projects/**/*.md', { eager: true });

const projects: ProjectMeta[] = Object.entries(modules).map(([filepath, mod]) => {
  const fm = (mod.frontmatter as Record<string, any>) || (mod as Record<string, any>);
  const parts = filepath.replace(/\.md$/, '').split('/');
  const slug = parts[parts.length - 1];

  let date = '';
  const rawDate = fm.date;
  if (rawDate instanceof Date) {
    date = rawDate.toISOString().slice(0, 10);
  } else if (typeof rawDate === 'string') {
    date = rawDate.slice(0, 10);
  }

  return {
    slug,
    title: fm.title || slug,
    description: fm.description || '',
    url: fm.url,
    github: fm.github,
    image: fm.image,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    date,
  };
});

projects.sort((a, b) => {
  if (a.date !== b.date) return b.date.localeCompare(a.date);
  return b.slug.localeCompare(a.slug);
});

export function getAllProjects(): ProjectMeta[] {
  return projects;
}

export function getProjectsByTag(tag: string): ProjectMeta[] {
  return projects.filter((p) => p.tags.includes(tag));
}

export function getAllProjectTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    for (const t of p.tags) {
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
