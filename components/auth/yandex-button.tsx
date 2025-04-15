"use client";

import { cn } from "@/lib";
import { Button } from "../ui";
import { signIn } from "next-auth/react";

export interface IYandexButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export const YandexButton = ({ className }: IYandexButtonProps): React.JSX.Element => {
    return (
        <Button
            type="button"
            onClick={() => signIn("yandex", { callbackUrl: "/profile" })}
            className={cn(className, "bg-slate-300 hover:bg-slate-400 transition-all duration-300")}
        >
            <div className="flex justify-center items-center gap-2 p-5">
                <img src="/yandex-logo.svg" alt="Yandex" className="w-6 h-6" />
                <span className="text-slate-900">Войти с помощью Яндекс ID</span>
            </div>
        </Button>
    );
};
