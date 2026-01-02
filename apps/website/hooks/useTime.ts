export default function useTime(totalMinutes: number): { minutes: number; hours: number } {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return { hours, minutes };
}
