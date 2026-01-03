import { Fragment, type ReactNode } from "react";
import styles from "./recipe-meta.module.css";
import Temp from "./temp";
import Time from "./time";

type Props = Readonly<{
	preheat?: number | undefined;
	bakeTime?: number | undefined;
	totalTime?: number | undefined;
	serves?: string | undefined;
}>;

export default function RecipeMeta({ preheat, bakeTime, totalTime, serves }: Props) {
	if (preheat === undefined && bakeTime === undefined && totalTime === undefined && serves === undefined) {
		return null;
	}

	const elements: ReactNode[] = [];

	if (typeof totalTime === "number") {
		elements.push(
			<Fragment key="totalTime">
				<dt>Total Time</dt>
				<dd>
					<Time totalMinutes={totalTime} />
				</dd>
			</Fragment>,
		);
	}

	if (typeof bakeTime === "number") {
		elements.push(
			<Fragment key="bakeTime">
				<dt>Bake Time</dt>
				<dd>
					<Time totalMinutes={bakeTime} />
				</dd>
			</Fragment>,
		);
	}

	if (typeof preheat === "number") {
		elements.push(
			<Fragment key="preheat">
				<dt>Preheat</dt>
				<dd>
					<Temp fahrenheit={preheat} />
				</dd>
			</Fragment>,
		);
	}

	if (typeof serves === "string") {
		elements.push(
			<Fragment key="serves">
				<dt>Serves</dt>
				<dd>{serves}</dd>
			</Fragment>,
		);
	}

	return (
		<div className={styles.subHeading}>
			<dl className={styles.dl}>{elements}</dl>
		</div>
	);
}
