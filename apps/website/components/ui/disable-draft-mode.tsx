"use client";

import { disableDraftMode } from "@apps/actions";
import { useRouter } from "next/navigation";
import { useIsPresentationTool } from "next-sanity/hooks";
import { useTransition } from "react";

export default function DisableDraftMode() {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	// null while detecting, true inside the Presentation tool (which manages draft mode itself)
	const isPresentationTool = useIsPresentationTool();

	if (isPresentationTool !== false) {
		return null;
	}

	const disable = () =>
		startTransition(async () => {
			await disableDraftMode();
			router.refresh();
		});

	return (
		<div>
			{pending ? (
				"Disabling draft mode..."
			) : (
				<button type="button" onClick={disable}>
					Disable draft mode
				</button>
			)}
		</div>
	);
}
