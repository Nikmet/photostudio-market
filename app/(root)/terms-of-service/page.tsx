import { Button } from "@/components/ui";
import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">Условия использования</h1>
                <p className="text-gray-600 mb-6">Последнее обновление: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
                    <p className="text-gray-700">
                        Настоящие Условия использования регулируют порядок доступа и использования нашего сервиса.
                        Используя наш сайт, вы соглашаетесь соблюдать данные условия.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. Учетные записи</h2>
                    <p className="text-gray-700">
                        При создании учетной записи вы обязаны предоставить точную и полную информацию. Вы несете
                        ответственность за сохранность своих учетных данных.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. Интеллектуальная собственность</h2>
                    <p className="text-gray-700">
                        Все материалы, размещенные на сайте, включая тексты, изображения, логотипы, являются нашей
                        собственностью или собственностью наших лицензиаров и защищены законами об авторском праве.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. Ограничения</h2>
                    <p className="text-gray-700 mb-2">Вам запрещается:</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Использовать сайт в незаконных целях</li>
                        <li>Нарушать работу сайта или пытаться получить несанкционированный доступ</li>
                        <li>Собирать данные других пользователей без их согласия</li>
                        <li>Размещать вредоносный код или спам</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">5. Изменения условий</h2>
                    <p className="text-gray-700">
                        Мы оставляем за собой право изменять данные Условия в любое время. Продолжение использования
                        сервиса после внесения изменений означает ваше согласие с новыми условиями.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">6. Прекращение доступа</h2>
                    <p className="text-gray-700">
                        Мы можем приостановить или прекратить ваш доступ к сервису в случае нарушения вами данных
                        Условий без предварительного уведомления.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">7. Ограничение ответственности</h2>
                    <p className="text-gray-700">
                        Мы не несем ответственности за любые косвенные, случайные, особые убытки, возникшие в результате
                        использования или невозможности использования нашего сервиса.
                    </p>
                </section>

                <div className="pt-6">
                    <Link href="/register">
                        <Button variant="outline">Вернуться к регистрации</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
