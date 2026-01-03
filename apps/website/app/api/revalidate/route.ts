export async function POST(_req: Request) {
	// TODO: Implement authentication to secure this endpoint
	// Until then, no-op implementation
	return new Response(null, { status: 204 });

	// try {
	// 	const _body = await req.json();
	// 	const tags: string[] = []; // get tags from body
	// 	for (const tag of tags) {
	// 		revalidateTag(tag, "default");
	// 	}
	// 	return new Response(null, { status: 204 });
	// } catch (error) {
	// 	console.error("Failed to parse JSON body in /api/revalidate:", error);
	// 	return new Response("Invalid JSON body", { status: 400 });
	// }
}
