import Typography from "@mui/material/Typography";
import Image from "next/image";
import Container from "@mui/material/Container";
import TabsCustomized from './detail/TabsCustomized';
import {ALLProps} from './detail/interfaces';


const getYearFromDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	return date.getFullYear().toString();
}

export default function Detail({ visitorMessages, memories, detail, memorialId }: ALLProps) {
	// Extract only the year from birth_start and birth_end
	const birthStartYear = getYearFromDate(detail.birth_start);
	const birthEndYear = getYearFromDate(detail.birth_end);
	return (
		<>
			<main>
				<div style={{ position: 'relative', width: '100%', height: '20rem'}}>
					<Image src="/cloud2.png" alt="background image" fill sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw" style={{ objectFit: 'cover' }}/>
				</div>
				<Container
					sx={{
						position: 'relative',
						width: {
							xs: '7rem',
							sm: '10rem',
							md: '13rem',
						},
						height: {
							xs: '7rem',
							sm: '10rem',
							md: '13rem',
						},
						mt: {
							xs: '-3rem',
							sm: '-5rem',
							md: '-7rem',
						},
						zIndex: 1,
						borderRadius: ".5rem",
						overflow: "auto",
						boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
				}}>
					{detail?.attachment_profile_image && (
						<Image
							src={`${process.env.NEXT_PUBLIC_IMAGE}${detail.attachment_profile_image.file_path}${detail.attachment_profile_image.file_name}`}
							alt="profile image"
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							style={{ objectFit: 'cover' }}
						/>
					)}
				</Container>
				<Container
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						my:  {
							xs: '1.5rem',
							sm: '2rem',
							md: '2.5rem'
						},
					}}>
					<Typography
						sx={{
							fontSize: {
								xs: '1.7rem',
								sm: '2.5rem',
								md: '3.5rem'
							},
							fontWeight: 'bold',
						}}
					>
						{detail.user_name}
					</Typography>
					<Typography
						sx={{
							fontSize: {
								xs: '1.2rem',
								sm: '1.5rem',
								md: '2.5rem'
							},
							fontWeight: '400',
						}}
					>
						{birthStartYear} - {birthEndYear}
					</Typography>
				</Container>
				<Container sx={{ mt: {xs:"5rem", sm: "7.5rem", md: "10rem"} }}>
					<TabsCustomized visitorMessages={visitorMessages} memories={memories} detail={detail} memorialId={memorialId}/>
				</Container>
			</main>
		</>
	)
}