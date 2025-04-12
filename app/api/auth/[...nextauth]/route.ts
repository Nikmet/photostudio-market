import NextAuth, { AuthOptions } from "next-auth";
import YandexProvider, { YandexProfile } from "next-auth/providers/yandex";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";
import { createUid } from "@/lib/uid";
import { compare, hash } from "bcrypt";

export const authOptions: AuthOptions = {
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID!,
            clientSecret: process.env.YANDEX_CLIENT_SECRET!,
            async profile(profile: YandexProfile) {
                return {
                    id: profile.id,
                    name: profile.real_name || profile.login,
                    email: profile.default_email,
                    image: profile.default_avatar_id
                        ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
                        : null,
                    phone: profile.default_phone?.number || "",
                    role: "USER" as UserRole
                };
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone", type: "tel" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.phone || !credentials?.password) {
                        throw new Error("Телефон и пароль обязательны");
                    }

                    const user = await prisma.user.findFirst({
                        where: { phone: credentials.phone }
                    });

                    if (!user) {
                        throw new Error("Пользователь не найден");
                    }

                    //compare
                    const isPasswordValid = compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Неверный пароль");
                    }

                    return {
                        id: user.id,
                        photo: user.photo,
                        email: user.email,
                        phone: user.phone,
                        name: user.fullName,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Authorize error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token }: { token: JWT }) {
            const findUser = await prisma.user.findFirst({
                where: {
                    email: token.email as string
                }
            });

            if (findUser) {
                token.id = findUser.id;
                token.phone = findUser.phone;
                token.photo = findUser.photo;
                token.email = findUser.email;
                token.name = findUser.fullName;
                token.role = findUser.role;
            }

            console.log("Token after findUser:", token);

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.phone = token.phone as string;
                session.user.photo = token.photo as string;
            }
            console.log("Session after findUser:", session);

            return session;
        },
        async signIn({ user, account, profile }) {
            try {
                console.log("Начало обработки signIn callback", {
                    provider: account?.provider,
                    user,
                    account,
                    profile
                });

                if (account?.provider === "credentials") {
                    return true;
                }

                // Проверка обязательных полей
                if (!user.email) {
                    user.email = `${user.id}@yandex.ru`; // Fallback email
                }

                if (!user.id) {
                    console.error("Yandex не предоставил ID пользователя");
                    return false;
                }

                // Поиск существующего пользователя
                const existingUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            {
                                provider: account?.provider,
                                providerId: account?.providerAccountId
                            },
                            { email: user.email }
                        ]
                    }
                });

                console.log(user.phone);

                user.phone = user.phone || existingUser?.phone;
                user.image = user.image || existingUser?.photo;

                if (existingUser) {
                    console.log("Найден существующий пользователь:", existingUser.id);
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            provider: account?.provider,
                            providerId: account?.providerAccountId,
                            photo: user.image || existingUser.photo,
                            verified: new Date()
                        }
                    });
                    return true;
                }

                console.log("Создание нового пользователя...");

                // Генерация уникального номера для id
                const lastId = await prisma.user.findFirst({
                    orderBy: { id: "desc" },
                    select: { id: true }
                });

                const newUserId = createUid("КЛ", (Number(lastId?.id.split("-")[1]) + 1).toString() || "1");
                const hashedPassword = await hash(user.id, 10);

                console.log({
                    id: newUserId,
                    email: user.email!,
                    phone: user.phone || "",
                    fullName: user.name || "Пользователь",
                    role: "USER",
                    provider: account?.provider,
                    providerId: account?.providerAccountId,
                    password: hashedPassword,
                    photo: user.image || "",
                    verified: new Date()
                });

                await prisma.user.create({
                    data: {
                        id: newUserId,
                        email: user.email!,
                        phone: user.phone || "",
                        fullName: user.name || "Пользователь",
                        role: "USER",
                        provider: account?.provider,
                        providerId: account?.providerAccountId,
                        password: hashedPassword,
                        photo: user.image || "",
                        verified: new Date()
                    }
                });

                console.log("Пользователь успешно создан:", newUserId);
                return true;
            } catch (error) {
                console.error("Ошибка в signIn callback:", error);
                return false;
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
        newUser: "/register"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// createUid("КЛ", idNumber.toString()),
