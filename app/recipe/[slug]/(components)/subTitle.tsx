import getRecipeBySlug from "queries/getRecipeBySlug";
import { Fragment, type ReactNode } from "react";
import "server-only";
import type { Props } from "../page";
import styles from "./(styles)/subTitle.module.css";
import Temp from "./temp";
import Time from "./time";

interface SubTitleProps extends Readonly<Omit<Props, "params">> {
	params: { slug: string } | Promise<{ slug: string }>;
}

export default async function SubTitle({ params }: SubTitleProps) {
	const resolvedParams = params instanceof Promise ? await params : params;
	const { slug } = resolvedParams;
	const { preheat, bakeTime, totalTime, serves } = await getRecipeBySlug(slug);

	if (!(preheat || bakeTime || totalTime || serves)) {
		return null;
	}

	const elements: ReactNode[] = [];

	if (totalTime) {
		elements.push(
			<Fragment key="totalTime">
				<dt>Total Time</dt>
				<dd>
					<Time totalMinutes={totalTime} />
				</dd>
			</Fragment>,
		);
	}

	if (bakeTime) {
		elements.push(
			<Fragment key="bakeTime">
				<dt>Bake Time</dt>
				<dd>
					<Time totalMinutes={bakeTime} />
				</dd>
			</Fragment>,
		);
	}

	if (preheat) {
		elements.push(
			<Fragment key="preheat">
				<dt>Preheat</dt>
				<dd>
					<Temp fahrenheit={preheat} />
				</dd>
			</Fragment>,
		);
	}

	if (serves) {
		elements.push(
			<Fragment key="serves">
				<dt>Serves</dt>
				<dd>{serves}</dd>
			</Fragment>,
		);
	}

	return (
		<div className={styles.subHeading}>
			{" "}
			<dl className={styles.dl}>{elements}</dl>
		</div>
	);
}
