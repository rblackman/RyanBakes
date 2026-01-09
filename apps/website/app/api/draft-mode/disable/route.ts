import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export async function GET(req: Request) {
	const url = new URL(req.url);

	// Turn off draft mode
	const dm = await draftMode();
	dm.disable();

	// Optional redirect target (Sanity may include one)
	const redirectTo = url.searchParams.get("redirect") ?? "/";

	redirect(redirectTo);
}
