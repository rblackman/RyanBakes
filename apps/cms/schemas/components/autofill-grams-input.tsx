import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { type NumberInputProps, set, unset, useFormValue } from "sanity";

function parseAmountToNumber(amount: unknown): number | null {
	if (typeof amount !== "string") {
		return null;
	}

	// Simple: grab the first numeric token (supports "350", "350.5", "350 g")
	const match = amount.trim().match(/-?\d+(\.\d+)?/);
	if (!match) {
		return null;
	}

	const value = Number(match[0]);
	if (Number.isNaN(value)) {
		return null;
	}

	return value;
}

export default function AutofillGramsInput(props: NumberInputProps) {
	const { value, onChange, elementProps } = props;

	// This reads the sibling field "amount" from the current ingredient object.
	// Path [] means "current object". Since grams lives at ingredient.bakers.grams,
	// the current object is the ingredient object, so ["amount"] is correct.
	const amount = useFormValue(["amount"]) as unknown;

	// Optional: if you only want to autofill when includeInBakersMath is true,
	// uncomment the next line and add it as a guard in tryAutofill().
	// const includeInBakersMath = useFormValue(["bakers", "includeInBakersMath"]) as boolean | undefined;

	const didAutofill = useRef(false);

	const tryAutofill = useCallback(() => {
		if (didAutofill.current) {
			return;
		}

		// Don’t overwrite user-entered values.
		if (value !== undefined && value !== null) {
			didAutofill.current = true;
			return;
		}

		// If you only want to autofill when enabled:
		// if (includeInBakersMath !== true) { return; }

		const parsed = parseAmountToNumber(amount);
		if (parsed === null) {
			return;
		}

		onChange(set(parsed));
		didAutofill.current = true;
	}, [amount, onChange, value]);

	useEffect(() => {
		tryAutofill();
	}, [tryAutofill]);

	const handleFocus = useCallback(
		(event: React.FocusEvent<HTMLInputElement>) => {
			elementProps?.onFocus?.(event);
			tryAutofill();
		},
		[elementProps, tryAutofill],
	);

	return (
		<input
			{...elementProps}
			type="number"
			value={value ?? ""}
			onChange={(e) => {
				const next = e.currentTarget.value;
				if (next === "") {
					onChange(unset());
					return;
				}

				const n = Number(next);
				if (Number.isNaN(n)) {
					onChange(unset());
					return;
				}

				onChange(set(n));
			}}
			onFocus={handleFocus}
		/>
	);
}
