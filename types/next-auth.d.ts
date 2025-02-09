import NextAuth, { DefaultSession , User } from 'next-auth';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken: string|null;
        is_purchase_request: boolean;
        user_id: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string | null;
        is_purchase_request?: boolean;
        user_id: string;
    }
}