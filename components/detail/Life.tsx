import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextAreaCustomized from "./TextAreaCustomized";
import {useState} from "react";
import Grow from "@mui/material/Grow";
import {LifeProps} from "./interfaces";

export default function Life({visitorMessages, detail, memorialId}:LifeProps) {

	const [showTextArea, setShowTextArea] = useState(false);

	const handleButtonClick = (flag:boolean) => {
		setShowTextArea(flag);
	};

	return (
		<>
			<Container sx={{
				p: "1rem",
				fontSize: "1rem",
			}}
			  className={"diff-card-section"}
			>
				{detail && <div dangerouslySetInnerHTML={{ __html: detail.career_contents }} />}
			</Container>
			<Box>
				<Typography sx={{
					fontSize: '2rem',
					fontWeight: 'bold',
					mt: "5rem",
				}}>
					방문객 메시지
				</Typography>

				{!showTextArea &&
					<Grow in={!showTextArea}
                      style={{ transformOrigin: '0 0 0' }}
				      {...(!showTextArea ? { timeout: 200 } : {})}
					>
						<Box>
                            <Button variant="contained" onClick={() => handleButtonClick(true)}>메시지 쓰기</Button>
                        </Box>
					</Grow>
				}

				{showTextArea && (
					<Grow in={showTextArea}
				      style={{ transformOrigin: '0 0 0' }}
				      {...(showTextArea ? { timeout: 200 } : {})}
					>
						<Box>
							<TextAreaCustomized placeholder="방문객 메시지를 여기에 작성하세요." />
							<Box sx={{ textAlign: 'right' }}>
								<Button variant="contained" color="error" sx={{ mr: '.5rem' }} onClick={() => handleButtonClick(false)}>취소</Button>
								<Button variant="contained">게시하기</Button>
							</Box>
						</Box>
					</Grow>
				)}
			</Box>
			<Box sx={{ mt: "1rem" }}>
				{visitorMessages?.map(({created_at, message, user_name}, index) => {
					const date = new Date(created_at);
					const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;

					return (
						<Box key={index} sx={{ p: '1rem', mt: index !== 0 ? '2rem' : '0' }} className={"diff-card-section"}>
							<div style={{display:"flex"}}>
								<Typography>{user_name}</Typography>
								<Typography sx={{ p: "0 .5rem"}}>•</Typography>
								<Typography>{formattedDate}</Typography>
							</div>
							<div>
								<div dangerouslySetInnerHTML={{ __html: message }} />
							</div>
						</Box>
					);
				})}
			</Box>
		</>
	)
}