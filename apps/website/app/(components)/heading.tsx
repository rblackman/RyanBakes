import clsx from 'clsx';
import assertUnreachable from 'helpers/assertUnreachable';
import { createElement, CSSProperties, ReactNode } from 'react';
import 'server-only';

interface Props {
	level: 2 | 3 | 4;
	children: ReactNode;
	style?: CSSProperties | undefined;
	sr?: boolean;
	className?: string;
}

export default function Heading({ level, children, sr, style: inlineStyles, className: providedClass }: Props) {
	let heading: 'h2' | 'h3' | 'h4';

	switch (level) {
		case 2:
			heading = 'h2';
			break;
		case 3:
			heading = 'h3';
			break;
		case 4:
			heading = 'h4';
			break;
		default:
			assertUnreachable(level);
			heading = 'h2';
	}

	const className = clsx(providedClass, { sr: sr === true });
	const props = {
		style: inlineStyles || {},
		className
	};

	return createElement(heading, props, children);
}

Heading.defaultProps = {
	sr: false,
	style: undefined
};
