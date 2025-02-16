import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextAreaCustomized from "./TextAreaCustomized";
import { useState, ChangeEvent } from "react";
import Grow from "@mui/material/Grow";
import { LifeProps } from "./interfaces";
import { useSession } from "next-auth/react";

export default function Life({ visitorMessages: initialVisitorMessages, detail, memorialId, setVisitorMessages }: LifeProps) {
	const [visitorMessages, setVisitorMessagesState] = useState(initialVisitorMessages);
	const { data: session } = useSession();
	const [showTextArea, setShowTextArea] = useState(false);
	const [message, setMessage] = useState("");
	const [isDisabled, setIsDisabled] = useState(false);

	const handleButtonClick = (flag: boolean) => {
		if (!session) {
			alert("로그인을 하셔야 메시지를 쓸 수 있어요");
			return false;
		}
		setShowTextArea(flag);
	};

	const handleRegisterComment = async () => {
		setIsDisabled(true);
		try {
			if (session && !isDisabled) {
				if (!message) {
					alert("메시지를 입력해주세요.")
					return false;
				}
				const url = `${process.env.NEXT_PUBLIC_API_URL}/api/memorial/${memorialId}/comment/register`;
				const formData = new FormData();
				formData.append("message", message);
				const response = await fetch(url, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
					},
					body: formData,
				});
				const result = await response.json();
				if (result.result === "success") {
					// 새로운 코멘트를 기존 메시지 리스트에 추가
					setVisitorMessages([...result.data]);
					setVisitorMessagesState([...result.data]);
					setMessage("");
				}
			} else {
				if (!session) {
					alert("로그인을 하셔야 메시지를 쓸 수 있어요.");
				}
			}
		} catch (error) {
			console.error("ERROR: ", error);
		} finally {
			setIsDisabled(false);
		}
	};

	const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	};

	return (
		<>
			<Container
				sx={{
					p: "1rem",
					fontSize: "1rem",
					wordWrap: 'break-word',
				}}
				className={"diff-card-section"}
			>
				{detail && <div dangerouslySetInnerHTML={{ __html: detail.career_contents }} />}
			</Container>
			<Box>
				<Typography
					sx={{
						fontSize: "2rem",
						fontWeight: "bold",
						mt: "5rem",
					}}
				>
					방문객 메시지
				</Typography>

				{!showTextArea && (
					<Grow
						in={!showTextArea}
						style={{ transformOrigin: "0 0 0" }}
						{...(!showTextArea ? { timeout: 200 } : {})}
					>
						<Box>
							<Button variant="contained" onClick={() => handleButtonClick(true)}>
								메시지 쓰기
							</Button>
						</Box>
					</Grow>
				)}

				{showTextArea && (
					<Grow
						in={showTextArea}
						style={{ transformOrigin: "0 0 0" }}
						{...(showTextArea ? { timeout: 200 } : {})}
					>
						<Box>
							<TextAreaCustomized placeholder="방문객 메시지를 여기에 작성하세요." onChange={handleMessageChange} value={message} />
							<Box sx={{ textAlign: "right" }}>
								<Button
									variant="contained"
									color="error"
									sx={{ mr: ".5rem" }}
									onClick={() => handleButtonClick(false)}
								>
									취소
								</Button>
								<Button variant="contained" onClick={handleRegisterComment} disabled={isDisabled} sx={{
									'&.Mui-disabled': {
										backgroundColor: 'gray',
										color: 'white'
									}
								}}>
									게시하기
								</Button>
							</Box>
						</Box>
					</Grow>
				)}
			</Box>
			<Box sx={{ mt: "1rem" }}>
				{visitorMessages?.map(({ created_at, message, user_name }, index) => {
					const date = new Date(created_at);
					const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;

					return (
						<Box
							key={index}
							sx={{ p: "1rem", mt: index !== 0 ? "2rem" : "0" }}
							className={"diff-card-section"}
						>
							<div style={{ display: "flex" }}>
								<Typography>{user_name}</Typography>
								<Typography sx={{ p: "0 .5rem" }}>•</Typography>
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