import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Preview({ memorialId, basicInfo, content }: any) {
	const { data: session } = useSession();
	const router = useRouter();

	const handleFinalize = async () => {
		try {
			if (!memorialId) {
				if (session) {
					const formData = new FormData();
					formData.append('user_name', basicInfo.user_name);
					formData.append('birth_start', basicInfo.birth_start);
					if (basicInfo.birth_end) {
						formData.append('birth_end', basicInfo.birth_end);
					}
					if (basicInfo.profile) {
						formData.append('profile', basicInfo.profile);
					}
					if (basicInfo.bgm) {
						formData.append('bgm', basicInfo.bgm);
					}
					formData.append('career', content);

					const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memorial/register`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${session.accessToken}`,
						},
						body: formData,
					});

					const result = await response.json();
					if (response.ok && result.result === 'success') {
						alert('기념관이 성공적으로 등록되었습니다.');
						router.push(`/detail/${result.data.id}`);
					} else {
						const errorMessage = result.message ?
							(Array.isArray(result.message) ? result.message.join(', ') : result.message)
							: 'ERROR!!';
						alert(`ERROR: ${errorMessage}`);
					}
				}
			} else {
				router.push(`/detail/${memorialId}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container component="main"
				   sx={{
					   display: "flex",
					   flexDirection: "column",
					   justifyContent: "center",
					   alignItems: "center",
				   }}>
			<Typography
				align="center"
				color="text.primary"
				gutterBottom
				sx={{
					fontSize: {
						xs: '1.3rem',
						sm: '1.3rem',
						md: '1.3rem'
					},
					fontWeight: "bold",
					wordBreak: 'keep-all',
					mt: 6
				}}
			>
				앞으로 30일 동안 기념관을 무료로 이용할 수 있습니다.
			</Typography>
			<Button variant="contained" sx={{ mt: 2, fontSize: "1rem", p: 2, fontWeight: "bold" }} onClick={handleFinalize}>건립한 기념관 보기</Button>
			<Typography
				align="center"
				color="text.primary"
				gutterBottom
				sx={{
					fontSize: {
						xs: '1.3rem',
						sm: '1.3rem',
						md: '1.3rem'
					},
					fontWeight: "bold",
					mt: 10,
					wordBreak: 'keep-all',
				}}
			>
				단 한 번의 지출로 영원한 당신의 기념관을 건립하세요.
			</Typography>
			<div>
				<Typography
					align="left"
					color="text.primary"
					gutterBottom
					sx={{
						fontSize: {
							xs: '1rem',
							sm: '1rem',
							md: '1.3rem'
						},
						mt: 4,
						wordBreak: 'keep-all',
					}}
				>
					당신의 기념관을 건립하면?
				</Typography>
				<List sx={{ listStyleType: 'upper-roman', pl: { xs: 4, md: 4 } }}>
					<ListItem sx={{ display: 'list-item' }}>
						<ListItemText primary="한 사람의 추억과 인생을 특별하게 남길 수 있습니다" />
					</ListItem>
					<ListItem sx={{ display: 'list-item' }}>
						<ListItemText primary="인생을 돌아보며 정리하고 기념할 수 있습니다" />
					</ListItem>
					<ListItem sx={{ display: 'list-item' }}>
						<ListItemText primary="그 사람이 그리워질 때 다시 찾을 장소를 만들 수 있습니다" />
					</ListItem>
					<ListItem sx={{ display: 'list-item' }}>
						<ListItemText primary="다른 가족들, 친구들, 지인들에게 메시지를 남길 수 있습니다" />
					</ListItem>
				</List>
			</div>
			<Paper elevation={4} sx={{ mt: 5, p: { xs: 4, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
				<Typography sx={{
					fontSize: {
						xs: '1.3rem',
						sm: '1.3rem',
						md: '1.3rem'
					},
					fontWeight: "bold"
				}}>
					영원한 기념관 건립
				</Typography>
				<Typography sx={{
					fontSize: {
						xs: '1.1rem',
						sm: '1.1rem',
						md: '1.1rem'
					},
					fontWeight: "bold"
				}}>
					50,000원 <del>100,000원</del>
				</Typography>
				<List sx={{ listStyleType: 'disc' }}>
					<ListItem sx={{ display: 'list-item', mb: -2 }}>
						<ListItemText primary={<Typography sx={{ marginLeft: "-1rem", fontSize: { xs: '.9rem', sm: '1rem', md: '1rem' } }}>입금처 : 기업 11118628601014 민준우</Typography>} />
					</ListItem>
					<ListItem sx={{ display: 'list-item', mb: -2 }}>
						<ListItemText primary={<Typography sx={{ marginLeft: "-1rem", fontSize: { xs: '.9rem', sm: '1rem', md: '1rem' } }}>입금하신 후 : </Typography>} />
						<List sx={{ listStyleType: 'circle', margin: 0, padding: 0 }}>
							<ListItem sx={{ display: 'list-item', mt: -2 }}>
								<ListItemText primary={<Typography sx={{ marginLeft: "-1rem", marginRight: "-3rem", fontSize: { xs: '.9rem', sm: '1rem', md: '1rem' } }}>010-9658-5329 으로 기념인 이름(성함), 입금하신 계좌주 명을 보내주세요</Typography>} />
							</ListItem>
						</List>
					</ListItem>
				</List>
			</Paper>
		</Container>
	);
}
