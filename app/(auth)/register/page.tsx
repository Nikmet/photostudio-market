import { RegisterForm, RegisterFormData } from "@/components/register-form";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { redirect } from "next/navigation";

export default function RegisterPage() {
    const onSubmit = async (data: RegisterFormData) => {
        "use server";

        const lastId = await prisma.user.findFirst({
            orderBy: { id: "desc" },
            select: { id: true }
        });

        const newUserId = createUid("КЛ", (Number(lastId?.id.split("-")[1]) + 1).toString() || "1");
        const hashedPassword = await hash(data.password, 10);

        await prisma.user.create({
            data: {
                id: newUserId,
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                password: hashedPassword,
                role: "USER" as UserRole,
                photo: "/avatar.png"
            }
        });

        redirect("/login");
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <RegisterForm onSubmit={onSubmit} />
            </div>
        </div>
    );
}
