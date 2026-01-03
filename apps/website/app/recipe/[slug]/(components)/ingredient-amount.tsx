import Fraction from "@components/generic/fraction";
import type { Unit, UnitReference } from "@ryan-bakes/sanity-types";
import "server-only";

interface UnitDisplayProps {
	name: string;
	abbreviation: string;
	noUnit: boolean;
	full: boolean;
}

function UnitDisplay({ name, abbreviation, noUnit, full }: UnitDisplayProps) {
	if (noUnit) {
		return null;
	}

	return <span>{(full || "short") === "short" ? abbreviation : name}</span>;
}

interface AmountProps {
	display: "Fraction" | "Decimal";
	amount: string;
	noCount: boolean;
}

function AmountDisplay({ amount, display, noCount }: AmountProps) {
	if (noCount) {
		return null;
	}

	return display === "Fraction" ? <Fraction val={amount} /> : <span>{amount}</span>;
}

interface Props {
	amount: string;
	unit?: UnitReference;
	units: Unit[];
	full?: boolean;
}

export default function IngredientAmount({ amount, unit, units, full = false }: Props) {
	const unitRef = unit?._ref;

	const resolvedUnit = units.find(({ _id }) => {
		return _id === unitRef;
	});

	// If we can't resolve the referenced unit, render amount only.
	if (!resolvedUnit) {
		return <AmountDisplay amount={amount} display="Decimal" noCount={false} />;
	}

	const { display = "Decimal", noCount = false, noUnit = false, name = "", abbreviation = "" } = resolvedUnit;

	return (
		<>
			<AmountDisplay amount={amount} display={display} noCount={noCount} />
			<UnitDisplay name={name} abbreviation={abbreviation} noUnit={noUnit} full={full} />
		</>
	);
}
