import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Basic from "../components/form/Basic";
import Birth from "../components/form/Birth";
import Preview from "../components/form/Preview";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

const steps = ['기본 정보 입력', '생애 입력', '건립한 기념관 보기'];

function getStepContent(step: number, router: any, basicInfo: any, setBasicInfo: any, content: any, setContent: any, memorialId: any) {
	switch (step) {
		case -1:
			router.push('/');
			return null;
		case 0:
			return <Basic basicInfo={basicInfo} setBasicInfo={setBasicInfo} />;
		case 1:
			return <Birth content={content} setContent={setContent} />;
		case 2:
			return <Preview memorialId={memorialId} basicInfo={basicInfo} content={content}/>;
		default:
			throw new Error('Unknown step');
	}
}

export default function Form() {
	const { data: session } = useSession();
	const router = useRouter();
	const [activeStep, setActiveStep] = useState(0);
	const [basicInfo, setBasicInfo] = useState({
		user_name: '',
		birth_start: '',
		birth_end: '',
		profile: '',
		bgm: ''
	});
	const [content, setContent] = useState("");
	const [memorialId, setMemorialId] = useState("");
	const dataFetchedRef = useRef(false);

	useEffect(() => {
		const fetchView = async () => {
			if (session && !dataFetchedRef.current) {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memorial/view`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${session.accessToken}`
					},
				});
				if (response.ok) {
					const result = await response.json();
					if (result.result === 'success' && result.data) {
						const data = result.data;
						const updatedBasicInfo = {
							birth_start: data.birth_start,
							birth_end: data.birth_end,
							user_name: data.name,
							profile: data.profile_attachment_id ? `${process.env.NEXT_PUBLIC_IMAGE}${data.attachment_profile_image.file_path}${data.attachment_profile_image.file_name}` : '',
							bgm: data.bgm_attachment_id ? `${process.env.NEXT_PUBLIC_IMAGE}${data.attachment_bgm.file_path}${data.attachment_bgm.file_name}` : ''
						};
						setBasicInfo(updatedBasicInfo);
						setContent(data.career_contents);
						setMemorialId(data.id);
						dataFetchedRef.current = true;
					}
				}
			}
		}
		fetchView();
	}, [session]);

	const isFile = (value: any): value is File => {
		return value instanceof File;
	};

	const handleNext = async () => {
		if (activeStep === 0) {
			if (!basicInfo.user_name || !basicInfo.birth_start || !basicInfo.profile) {
				alert("모든 정보를 입력해 주세요.");
				return;
			}
			if (memorialId) {
				await handleSubmit();
			}
			setActiveStep(1);
		} else if (activeStep === 1) {
			if (!content) {
				alert("모든 정보를 입력해 주세요.");
				return;
			}
			if (memorialId) {
				await handleSubmit();
			}
			setActiveStep(2);
		}
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const handleStepClick = async (step: number) => {
		if (step < activeStep) {
			setActiveStep(step);
		} else {
			if (memorialId) {
				await handleSubmit();
			}
			setActiveStep(step);
		}
	};

	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append('user_name', basicInfo.user_name);
		formData.append('birth_start', basicInfo.birth_start ? basicInfo.birth_start : dayjs().format('YYYY-MM-DD'));
		if (basicInfo.birth_end) {
			formData.append('birth_end', basicInfo.birth_end);
		}
		if (basicInfo.profile && isFile(basicInfo.profile)) {
			formData.append('profile', basicInfo.profile);
		}
		if (basicInfo.bgm && isFile(basicInfo.bgm)) {
			formData.append('bgm', basicInfo.bgm);
		}
		formData.append('career', content);

		const url = `${process.env.NEXT_PUBLIC_API_URL}/api/memorial/${memorialId}/edit`

		try {
			if (session) {
				const response = await fetch(url, {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${session.accessToken}`
					},
					body: formData,
				});
				const result = await response.json();
				if (!response.ok || result.result === 'fail') {
					const errorMessage = result.message ?
						(Array.isArray(result.message) ? result.message.join(', ') : result.message)
						: 'ERROR!!';
					alert(`ERROR: ${errorMessage}`);
				} else {
					if (result.data) {
						setMemorialId(result.data.id);
					}
				}
			} else {
				alert('로그인 후 이용해주세요.');
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(`에러 발생: ${error.message}`);
			} else {
				alert('에러 발생');
			}
		}
	};

	return (
		<>
			<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
					<Typography component="h1" variant="h4" align="center">
						인생 기념관 만들기
					</Typography>
					<Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
						{steps.map((label, index) => (
							<Step key={label} onClick={() => handleStepClick(index)} completed={false}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					<>
						{getStepContent(activeStep, router, basicInfo, setBasicInfo, content, setContent, memorialId)}
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
								뒤로
							</Button>
							{activeStep < (steps.length - 1) &&
								<Button
									onClick={handleNext}
									sx={{ mt: 3, ml: 1 }}
									color="inherit"
								>
									다음
								</Button>
							}
						</Box>
					</>
				</Paper>
			</Container>
		</>
	)
}
