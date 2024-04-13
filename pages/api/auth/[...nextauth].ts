import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

interface CustomUser {
	id: string;
	access_token: string;
	refresh_token: string;
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
						id: 'temp-id', // 임시 ID 값
						access_token: user.access_token,
						refresh_token: user.refresh_token,
					}
				} else {
					return null;
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = (user as CustomUser).access_token;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = `${token.accessToken}`;
			return session;
		}
	},
})