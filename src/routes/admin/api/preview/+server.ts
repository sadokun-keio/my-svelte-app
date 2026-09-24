import { json } from '@sveltejs/kit';
import { marked } from 'marked';
import { guard } from '$lib/server/admin';
export const prerender = false;
export async function POST({ request }) {
	guard();
	const { body } = await request.json();
	return json({ html: marked.parse(body || '', { async: false }) });
}
