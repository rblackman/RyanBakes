export interface RuleField<T> {
	[key: string]: T;
}

export interface DocumentContent {
	[key: string]: unknown;
}

export interface Context {
	document: {
		content: DocumentContent;
	};
	parent: { [key: string]: unknown };
}

type SchemaType = 'https' | 'http' | 'mailto' | 'tel';

export interface UriOptions {
	allowRelative: boolean;
	scheme: SchemaType[];
}

export default interface SanityRule<T> {
	custom: (fn: (field: T, context: Context) => string | true) => SanityRule<T>;
	required: () => SanityRule<T>;
	optional: () => SanityRule<T>;
	min: (num: number) => SanityRule<T>;
	max: (num: number) => SanityRule<T>;
	warning: (text: string) => SanityRule<T>;
	error: (text: string) => SanityRule<T>;
	unique(): SanityRule<T>;
	precision: (digits: number) => SanityRule<T>;
	positive: () => SanityRule<T>;
	negative: () => SanityRule<T>;
	lessThan: (limit: number) => SanityRule<T>;
	greaterThan: (limit: number) => SanityRule<T>;
	uri: (options: UriOptions) => SanityRule<T>;
}
