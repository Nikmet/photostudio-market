import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full sm:max-w-md rounded-lg bg-white dark:bg-gray-800 md:p-8 p-4 shadow-md flex flex-col gap-4 max-w-[350px]">
                <AuthForm />
            </div>
        </div>
    );
}
