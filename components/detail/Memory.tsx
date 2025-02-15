import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useState} from "react";
import MemoryForm from "@/components/detail/MemoryForm";
import Grow from "@mui/material/Grow";
import {MemoryProps} from "./interfaces";

export default function Memory({ memories: initialMemories, memorialId, setMemories }: MemoryProps) {
	const [memories, setMemoriesState] = useState(initialMemories);
	const [showFrom, setShowFormArea] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);  // 처음 로드 여부를 확인하는 상태

	const handleButtonClick = () => {
		setShowFormArea(true);
	};

	const handleHideForm = () => {
		setShowFormArea(false);
		setInitialLoad(false);  // "취소" 버튼 클릭 시 처음 로드가 아니므로 상태 변경
	};

	return (
		<>
			<Box sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				mb: '2rem',
			}}>
				{!showFrom &&
                    <Grow in={true}  // 처음 로드가 아닐 때만 애니메이션 적용
                          style={{ transformOrigin: '0 0 0' }}
                          timeout={initialLoad ? 0 : 200}  // 처음 로드일 때는 애니메이션 시간을 0으로 설정
                    >
	                    <Box>
                            <Button variant="contained" onClick={handleButtonClick}>추억 & 메시지 남기기</Button>
                        </Box>
                    </Grow>
				}
				{showFrom &&
					<Grow in={showFrom}
						  style={{ transformOrigin: '0 0 0' }}
						  {...(showFrom ? { timeout: 200 } : {})}
					>
						<Box sx={{
							p: '1rem',
							width: '100%',
						}}
							 className={"diff-card-section"}
						>
							<MemoryForm onHideForm={handleHideForm} memorialId={memorialId} setMemories={(newMemories) => { setMemoriesState(newMemories); setMemories(newMemories); }} />
						</Box>
					</Grow>
				}
			</Box>
			<Box sx={{ mt: "1rem" }}>
				{memories.map(({created_at, message, user_name, attachment}, index) => {
					const date = new Date(created_at);
					const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;
					const htmlMessage = message.replace(/\n/g, '<br>');

					return (
						<Box key={index} sx={{ p: '1rem', mt: index !== 0 ? '2rem' : '0' }} className={"diff-card-section"}>
							<div style={{display:"flex"}}>
								<Typography>{user_name ?? '이름'}</Typography>
								<Typography sx={{ p: "0 .5rem"}}>•</Typography>
								<Typography>{formattedDate}</Typography>
							</div>
							<div>
								<div dangerouslySetInnerHTML={{ __html: htmlMessage }} />
								{attachment && (
									/\.(jpg|jpeg|png)$/i.test(attachment.file_name) ? (
										<img
											src={`${process.env.NEXT_PUBLIC_IMAGE}${attachment.file_path}${attachment.file_name}`}
											alt="Memory Image"
											style={{ width: '100%', marginTop: '1rem' }}
										/>
									) : /\.(mp4|mov)$/i.test(attachment.file_name) ? (
										<video controls style={{ width: '100%', marginTop: '1rem' }}>
											<source
												src={`${process.env.NEXT_PUBLIC_IMAGE}${attachment.file_path}${attachment.file_name}`}
												type="video/mp4"
											/>
										</video>
									) : /\.(mp3)$/i.test(attachment.file_name) ? (
										<video controls style={{ width: '100%', marginTop: '1rem', height: '60px' }}>
											<source
												src={`${process.env.NEXT_PUBLIC_IMAGE}${attachment.file_path}${attachment.file_name}`}
												type="audio/mp3"
											/>
										</video>
									) : null
								)}
							</div>
						</Box>
					);
				})}
			</Box>
		</>
	)
}