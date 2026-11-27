// Kitchen-friendly denominators, smallest first so the simplest match wins.
const denominators = [2, 3, 4, 8, 16] as const;

// How far a decimal may sit from a fraction and still be shown as it (covers 0.33 / 0.67 for thirds).
const tolerance = 0.01;

// A decimal number with digits after the point: "0.25", ".5", "1.75".
const decimalPattern = /\d*\.\d+/g;

function greatestCommonDivisor(a: number, b: number): number {
	let x = a;
	let y = b;
	while (y !== 0) {
		[x, y] = [y, x % y];
	}
	return x;
}

/**
 * Converts one decimal string to fraction text ("0.25" -> "1/4", "1.5" -> "1 1/2").
 * Returns the input unchanged when no common kitchen fraction is close enough (e.g. "0.3").
 */
export function decimalToFraction(decimal: string): string {
	const value = Number(decimal);
	if (!Number.isFinite(value) || value < 0) {
		return decimal;
	}

	const whole = Math.floor(value);
	const remainder = value - whole;

	if (remainder <= tolerance) {
		return String(whole);
	}

	if (1 - remainder <= tolerance) {
		return String(whole + 1);
	}

	for (const denominator of denominators) {
		const numerator = Math.round(remainder * denominator);
		if (numerator <= 0 || numerator >= denominator) {
			continue;
		}

		if (Math.abs(numerator / denominator - remainder) <= tolerance) {
			const divisor = greatestCommonDivisor(numerator, denominator);
			const fraction = `${numerator / divisor}/${denominator / divisor}`;
			return whole > 0 ? `${whole} ${fraction}` : fraction;
		}
	}

	return decimal;
}

/**
 * Rewrites every decimal number inside an amount string as a fraction, leaving the rest as-is.
 * "0.25" -> "1/4", "1.5" -> "1 1/2", "1/2" -> "1/2", "Pinch" -> "Pinch".
 */
export function normalizeAmountToFractions(amount: string): string {
	return amount.replace(decimalPattern, (match) => decimalToFraction(match));
}
