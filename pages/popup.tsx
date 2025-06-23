import Popup from '../components/Popup';
import { getSession } from 'next-auth/react';
import {GetServerSideProps} from "next";

export default function popup() {
    return (
        <div>
            <Popup />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }
    return { props: {} };
}