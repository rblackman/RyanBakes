import { Card, Checkbox, Flex, Stack, Text } from "@sanity/ui";
import { useCallback, useMemo } from "react";
import { type ArrayOfPrimitivesInputProps, set, unset, useFormValue } from "sanity";

type StepValue = { title?: unknown } | undefined;

type Option = Readonly<{ number: number; label: string; exists: boolean }>;

function stepLabel(step: StepValue, number: number): string {
	const title = typeof step?.title === "string" && step.title.trim().length > 0 ? step.title.trim() : "Untitled step";
	return `${number}. ${title}`;
}

/**
 * Shows the recipe's steps as checkboxes so editors pick steps by title instead of typing step
 * numbers. The stored value is unchanged: a sorted array of 1-based step numbers.
 */
export default function StepPickerInput(props: ArrayOfPrimitivesInputProps) {
	const { value, onChange, readOnly } = props;
	const steps = useFormValue(["steps"]);

	const selected = useMemo(
		() => new Set((Array.isArray(value) ? value : []).filter((n): n is number => typeof n === "number")),
		[value],
	);

	const options = useMemo<Option[]>(() => {
		const stepList: StepValue[] = Array.isArray(steps) ? (steps as StepValue[]) : [];
		const fromSteps = stepList.map((step, index) => ({
			number: index + 1,
			label: stepLabel(step, index + 1),
			exists: true,
		}));

		// Keep numbers that point past the last step visible, so they can be unticked.
		const missing = [...selected]
			.filter((n) => n < 1 || n > stepList.length || !Number.isInteger(n))
			.sort((a, b) => a - b)
			.map((n) => ({ number: n, label: `${n}. (this step does not exist)`, exists: false }));

		return [...fromSteps, ...missing];
	}, [steps, selected]);

	const toggle = useCallback(
		(number: number) => {
			const next = new Set(selected);
			if (next.has(number)) {
				next.delete(number);
			} else {
				next.add(number);
			}

			const sorted = [...next].sort((a, b) => a - b);
			onChange(sorted.length > 0 ? set(sorted) : unset());
		},
		[onChange, selected],
	);

	if (options.length === 0) {
		return (
			<Card padding={3} radius={2} tone="transparent" border>
				<Text size={1} muted>
					Add steps in the Steps tab first, then tick the steps that use this ingredient.
				</Text>
			</Card>
		);
	}

	return (
		<Card padding={3} radius={2} border>
			<Stack gap={3}>
				{options.map((option) => {
					const id = `${props.id}-step-${option.number}`;
					return (
						<Flex key={option.number} align="center" gap={2}>
							<Checkbox
								id={id}
								checked={selected.has(option.number)}
								readOnly={readOnly}
								disabled={readOnly}
								onChange={() => {
									toggle(option.number);
								}}
							/>
							<Text as="label" htmlFor={id} size={1} weight={option.exists ? "regular" : "semibold"}>
								{option.label}
							</Text>
						</Flex>
					);
				})}
			</Stack>
		</Card>
	);
}
