import Detail from '../../components/Detail';
import { GetServerSideProps } from "next";
import { ALLProps } from "@/components/detail/interfaces";

async function fetchData(url: string, errorContext: string) {
	const response = await fetch(url);

	if (!response.ok) {
		const errorResult = await response.json();
		console.error(`${errorContext} - API Response Error:`, errorResult);
		throw new Error('Failed to fetch data.');
	}

	const result = await response.json();

	if (result.result !== 'success') {
		console.error(`${errorContext} - API Error Message:`, result.message);
		throw new Error('API response was not successful.');
	}

	return result.data;
}

export default function DetailPage(props: ALLProps) {
	return <Detail {...props} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		if (!context.params) {
			throw new Error("Params are missing");
		}

		const memorialId = Number(context.params.memorialId);

		if (isNaN(memorialId)) {
			throw new Error("Invalid memorialId");
		}

		const baseUrl = process.env.NEXT_PUBLIC_API_URL;
		if (!baseUrl) {
			throw new Error("API URL is missing");
		}

		const memorialUrl = `${baseUrl}/api/memorial/${memorialId}/detail`;
		const commentUrl = `${baseUrl}/api/memorial/${memorialId}/comments`;
		const storyUrl = `${baseUrl}/api/memorial/${memorialId}/stories`;

		const detail = await fetchData(memorialUrl, 'Memorial Detail');
		const visitorMessages = await fetchData(commentUrl, 'Visitor Messages');
		const memories = await fetchData(storyUrl, 'Stories');

		const formattedDetail = {
			id: detail.id,
			user_name: detail.name,
			birth_start: detail.birth_start,
			birth_end: detail.birth_end,
			career_contents: detail.career_contents,
			is_open: detail.is_open,
			profile_attachment_id: detail.profile_attachment_id,
			bgm_attachment_id: detail.bgm_attachment_id,
			created_at: detail.created_at,
			updated_at: detail.updated_at,
			attachment_profile_image: detail.attachment_profile_image,
			attachment_bgm: detail.attachment_bgm,
		};

		return {
			props: {
				visitorMessages,
				memories,
				detail: formattedDetail,
				memorialId,
			}
		};
	} catch (error) {
		console.error("Error fetching data:", error);
		return { notFound: true };
	}
};
