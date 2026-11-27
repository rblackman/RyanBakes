/**
 * Turns a number of minutes into an ISO 8601 duration ("PT1H30M"), the format schema.org and Google
 * expect for prepTime, cookTime and totalTime. Returns undefined for missing, zero, negative or
 * non-finite values so the caller can leave the property out instead of emitting a bad value.
 */
export default function minutesToIsoDuration(minutes: number | undefined | null): string | undefined {
	if (typeof minutes !== "number" || !Number.isFinite(minutes)) {
		return undefined;
	}

	const rounded = Math.round(minutes);
	if (rounded <= 0) {
		return undefined;
	}

	const hours = Math.floor(rounded / 60);
	const rest = rounded % 60;

	if (hours === 0) {
		return `PT${rest}M`;
	}

	return rest === 0 ? `PT${hours}H` : `PT${hours}H${rest}M`;
}
