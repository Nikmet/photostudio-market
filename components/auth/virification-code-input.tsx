"use client";

import { useState, useRef } from "react";
import { Button } from "../ui";
import { Check } from "lucide-react";

export const VerificationCodeInput = ({ onComplete }: { onComplete: (code: string) => void }) => {
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (/^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Auto focus next input, но не отправляем автоматически
            if (value && index < 5) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newCode = [...code];
            for (let i = 0; i < pastedData.length; i++) {
                newCode[i] = pastedData[i];
            }
            setCode(newCode);
            if (pastedData.length === 6) {
                inputsRef.current[5]?.focus(); // Фокусируем последнее поле
            } else {
                inputsRef.current[pastedData.length]?.focus();
            }
        }
    };

    const handleSubmit = () => {
        if (code.every(digit => digit)) {
            onComplete(code.join(""));
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el: HTMLInputElement | null) => {
                            inputsRef.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-8 h-10 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                ))}
            </div>

            <Button
                type="button"
                onClick={handleSubmit}
                disabled={code.some(digit => !digit)}
                className="w-full flex items-center justify-center gap-2 bg-green-200 dark:bg-green-800 text-green-900 hover:bg-green-300"
            >
                <Check className="w-4 h-4" />
                Подтвердить
            </Button>
        </div>
    );
};
