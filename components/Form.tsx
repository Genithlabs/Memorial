import { useState } from 'react';
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


const steps = ['기본 정보 입력', '생애 입력', '건립한 기념관 보기'];

function getStepContent(step: number, router:any) {
	switch (step) {
		case -1:
			router.push('/');
			return null; // or you can return an empty fragment <> </>
		case 0:
			return <Basic />;
		case 1:
			return <Birth />;
		case 2:
			return <Preview />;
		default:
			throw new Error('Unknown step');
	}
}

export default function Form() {
	const router = useRouter();
	const [activeStep, setActiveStep] = useState(0);

	const handleNext = () => {
		setActiveStep(activeStep + 1);
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	return (
		<>
			<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
					<Typography component="h1" variant="h4" align="center">
						인생 기념관 만들기
					</Typography>
					<Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5,  }}>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					<>
						{getStepContent(activeStep, router)}
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
								뒤로
							</Button>
							{activeStep < (steps.length-1) &&
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