import { useMemo } from "react";
import "server-only";
import { normalizeAmountToFractions } from "./decimal-to-fraction";
import styles from "./fraction.module.css";

function FractionPart({ val }: { val: string }) {
	const hasSlash = useMemo(() => val && val.length > 0 && val.indexOf("/") > 0, [val]);

	const [numerator, denominator] = useMemo(() => {
		if (hasSlash) {
			return val.split("/").map((num) => num.trim());
		}
		return [null, null];
	}, [val, hasSlash]);

	if (hasSlash) {
		return (
			<>
				<sup className={styles.numerator}>{numerator}</sup>
				<span className={styles.divide}>/</span>
				<sub className={styles.denominator}>{denominator}</sub>
			</>
		);
	}
	return <span>{val}</span>;
}

export default function Fraction({ val }: { val: string }) {
	// Amounts may be stored as decimals ("0.25"); show them as fractions ("1/4").
	const parts = useMemo(() => normalizeAmountToFractions(val).split(" "), [val]);

	return (
		<>
			{parts.map((part) => (
				<FractionPart val={part} key={part} />
			))}
		</>
	);
}
