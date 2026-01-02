import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

interface Size {
	width: number | undefined;
	height: number | undefined;
}

export default function useWindowSize() {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = useState<Size>({
		width: undefined,
		height: undefined,
	});

	const handleResize = useDebounce<unknown, void>(() => {
		// Set window width/height to state
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}, 100);

	useEffect(() => {
		// Add event listener
		window.addEventListener("resize", handleResize);
		// Call handler right away so state gets updated with initial window size
		handleResize({});
		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize]); // Empty array ensures that effect is only run on mount
	return windowSize;
}
