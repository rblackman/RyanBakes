export default async function resolveParams<T extends { [key: string]: unknown }>(params: T | Promise<T>): Promise<T> {
	return params instanceof Promise ? await params : params;
}
