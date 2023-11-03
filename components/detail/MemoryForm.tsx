import TextField from "@mui/material/TextField";
import {useState} from "react";
import TextAreaCustomized from "@/components/detail/TextAreaCustomized";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function MemoryForm({ onHideForm }: { onHideForm: () => void }) {
	const [selectedFile, setSelectedFile] = useState<string | null>(null);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			setSelectedFile(file.name);
		}
		if (event.target) {
			event.target.value = '';
		}
	};

	return (
		<>
			<TextField
				required
				id="subject"
				name="subject"
				label="타이틀"
				fullWidth
				variant="standard"
				sx={{
					mb: '2rem',
				}}
			/>
			<TextAreaCustomized placeholder={"기념하고 싶은 추억, 전하고 싶은 메시지를 남겨보세요"} />
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
				<Button variant="contained">게시하기</Button>
			</Box>
		</>
	)
}