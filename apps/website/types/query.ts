export default interface Query<T> {
	result: T[];
	ms: number;
	query: string;
}
