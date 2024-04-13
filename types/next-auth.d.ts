import NextAuth, { DefaultSession , User } from 'next-auth';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken: string|null;
    }
}