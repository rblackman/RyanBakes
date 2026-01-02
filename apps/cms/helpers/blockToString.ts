type PortableTextChild = { text?: string };
type PortableTextBlock = { _type: "block"; children?: PortableTextChild[] };

export default function blockToString(blocks: unknown[]): string {
	return (blocks as PortableTextBlock[])
		.filter((b) => b?._type === "block" && Array.isArray(b.children))
		.flatMap((b) => b.children ?? [])
		.map((c) => c?.text ?? "")
		.filter(Boolean)
		.join(" ");
}

export function blocksToString(sections: { text: unknown[] }[], separator: string = " / "): string {
	return sections.map(({ text }) => blockToString(text)).join(separator);
}
