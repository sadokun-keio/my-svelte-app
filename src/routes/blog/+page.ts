import { getPosts } from '$lib/posts';
export const prerender = true;
export const load = () => ({ posts: getPosts().map(({ html, body, ...m }) => m) });
