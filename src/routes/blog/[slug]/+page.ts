import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/posts';
// 公開済みの記事は静的生成。予約待ちの記事だけはアクセス時に描画（時刻前は404）
export const prerender = 'auto';
export const entries = () => getPosts().map((p) => ({ slug: p.slug }));
export const load = ({ params }) => {
	const post = getPosts().find((p) => p.slug === params.slug);
	if (!post) error(404, '記事が見つかりません');
	return { post };
};
