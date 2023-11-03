import * as React from 'react';
import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('./TextEditor'), { ssr: false });

export default function Birth() {
	return (
		<>
			<TextEditor />
		</>
	);
}
