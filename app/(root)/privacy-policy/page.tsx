import { Button } from "@/components/ui";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">Политика конфиденциальности</h1>
                <p className="text-gray-600 mb-6">Последнее обновление: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
                    <p className="text-gray-700">
                        Настоящая Политика конфиденциальности регулирует порядок сбора, использования, хранения и
                        раскрытия информации, полученной от пользователей нашего сайта. Используя наш сервис, вы
                        соглашаетесь с условиями данной политики.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. Собираемая информация</h2>
                    <p className="text-gray-700 mb-2">Мы можем собирать следующие виды информации:</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Персональные данные (имя, email, телефон) при регистрации</li>
                        <li>Информация о вашем устройстве и подключении к интернету</li>
                        <li>Данные о вашем взаимодействии с нашим сервисом</li>
                        <li>Платежная информация при совершении покупок</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. Использование информации</h2>
                    <p className="text-gray-700">
                        Собранная информация используется для предоставления и улучшения наших услуг, обработки заказов,
                        коммуникации с пользователями и обеспечения безопасности.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. Защита данных</h2>
                    <p className="text-gray-700">
                        Мы применяем различные меры безопасности для защиты ваших персональных данных, включая
                        шифрование и ограниченный доступ к информации.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">5. Изменения в политике</h2>
                    <p className="text-gray-700">
                        Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности.
                        Актуальная версия всегда будет доступна на этой странице.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">6. Контакты</h2>
                    <p className="text-gray-700">
                        Если у вас есть вопросы относительно нашей Политики конфиденциальности, пожалуйста, свяжитесь с
                        нами:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                        <li>Email: photo-privacy@photo.ru</li>
                        <li>Телефон: +7 (492) 256-78-33</li>
                    </ul>
                </section>

                <div className="pt-5">
                    <Link href="/register">
                        <Button variant="outline">Вернуться к регистрации</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
