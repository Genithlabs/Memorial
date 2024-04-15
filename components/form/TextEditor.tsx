import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {useSession} from "next-auth/react"; // import styles

type ContentProps = {
	content: string,
	setContent: (content: any) => void
}

function TextEditor({ content, setContent }: ContentProps) {
	const {data: session} = useSession();
	const quillRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (typeof window !== 'undefined' && quillRef.current && session) {
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

			const imageHandler = () => {
				const input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('accept', 'image/*');
				document.body.appendChild(input);
				input.click();

				input.onchange = async () => {
					if (input.files && input.files.length > 0) {
						const file = input.files[0];
						const formData = new FormData();
						formData.append('career_contents_file', file);

						const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memorial/upload`, {
							method: 'POST',
							headers: {
								'Authorization': `Bearer ${session.accessToken}`
							},
							body: formData,
						});

						if (response.ok) {
							const data = await response.json();
							const range = quill.getSelection(true);
							const url = data.url; // 서버에서 반환된 이미지 URL
							quill.insertEmbed(range.index, 'image', url);
						}
					}
				};
			};

			quill.getModule('toolbar').addHandler('image', imageHandler);

			quill.on('text-change', () => {
				setContent(quill.root.innerHTML);
			});
		}
	}, [setContent]);

	return (
		<div id="container">
			<div id="editor" ref={quillRef} style={{ height: '500px' }}></div>
		</div>
	);
}

export default TextEditor;
