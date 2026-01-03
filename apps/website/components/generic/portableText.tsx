import type {
	PortableTextComponentProps,
	PortableTextComponents,
	PortableTextMarkComponentProps,
	PortableTextProps,
} from "@portabletext/react";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import type { PortableTextBlock, TypedObject } from "@portabletext/types";
import Fraction from "components/generic/fraction";
import Link from "next/link";
import type { ReactNode } from "react";
import "server-only";
import Heading from "./heading";

interface ExternalLinkProps {
	_type: string;
	href: string;
}

function UnknownMark({ children, markType }: { children: ReactNode; markType: string }) {
	console.warn("Unknown Mark", { children, markType });
	return <span className="UNKNOWN_MARK">{children}</span>;
}

type BlockProps = PortableTextComponentProps<PortableTextBlock>;

const portableTextComponents: PortableTextComponents = {
	block: {
		h1: ({ children }: BlockProps) => {
			return <Heading level={2}>{children}</Heading>;
		},
		h2: ({ children }: BlockProps) => {
			return <Heading level={3}>{children}</Heading>;
		},
		h3: ({ children }: BlockProps) => {
			return <Heading level={4}>{children}</Heading>;
		},
		normal: ({ children }: BlockProps) => {
			return <p>{children}</p>;
		},
	},
	marks: {
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
	},
};

export default function PortableText<B extends TypedObject = PortableTextBlock>(
	props: Exclude<PortableTextProps<B>, "components">,
) {
	return <PortableTextComponent {...props} components={portableTextComponents} />;
}
