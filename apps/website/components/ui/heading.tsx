import assertUnreachable from "@helpers/assert-unreachable";
import clsx from "clsx";
import { type CSSProperties, createElement, type ReactNode } from "react";
import "server-only";

type Props = Readonly<{
	level: 1 | 2 | 3 | 4;
	children: ReactNode;
	style?: CSSProperties | undefined;
	sr?: boolean;
	className?: string;
	id?: string | undefined;
}>;

export default function Heading({ level, children, sr, style: inlineStyles, className: providedClass, id }: Props) {
	let heading: "h1" | "h2" | "h3" | "h4";

	switch (level) {
		case 1:
			heading = "h1";
			break;
		case 2:
			heading = "h2";
			break;
		case 3:
			heading = "h3";
			break;
		case 4:
			heading = "h4";
			break;
		default:
			assertUnreachable(level);
			heading = "h2";
	}

	const className = clsx(providedClass, { sr: sr === true });
	const props = {
		style: inlineStyles || {},
		className,
		...(id ? { id } : {}),
	};

	return createElement(heading, props, children);
}
