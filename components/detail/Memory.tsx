import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import MemoryForm from "@/components/detail/MemoryForm";
import Grow from "@mui/material/Grow";
import {Memory, MemoryProps} from "./interfaces";
import styles from '../../styles/detail/memory.module.css';
import { styled } from "@mui/system";
import { useSession } from "next-auth/react";
import { decrypt } from "@/utils/cryptUtil";

const WhiteButton = styled(Button)(() => ({
	backgroundColor: "white",
	color: 'black',
	'&:hover': {
		backgroundColor: 'white',
		color: 'black',
	},
}));

export default function Memory({ memories: initialMemories, memorialId, setMemories }: MemoryProps) {
	const [memories, setMemoriesState] = useState<Memory[]>(initialMemories);
	const [showFrom, setShowFormArea] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true); // 처음 로드 여부를 확인하는 상태
	const { data: session } = useSession();

	const handleButtonClick = () => {
		setShowFormArea(true);
	};

	const handleHideForm = () => {
		setShowFormArea(false);
		setInitialLoad(false); // "취소" 버튼 클릭 시 처음 로드가 아니므로 상태 변경
	};

	const handleDeleteMemory = async (id: number) => {
		if (!session) {
			alert("로그인 후 이용 가능합니다.");
			return false;
		}
		if (window.confirm('삭제하시겠습니까?')) {
			try {
				const formData = new FormData();
				formData.append("story_id", id.toString());
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memorial/${memorialId}/story/delete`, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${session.accessToken}`
					},
					body: formData,
				});
				const result = await response.json();
				if (result.result === 'success') {
					alert(result.message);
					// 삭제가 성공하면, local state와 부모 state에서 해당 메모리를 제거합니다.
					setMemoriesState((prevMemories: Memory[]) =>
						prevMemories.filter(memory => memory.id !== id)
					);
					setMemories((prevMemories: Memory[]) =>
						prevMemories.filter(memory => memory.id !== id)
					);
				} else {
					alert('삭제 실패: ' + result.message);
				}
			} catch (error) {
				console.error('삭제 중 오류 발생:', error);
			}
		}
	};

	return (
		<>
			<Box sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				mb: '2rem',
			}}>
				{!showFrom && (
					<Grow
						in={true} // 처음 로드가 아닐 때만 애니메이션 적용
						style={{ transformOrigin: '0 0 0' }}
						timeout={initialLoad ? 0 : 200} // 처음 로드일 때는 애니메이션 시간을 0으로 설정
					>
						<Box>
							<Button variant="contained" onClick={handleButtonClick}>
								추억 & 메시지 남기기
							</Button>
						</Box>
					</Grow>
				)}
				{showFrom && (
					<Grow
						in={showFrom}
						style={{ transformOrigin: '0 0 0' }}
						{...(showFrom ? { timeout: 200 } : {})}
					>
						<Box
							sx={{ p: '1rem', width: '100%' }}
							className={"diff-card-section"}
						>
							<MemoryForm
								onHideForm={handleHideForm}
								memorialId={memorialId}
								setMemories={(newMemories) => {
									setMemoriesState(newMemories);
									setMemories(newMemories);
								}}
							/>
						</Box>
					</Grow>
				)}
			</Box>
			<Box key={0} sx={{ mt: "1rem" }}>
				{memories.map(({ id, user_id, created_at, message, user_name, attachment }, index) => {
					const date = new Date(created_at);
					const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
					const htmlMessage = message.replace(/\n/g, '<br>');
					let loginUserId: number | null = null;
					if (session) {
						loginUserId = parseInt(decrypt(session.user_id));
					}
					return (
						<>
							<Box key={index} sx={{ p: '1rem', mt: index !== 0 ? '2rem' : '0' }} className={"diff-card-section"}>
								<div style={{ display: "flex" }}>
									<Typography>{user_name ?? '이름'}</Typography>
									<Typography sx={{ p: "0 .5rem" }}>•</Typography>
									<Typography>{formattedDate}</Typography>
								</div>
								<div>
									<div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: htmlMessage }} />
									{attachment && (
										/\.(jpg|jpeg|png)$/i.test(attachment.file_name) ? (
											<img
												src={`${process.env.NEXT_PUBLIC_IMAGE}${attachment.file_path}${attachment.file_name}`}
												alt="Memory Image"
												className={styles.customImage}
											/>
										) : /\.(mp4|mov)$/i.test(attachment.file_name) ? (
											<video controls className={styles.customImage}>
												<source
													src={`${process.env.NEXT_PUBLIC_IMAGE}${attachment.file_path}${attachment.file_name}`}
													type="video/mp4"
												/>
											</video>
										) : /\.(mp3)$/i.test(attachment.file_name) ? (
											<video controls className={styles.customImage}>
												<source
													src={`${process.env.NEXT_PUBLIC_IMAGE}${attachment.file_path}${attachment.file_name}`}
													type="audio/mp3"
												/>
											</video>
										) : null
									)}
								</div>
							</Box>
							{user_id === loginUserId && (
								<Box sx={{ display: 'flex', justifyContent: 'end' }}>
									<WhiteButton
										sx={{ backgroundColor: 'white', color: 'black' }}
										onClick={() => handleDeleteMemory(id)}
									>
										삭제
									</WhiteButton>
								</Box>
							)}
						</>
					);
				})}
			</Box>
		</>
	);
}
