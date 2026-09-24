import { marked } from 'marked';

export type PostMeta = { slug: string; title: string; date: string; tags: string[]; description: string; draft: boolean };
export type Post = PostMeta & { body: string; html: string };

export function parseFrontmatter(raw: string) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	const data: Record<string, string> = {};
	if (!m) return { data, body: raw };
	for (const line of m[1].split(/\r?\n/)) {
		const i = line.indexOf(':');
		if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1');
	}
	return { data, body: m[2] };
}

export function toPost(slug: string, raw: string): Post {
	const { data, body } = parseFrontmatter(raw);
	return {
		slug,
		title: data.title || slug,
		date: data.date || '',
		description: data.description || '',
		tags: (data.tags || '').replace(/^\[|\]$/g, '').split(',').map((t) => t.trim()).filter(Boolean),
		draft: data.draft === 'true',
		body,
		html: marked.parse(body, { async: false }) as string
	};
}

const files = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function getPosts(includeDrafts = false): Post[] {
	return Object.entries(files)
		.map(([path, raw]) => toPost(path.split('/').pop()!.replace(/\.md$/, ''), raw))
		.filter((p) => includeDrafts || !p.draft)
		.sort((a, b) => b.date.localeCompare(a.date));
}

export function serialize(p: { title: string; date: string; tags: string[]; description: string; draft: boolean; body: string }) {
	const q = (s: string) => JSON.stringify(s);
	return `---\ntitle: ${q(p.title)}\ndate: ${p.date}\ntags: [${p.tags.join(', ')}]\ndescription: ${q(p.description)}\ndraft: ${p.draft}\n---\n\n${p.body.trim()}\n`;
}
