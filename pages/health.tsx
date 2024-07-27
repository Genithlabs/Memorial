import { useEffect, useState } from 'react';

export default function HealthCheck() {
	const [status, setStatus] = useState('loading...');

	useEffect(() => {
		const fetchHealthStatus = async () => {
			try {
				const response = await fetch('/api/health');
				if (response.ok) {
					const data = await response.json();
					setStatus(data.status);
				} else {
					setStatus('error');
				}
			} catch (error) {
				setStatus('error');
			}
		};

		fetchHealthStatus();
	}, []);

	return (
		<div>
			<h1>Health Check</h1>
			<p>Status: {status}</p>
		</div>
	);
};