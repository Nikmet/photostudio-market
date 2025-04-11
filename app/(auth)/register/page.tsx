import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <RegisterForm />
            </div>
        </div>
    );
}
