import Fraction from "@components/ui/fraction";
import type {
	PortableTextComponentProps,
	PortableTextComponents,
	PortableTextMarkComponentProps,
	PortableTextProps,
} from "@portabletext/react";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import type { PortableTextBlock, TypedObject } from "@portabletext/types";
import Link from "next/link";
import type { ReactNode } from "react";
import "server-only";
import Heading from "./heading";

type ExternalLinkProps = Readonly<{
	_type: string;
	href: string;
}>;

function UnknownMark({ children, markType }: { children: ReactNode; markType: string }) {
	console.warn("Unknown Mark", { children, markType });
	return <span className="UNKNOWN_MARK">{children}</span>;
}

type BlockProps = PortableTextComponentProps<PortableTextBlock>;

export type RichTextHeadingLevel = 2 | 3 | 4;
type HeadingLevel = RichTextHeadingLevel;

/**
 * Renders authored headings at their own level (the Studio offers H2 to H4) but never above
 * `minLevel`, so rich text nested under a section heading stays below it. An h1 from older
 * content counts as h2, so a page never gets a second h1.
 */
function headingBlocks(minLevel: HeadingLevel) {
	const at =
		(authored: HeadingLevel) =>
		({ children }: BlockProps) => <Heading level={Math.max(authored, minLevel) as HeadingLevel}>{children}</Heading>;
	return { h1: at(2), h2: at(2), h3: at(3), h4: at(4) };
}

const marks = {
	externalLink: ({ children, value, markType }: PortableTextMarkComponentProps<ExternalLinkProps>) => {
		if (value) {
			const { href } = value;
			if (href.startsWith("/")) {
				return <Link href={href}>{children}</Link>;
			}
			return <a href={href}>{children}</a>;
		}
		return <UnknownMark markType={markType}>{children}</UnknownMark>;
	},
	fraction: ({ children, markType }: { children: ReactNode; markType: string }) => {
		const childArray = children as unknown as Array<string | ReactNode>;
		const first = childArray?.[0];
		const val = typeof first === "string" ? first : "";

		if (val) {
			return <Fraction val={val} />;
		}

		return <UnknownMark markType={markType}>{children}</UnknownMark>;
	},
} satisfies NonNullable<PortableTextComponents["marks"]>;

function components(minLevel: HeadingLevel): PortableTextComponents {
	return {
		block: {
			...headingBlocks(minLevel),
			normal: ({ children }: BlockProps) => <p>{children}</p>,
		},
		marks,
	};
}

const componentsByMinLevel: Record<HeadingLevel, PortableTextComponents> = {
	2: components(2),
	3: components(3),
	4: components(4),
};

type Props<B extends TypedObject> = Omit<PortableTextProps<B>, "components"> & {
	/** The highest heading level authored headings may use. Pass 3 when the text sits under an h2. */
	minHeadingLevel?: HeadingLevel | undefined;
};

export default function PortableText<B extends TypedObject = PortableTextBlock>({
	minHeadingLevel = 2,
	...props
}: Props<B>) {
	return <PortableTextComponent {...props} components={componentsByMinLevel[minHeadingLevel]} />;
}
