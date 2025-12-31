'use client';

import { useEffect, useState } from 'react';
import styles from './(styles)/bakeModeToggle.module.css';

export default function BakeModeToggle() {
	const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
	const [isBakeModeEnabled, setIsBakeModeEnabled] = useState(false);
	const [hasWakeLockSupport, setHasWakeLockSupport] = useState(() => 'wakeLock' in navigator);

	// Request the wake lock
	const requestWakeLock = async () => {
		if (!('wakeLock' in navigator)) {
			setHasWakeLockSupport(false);
			console.error('Wake Lock API not supported in this browser.');
			return;
		}

		setHasWakeLockSupport(true);

		try {
			const lock = await navigator.wakeLock?.request('screen');

			if (!lock) {
				console.error('Failed to acquire wake lock.');
				return;
			}
			setWakeLock(lock);
			console.log('Wake lock is active.');

			lock.addEventListener('release', () => {
				console.log('Wake lock has been released.');
			});
		} catch (err) {
			console.error(`Failed to acquire wake lock: ${(err as Error)?.message}`);
		}
	};

	// Release the wake lock
	const releaseWakeLock = async () => {
		if (wakeLock !== null) {
			try {
				await wakeLock.release();
				console.log('Wake lock released.');
				setWakeLock(null);
			} catch (err) {
				console.error(`Failed to release wake lock: ${(err as Error)?.message}`);
			}
		}
	};

	// Handle tab visibility changes (so the lock is re-enabled when tab returns to focus)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && isBakeModeEnabled) {
				requestWakeLock();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [isBakeModeEnabled]);

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

	if (!hasWakeLockSupport) {
		return null;
	}

	return (
		<p className={styles.toggleWrap}>
			<input className={styles.checkbox} id="bake-mode-toggle" type="checkbox" checked={isBakeModeEnabled} onChange={toggleBakeMode} />
			<label className={styles.label} htmlFor="bake-mode-toggle">
				Bake Mode
			</label>
		</p>
	);
}
