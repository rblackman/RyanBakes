import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const body = await req.json().catch(() => ({}));
	const tags: string[] = Array.isArray(body?.tags) ? body.tags : [];
	for (const tag of tags) {
		revalidateTag(tag, { expire: 0 });
	}
	return new Response(null, { status: 204 });
}
