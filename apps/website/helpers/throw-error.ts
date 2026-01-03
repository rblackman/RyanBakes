export default function throwError(message: string): never {
	throw new Error(message);
}

export function throwTypedError<E extends Error>(ErrorConstructor: new (message: string) => E, message: string): never {
	throw new ErrorConstructor(message);
}
