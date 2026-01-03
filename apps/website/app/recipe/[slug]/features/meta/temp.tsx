import "server-only";

interface Props {
	fahrenheit: number;
}

export default function Temp({ fahrenheit }: Props) {
	return <span>{fahrenheit}°F</span>;
}
