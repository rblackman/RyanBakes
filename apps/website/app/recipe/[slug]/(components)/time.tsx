import 'server-only';
import useTime from '../../../../hooks/useTime';

interface Props {
	totalMinutes: number;
}

export default function Time({ totalMinutes }: Props) {
	const { hours, minutes } = useTime(totalMinutes);
	const minuteValue = `${minutes} minute${minutes > 1 ? 's' : ''}`;
	if (hours > 0) {
		const hourValue = `${hours} hour${hours > 1 ? 's' : ''}`;
		return <span>{minutes === 0 ? hourValue : `${hourValue} ${minuteValue}`}</span>;
	}
	return <span>{minuteValue}</span>;
}
