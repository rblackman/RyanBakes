import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const tags: string[] = Array.isArray((body as any)?.tags) ? (body as any).tags : [];
		for (const tag of tags) {
			revalidateTag(tag, { expire: 0 });
		}
		return new Response(null, { status: 204 });
	} catch (error) {
		console.error("Failed to parse JSON body in /api/revalidate:", error);
		return new Response("Invalid JSON body", { status: 400 });
	}
}
