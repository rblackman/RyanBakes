import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type NumberInputProps, set, unset, useClient, useFormValue } from "sanity";

const gramUnitQuery = `*[_id == $id][0].abbreviation == "g"`;

function parseAmountToNumber(amount: unknown): number | null {
	if (typeof amount !== "string") {
		return null;
	}

	// Only a plain whole or decimal number ("350", "350.5", ".5"). Fractions and ranges are left for
	// the editor to enter by hand, so "1/2" never becomes 1 gram.
	const trimmed = amount.trim();
	if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed)) {
		return null;
	}

	const value = Number(trimmed);
	if (Number.isNaN(value)) {
		return null;
	}

	return value;
}

export default function AutofillGramsInput(props: NumberInputProps) {
	const { value, onChange, elementProps, path, readOnly } = props;

	// useFormValue takes a path from the document root. Grams lives at
	// ingredients[_key].bakers.grams, so the ingredient is two levels up.
	const ingredientPath = useMemo(() => path.slice(0, -2), [path]);
	const amount = useFormValue([...ingredientPath, "amount"]) as unknown;
	const unitRef = useFormValue([...ingredientPath, "unit", "_ref"]) as unknown;

	// Only copy the amount when the ingredient is measured in grams; 2 cups is not 2 grams.
	const client = useClient({ apiVersion: "2025-01-01" });
	// The unit ID last confirmed to be grams. Comparing it with the current unit means a lookup that
	// is still running for a newly picked unit can never reuse the old answer.
	const [gramUnitId, setGramUnitId] = useState<string | null>(null);
	const isGrams = typeof unitRef === "string" && gramUnitId === unitRef;
	useEffect(() => {
		if (typeof unitRef !== "string") {
			setGramUnitId(null);
			return;
		}

		let cancelled = false;
		client
			.fetch<boolean>(gramUnitQuery, { id: unitRef })
			.then((result) => {
				if (!cancelled) {
					setGramUnitId(result === true ? unitRef : null);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setGramUnitId(null);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [client, unitRef]);

	// Fill only when the editor moves into the grams field, never while the amount is being typed:
	// an effect would copy "3" on the way to "350" and keep it.
	const tryAutofill = useCallback(() => {
		if (readOnly) {
			return;
		}

		// Don't overwrite a weight that is already there.
		if (value !== undefined && value !== null) {
			return;
		}

		if (!isGrams) {
			return;
		}

		const parsed = parseAmountToNumber(amount);
		if (parsed === null) {
			return;
		}

		onChange(set(parsed));
	}, [amount, isGrams, onChange, readOnly, value]);

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
