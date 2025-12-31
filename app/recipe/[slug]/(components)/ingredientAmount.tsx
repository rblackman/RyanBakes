import Fraction from 'app/recipe/[slug]/(components)/fraction';
import type { SanityReference } from 'sanity-codegen';
import 'server-only';
import type { Unit } from 'types/sanity-schema';

interface UnitDisplayProps extends Pick<Unit, 'name' | 'abbreviation' | 'noUnit'> {
	full: boolean;
}

function UnitDisplay({ name, abbreviation, noUnit, full }: UnitDisplayProps) {
	if (noUnit) {
		return null;
	}

	return <span>{(full || 'short') === 'short' ? abbreviation : name}</span>;
}

interface AmountProps {
	display: 'Fraction' | 'Decimal';
	amount: string;
	noCount: boolean;
}

function AmountDisplay({ amount, display, noCount }: AmountProps) {
	if (noCount) {
		return null;
	} else {
		return display === 'Fraction' ? <Fraction val={amount} /> : <span>{amount}</span>;
	}
}

interface Props {
	amount: string;
	unit: SanityReference<Unit>;
	units: Unit[];
	full?: boolean;
}

export default function IngredientAmount({ amount, unit: { _ref: unitRef }, units, full }: Props) {
	const { display, noCount, noUnit, name, abbreviation } = units.filter(({ _id: id }) => id === unitRef)[0];

	const unitNode = <UnitDisplay name={name} abbreviation={abbreviation} noUnit={noUnit} full={full ?? false} />;
	const amountNode = <AmountDisplay amount={amount} display={display} noCount={noCount} />;

	return (
		<>
			{amountNode}
			{unitNode}
		</>
	);
}

IngredientAmount.defaultProps = {
	full: false
};
