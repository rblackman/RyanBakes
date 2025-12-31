export function onlyUnique<T>(value: T, index: number, self: T[]) {
	return self.indexOf(value) === index;
}

export default function Distinct<T>(array: T[]): T[] {
	return array.filter(onlyUnique);
}
