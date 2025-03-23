import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {encrypt} from "@/utils/cryptUtil";

interface CustomUser {
	id: string;
	access_token: string;
	refresh_token: string;
	is_purchase_request: boolean;
}

export default NextAuth({
	secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				user_id: { label: "ID", type: "text", placeholder: "ID"},
				user_password: { label: "Password", type: "password"},
			},
			authorize: async (credentials): Promise<CustomUser | null> => {
				if (!credentials) {
					return null;
				}
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						user_id: credentials.user_id,
						user_password: credentials.user_password,
					}),
				});

				const user: CustomUser = await res.json();

				if (res.ok && user.access_token) {
					return {
						id: encrypt(user.id.toString()), // 임시 ID 값
						access_token: user.access_token,
						refresh_token: user.refresh_token,
						is_purchase_request: user.is_purchase_request, // API 응답에서 받아온 값
					};
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			// 로그인 직후 user 객체가 존재하면 token에 값을 추가
			if (user) {
				token.accessToken = (user as CustomUser).access_token;
				token.is_purchase_request = (user as CustomUser).is_purchase_request;
				token.user_id = (user as CustomUser).id;
			}
			return token;
		},
		async session({ session, token }) {
			// session 객체에 token의 값을 추가
			session.accessToken = `${token.accessToken}`;
			session.is_purchase_request = token.is_purchase_request ?? false;
			session.user_id = token.user_id;
			return session;
		},
	},
	pages: {
		signOut: '/', // 로그아웃 후 리디렉션할 URL 설정
	},
});
