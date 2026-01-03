import debounce from "@helpers/debounce";
import { useEffect } from "react";

const useDebounce = <A = unknown, R = void>(fn: (args: A) => R, ms: number): ((args: A) => Promise<R>) => {
	const [debouncedFun, teardown] = debounce<A, R>(fn, ms);

	useEffect(() => () => teardown(), [teardown]);

	return debouncedFun;
};

export default useDebounce;
