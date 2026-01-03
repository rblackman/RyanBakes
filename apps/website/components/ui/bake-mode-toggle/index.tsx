"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./bake-mode-toggle.module.css";

export default function BakeModeToggle() {
	const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
	const [isBakeModeEnabled, setIsBakeModeEnabled] = useState(false);
	const [hasWakeLockSupport, setHasWakeLockSupport] = useState(() => "wakeLock" in navigator);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Request the wake lock
	const requestWakeLock = useCallback(async () => {
		if (!("wakeLock" in navigator)) {
			setHasWakeLockSupport(false);
			console.error("Wake Lock API not supported in this browser.");
			return;
		}

		setHasWakeLockSupport(true);

		try {
			const lock = await navigator.wakeLock?.request("screen");

			if (!lock) {
				console.error("Failed to acquire wake lock.");
				return;
			}
			setWakeLock(lock);
			console.log("Wake lock is active.");

			lock.addEventListener("release", () => {
				console.log("Wake lock has been released.");
			});
		} catch (err) {
			console.error(`Failed to acquire wake lock: ${(err as Error)?.message}`);
		}
	}, []);

	// Release the wake lock
	const releaseWakeLock = useCallback(async () => {
		if (wakeLock !== null) {
			try {
				await wakeLock.release();
				console.log("Wake lock released.");
				setWakeLock(null);
			} catch (err) {
				console.error(`Failed to release wake lock: ${(err as Error)?.message}`);
			}
		}
	}, [wakeLock]);

	// Handle tab visibility changes (so the lock is re-enabled when tab returns to focus)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible" && isBakeModeEnabled) {
				requestWakeLock();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [isBakeModeEnabled, requestWakeLock]);

	// Toggle the "bake mode" on button click
	const toggleBakeMode = async () => {
		setIsBakeModeEnabled((prev) => {
			const newState = !prev;
			if (newState) {
				requestWakeLock();
			} else {
				releaseWakeLock();
			}
			return newState;
		});
	};

	if (!isClient || !hasWakeLockSupport) {
		return null;
	}

	return (
		<p className={styles.toggleWrap}>
			<input
				className={styles.checkbox}
				id="bake-mode-toggle"
				type="checkbox"
				checked={isBakeModeEnabled}
				onChange={toggleBakeMode}
			/>
			<label className={styles.label} htmlFor="bake-mode-toggle">
				Bake Mode
			</label>
		</p>
	);
}
