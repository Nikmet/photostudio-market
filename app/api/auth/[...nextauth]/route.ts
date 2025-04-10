import NextAuth, { Account, User, Session } from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

export interface ExtendedUser extends User {
    phone?: string;
}

export interface ExtendedSession extends Session {
    user: {
        id: string;
        phone?: string;
        yandexProfile?: any;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export const authOptions = {
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!,
            async profile(profile: any) {
                return {
                    id: profile.id,
                    name: profile.real_name || profile.login,
                    email: profile.default_email,
                    image: profile.default_avatar_id
                        ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
                        : null,
                    phone: profile.default_phone?.number
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: ExtendedUser; account?: Account | null }) {
            if (user) {
                token.id = user.id;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT; user: AdapterUser }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    phone: token.phone as string
                }
            } as ExtendedSession;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
