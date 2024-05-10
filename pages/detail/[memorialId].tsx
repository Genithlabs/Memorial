import Detail from '../../components/Detail';
import { GetServerSideProps } from "next";
import {ALLProps, AttachmentBgm, AttachmentProfileImage} from "@/components/detail/interfaces";

export default function DetailPage(props: ALLProps) {
	return <Detail {...props} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		if (!context.params) {
			throw new Error("Params are missing");
		}

		// memorialId를 number로 변환
		const memorialId = Number(context.params.memorialId);

		if (isNaN(memorialId)) {
			throw new Error("Invalid memorialId");
		}

		// API 호출
		const url = `${process.env.NEXT_PUBLIC_API_URL}/api/memorial/${memorialId}/detail`;
		const response = await fetch(url);

		// API 응답 상태 확인
		if (response.ok) {
			const result = await response.json();

			// API 결과가 성공인 경우에만 데이터 설정
			if (result.result === 'success') {
				const data = result.data;

				const visitorMessages = data.visit_comments;
				const memories = data.story;
				const detail = {
					id: data.id,
					birth_start: data.birth_start,
					birth_end: data.birth_end,
					career_contents: data.career_contents,
					is_open: data.is_open,
					profile_attachment_id: data.profile_attachment_id,
					bgm_attachment_id: data.bgm_attachment_id,
					created_at: data.created_at,
					updated_at: data.updated_at,
					attachment_profile_image: data.attachment_profile_image,
					attachment_bgm: data.attachment_bgm,
				};

				return {
					props: {
						visitorMessages,
						memories,
						detail,
						memorialId,
					}
				};
			} else {
				console.error('API 오류 메시지:', result.message);
				return { notFound: true };
			}
		} else {
			const errorResult = await response.json();
			console.error('API 응답 오류:', errorResult);
			return { notFound: true };
		}
	} catch (error) {
		// 오류 처리
		console.error("데이터 가져오기 중 오류:", error);
		return { notFound: true };
	}
};
