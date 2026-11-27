import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type NumberInputProps, set, unset, useClient, useFormValue } from "sanity";

const gramUnitQuery = `*[_id == $id][0].abbreviation == "g"`;

function parseAmountToNumber(amount: unknown): number | null {
	if (typeof amount !== "string") {
		return null;
	}

	// Gram amounts are whole or decimal numbers ("350", "350.5"); take the first one.
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
	const { value, onChange, elementProps, path } = props;

	// useFormValue takes a path from the document root. Grams lives at
	// ingredients[_key].bakers.grams, so the ingredient is two levels up.
	const ingredientPath = useMemo(() => path.slice(0, -2), [path]);
	const amount = useFormValue([...ingredientPath, "amount"]) as unknown;
	const unitRef = useFormValue([...ingredientPath, "unit", "_ref"]) as unknown;

	// Only copy the amount when the ingredient is measured in grams; 2 cups is not 2 grams.
	const client = useClient({ apiVersion: "2025-01-01" });
	const [isGrams, setIsGrams] = useState(false);
	useEffect(() => {
		if (typeof unitRef !== "string") {
			setIsGrams(false);
			return;
		}

		let cancelled = false;
		client
			.fetch<boolean>(gramUnitQuery, { id: unitRef })
			.then((result) => {
				if (!cancelled) {
					setIsGrams(result === true);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setIsGrams(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [client, unitRef]);

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

		if (!isGrams) {
			return;
		}

		const parsed = parseAmountToNumber(amount);
		if (parsed === null) {
			return;
		}

		onChange(set(parsed));
		didAutofill.current = true;
	}, [amount, isGrams, onChange, value]);

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
