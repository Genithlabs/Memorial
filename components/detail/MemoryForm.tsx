import TextField from "@mui/material/TextField";
import React, {ChangeEvent, useState} from "react";
import TextAreaCustomized from "@/components/detail/TextAreaCustomized";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useSession} from "next-auth/react";

interface MemoryFormProps {
	onHideForm: () => void
	memorialId: number
	setMemories: (memories: []) => void
}

export default function MemoryForm({ onHideForm, memorialId, setMemories }: MemoryFormProps) {
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [title, setTitle] = useState('');
	const [message, setMessage] = useState('');
	const [attachment, setAttachment] = useState<File | null>(null);
	const { data: session } = useSession();
	const [isDisabled, setDisabled] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			setSelectedFile(file.name);
			setAttachment(file);
		} else {
			event.target.value = '';
			setAttachment(null);
		}
	};

	const handleRegisterStory = async () => {
		setDisabled(true);
		try {
			if (session && !isDisabled) {
				if (!title) {
					alert("제목을 입력해주세요.")
					return false;
				}
				if (!message) {
					alert("메시지를 입력해주세요.")
					return false;
				}
				const url = `${process.env.NEXT_PUBLIC_API_URL}/api/memorial/${memorialId}/story/register`;
				const formData = new FormData();
				formData.append('title', title);
				formData.append('message', message);
				if (attachment) {
					formData.append('attachment', attachment);
				}
				const response = await fetch(url, {
					method: "POST",
					headers: {
						'Authorization': `Bearer ${session.accessToken}`,
					},
					body: formData,
				});
				const result = await response.json();
				if (result.result === "success") {
					// 새로운 스토리를 기존 스토리 리스트에 추가
					alert(result.message);
					setMemories(result.data);
					onHideForm();
					setAttachment(null);
					setTitle('');
					setMessage('');
				} else {
					alert(result.message)
				}
			}
		} catch (error) {
			console.error("ERROR: ", error);
		} finally {
			setDisabled(false);
		}
	};

	return (
		<>
			<TextField
				required
				id="title"
				name="title"
				label="타이틀"
				fullWidth
				variant="standard"
				sx={{
					mb: '2rem',
				}}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<TextAreaCustomized placeholder={"기념하고 싶은 추억, 전하고 싶은 메시지를 남겨보세요"} onChange={e=>setMessage(e.target.value)} value={message} />
			<Typography sx={{
				fontSize: '.875rem',
				mt: '2rem',
				color: 'text.secondary',
			}}>
				사진, 음성, 동영상 파일 첨부 (사진은 최대 000x000 사이즈로 업로드해주세요)
			</Typography>
			<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
				<input
					style={{ display: 'none' }}
					id="raised-button-file"
					type="file"
					onChange={handleChange}
				/>
				{!selectedFile &&
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span" color="inherit">
                            파일을 선택해주세요.
                        </Button>
                    </label>
				}
				{selectedFile &&
                    <>
                        <Typography variant="body1">
							{selectedFile}
                        </Typography>
                        <Button variant="text" onClick={() => setSelectedFile(null)} style={{ position: 'absolute', top: 0, right: 0 }} color="inherit">
                            x
                        </Button>
                    </>
				}
			</Paper>
			<Box sx={{ textAlign: 'right', mt: '1rem' }}>
				<Button variant="contained" color="error" sx={{ mr: '.5rem' }} onClick={onHideForm}>취소</Button>
				<Button variant="contained" onClick={handleRegisterStory} disabled={isDisabled} sx={{
					'&.Mui-disabled': {
						backgroundColor: 'gray',
						color: 'white'
					}
				}}>게시하기</Button>
			</Box>
		</>
	)
}