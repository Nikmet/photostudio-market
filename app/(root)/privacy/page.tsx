export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Политика конфиденциальности</h1>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">1. Использование cookies</h2>
                <p className="mb-2">
                    Наш сайт использует файлы cookie для обеспечения корректной работы и улучшения пользовательского
                    опыта.
                </p>
                <p>
                    Cookie — это небольшие текстовые файлы, которые хранятся на вашем устройстве при посещении
                    веб-сайтов.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">2. Какие cookie мы используем</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Необходимые для работы сайта</li>
                    <li>Аналитические (Google Analytics)</li>
                    <li>Функциональные (настройки темы, языка)</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3">3. Управление cookie</h2>
                <p>
                    Вы можете отключить cookies в настройках вашего браузера, но это может повлиять на функциональность
                    сайта.
                </p>
            </section>
        </div>
    );
}
