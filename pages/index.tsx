import Main from '../components/Main';
import {GetServerSideProps} from "next";
import {MainProps, MemorialCard} from "@/types/main";

export default function main(props: MainProps) {
  return (
      <div>
        <Main {...props} />
      </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/memorial/index`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error fetching data`);
            return { notFound: true };
        }

        const result = await response.json();
        if (result.result !== 'success') {
            console.error(`Error: `, result.message);
            return { notFound: true };
        }

        const memorialCards: MemorialCard[] = result.data.map((item: any) => ({
            id: item.id,
            user_name: item.user_name,
            writer_name: item.writer_name,
            attachment_profile_image: item.attachment_profile_image,
        }));

        return {
            props: { memorialCards },
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { notFound: true };
    }
};