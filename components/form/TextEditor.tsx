import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // import styles

type ContentProps = {
	content: string,
	setContent: (content: any) => void
}

function TextEditor({content, setContent}: ContentProps) {
	const quillRef = useRef(null);

	useEffect(() => {
		if (typeof window !== 'undefined' && quillRef.current) {
			const quill = new Quill(quillRef.current, {
				theme: 'snow',
				modules: {
					toolbar: [
						[{ 'size': ['small', false, 'large', 'huge'] }],
						['bold', 'italic', 'underline', 'strike'],
						[{ 'color': [] }, { 'background': [] }],
						['link', 'image', 'video'],
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						[{ 'align': [] }],
						['clean']
					],
				},
			});
			quill.on('text-change', () => {
				setContent(quill.root.innerHTML)
			});
		}
	}, []);

	return (
		<div id="container">
			<div id="editor" ref={quillRef} style={{ height: '500px' }}></div>
		</div>
	);
}

export default TextEditor;
