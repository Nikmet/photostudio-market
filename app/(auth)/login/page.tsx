import { AuthForm, AuthFormData } from "@/components/auth-form";
import { setAuthCookie } from "@/lib/set-auth-cookies";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default function LoginPage() {
    const onSubmit = async (data: AuthFormData) => {
        "use server";

        const admin = await prisma.user.findFirst({
            where: {
                role: "ADMIN",
                email: data.email,
                password: data.password
            }
        });

        if (!admin) {
            await setAuthCookie(false);
            return { error: "Неверный логин или пароль" }; // Возвращаем объект с ошибкой
        }

        await setAuthCookie(true);
        redirect("/");
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <h1 className="text-2xl mb-4">Авторизация</h1>
            <AuthForm onSubmit={onSubmit} />
        </div>
    );
}