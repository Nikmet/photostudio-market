import Link from "next/link";

export default async function SuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Заказ успешно создан</h1>
            <p className="text-lg mb-4">Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время.</p>
            <Link href="/" className="text-blue-500 hover:underline">
                Вернуться на главную
            </Link>
        </div>
    );
}
