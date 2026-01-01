/** biome-ignore-all lint/suspicious/noExplicitAny: type file */
/** biome-ignore-all lint/correctness/noUnusedVariables: type file */

interface WakeLockSentinel extends EventTarget {
	type: "screen";
	released: boolean;
	release(): Promise<void>;
	onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
}

interface Navigator {
	wakeLock?: {
		request(type: "screen"): Promise<WakeLockSentinel>;
	};
}
