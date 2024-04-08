import Detail from '../../components/Detail';
import { GetServerSideProps } from "next";
import { fetchDetail, fetchMemories, fetchVisitorMessages } from "../api/detail";
import { ALLProps } from "@/components/detail/interfaces";
import { visitorMessages as mocks_visitorMessages, memories as mocks_memories, detail as mocks_detail } from "../../mocks/detail";

export default function DetailPage(props: ALLProps) {
	return <Detail {...props} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	try {
		if (!context.params) {
			throw new Error("Params are missing");
		}

		// userId를 number로 변환
		const userId = Number(context.params.userId);

		if (isNaN(userId)) {
			throw new Error("Invalid userId");
		}

		let data = [mocks_visitorMessages, mocks_memories, mocks_detail];

		const [visitorMessages, memories, detail] = data;

		return {
			props: {
				visitorMessages,
				memories,
				detail
			}
		};
	} catch (error) {
		console.error("Error fetching data in getServerSideProps:", error);
		return {
			notFound: true
		};
	}
}
