import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "Фотостудия-М",
    description:
        "Профессиональная печать, сувенирная продукция, полиграфические услуги с 1997 года. Собственное производство, современное оборудование, быстрые сроки исполнения.",
    keywords:
        "фотостудия, печать, сувениры, полиграфия, визитки, баннеры, кружки с печатью, футболки с принтом, рекламная продукция, Меленки, Меленковский, Владимир, Владимирская область, фото-услуги, документы, стенды, таблички",
    openGraph: {
        title: "Фотостудия-М - Профессиональная печать и сувенирная продукция",
        description: "Профессиональная печать, сувенирная продукция, полиграфические услуги с 1997 года.",
        images: ["/og-image.jpg"]
    }
};

export default function AboutPage() {
    const products = [
        {
            id: 1,
            name: "Кружка с печатью",
            description: "Керамическая кружка с качественной полноцветной печатью. Объем 330 мл.",
            price: 600,
            image: "/cup.png",
            category: "Сувениры"
        },
        {
            id: 2,
            name: "Футболка",
            description: "Хлопковая футболка с нанесением логотипа. Размеры от S до XXL.",
            price: 800,
            image: "/tshirt.png",
            category: "Сувениры"
        },
        {
            id: 3,
            name: "Визитки (100 шт.)",
            description: "Визитки на мелованной бумаге 300 г/м². Матовая или глянцевая ламинация.",
            price: 300,
            image: "/business_cards.png",
            category: "Реклама"
        },
        {
            id: 4,
            name: "Фоторамка",
            description: "Элегантная рамка для фотографий формата 10×15 или 15×20 см.",
            price: 300,
            image: "/frames.png",
            category: "Рамки"
        },
        {
            id: 5,
            name: "Банер",
            description:
                "Привлекайте внимание с нашими баннерами! Широкая печать на прочных материалах, устойчивых к ветру и дождю. Идеально для рекламных акций, мероприятий и outdoor-продвижения. Большой формат - максимальная заметность!",
            price: 1000,
            image: `/banner.png`,
            category: "Реклама"
        },
        {
            id: 6,
            name: "Адресный аншлаг",
            description:
                "Четкая навигация и презентабельный вид! Наши аншлаги из долговечных материалов с устойчивой к погодным условиям печатью. Подходит для офисов, магазинов и общественных мест. Сделайте вашу компанию легко узнаваемой!",
            price: 500,
            image: `/address_plaques.png`,
            category: "Реклама"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero секция */}
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                    <video autoPlay muted loop playsInline className="absolute w-full h-full object-cover">
                        <source src="/hero-background.mp4" type="video/mp4" />
                    </video>
                    <div className="container mx-auto px-4 text-center text-white relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Фотостудия-М</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Профессиональная печать и реклама с 1997 года
                        </p>
                        <button className="bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-5000 px-12 py-8 text-lg font-bold shadow-lg hover:shadow-xl rounded-md animate-pulse">
                            <Link href="/">Начать покупки сейчас!</Link>
                        </button>
                    </div>
                    <div className="absolute inset-0 bg-black/60"></div>
                </section>

                {/* О компании */}
                <section className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center mb-12">
                            <div className="w-3 h-8 bg-indigo-500 rounded-full mr-3"></div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                                Наша история
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                                    Более 20 лет на рынке полиграфии
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Начав с небольшой фотостудии в 1997 году, мы выросли в крупный производственный
                                    центр с современным оборудованием.
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Сегодня мы предлагаем полный цикл услуг - от дизайна до печати и постпечатной
                                    обработки.
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Наши клиенты - это более <b className="text-primary">50 000</b> клиентов по всей
                                    России, которые доверяют нам свои рекламные и корпоративные проекты.
                                </p>
                            </div>

                            <div className="relative h-96 rounded-2xl overflow-hidden">
                                <img
                                    src="https://www.kmkorma.ru/upload/iblock/075/0756699dbf5e5f0a5c238271b2e0c8e1.jpg"
                                    alt="Наше производство"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Наши товары */}
                <section className="pt-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center mb-8">
                            <div className="w-3 h-8 bg-indigo-500 rounded-full mr-3"></div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                                Популярные товары
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:border-blue-100 dark:hover:border-blue-900/50"
                                >
                                    <div className="h-[300px] md:h-[400px] xl:h-[500px] relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="mb-5">
                                            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4">
                                                {product.description}
                                            </p>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                От {product.price} ₽
                                            </p>
                                            <Link
                                                href="/"
                                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-2 px-4 text-sm transition-all duration-300 group/button shadow-md hover:shadow-blue-500/20"
                                            >
                                                <span className="font-medium">Подробнее</span>
                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-6">
                                <Link href="/">Смотреть все товары</Link>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Наши преимущества */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center mb-12">
                            <div className="w-3 h-8 bg-indigo-500 rounded-full mr-3"></div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                                Почему выбирают нас
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Современное оборудование",
                                    description: "Используем только профессиональные принтеры и материалы",
                                    icon: "🖨️"
                                },
                                {
                                    title: "Собственное производство",
                                    description: "Весь процесс от дизайна до упаковки под нашим контролем",
                                    icon: "🏭"
                                },
                                {
                                    title: "Индивидуальный подход",
                                    description: "Реализуем даже самые сложные и нестандартные заказы",
                                    icon: "🎨"
                                },
                                {
                                    title: "Быстрые сроки",
                                    description: "Срочные заказы выполняем за 1-2 дня без потери качества",
                                    icon: "⏱️"
                                },
                                {
                                    title: "Доступные цены",
                                    description: "Гибкая система скидок для постоянных клиентов",
                                    icon: "💰"
                                },
                                {
                                    title: "Гарантия качества",
                                    description: "Даем гарантию на всю продукцию до 2 лет",
                                    icon: "✅"
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Отзывы */}
                <section className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center mb-12">
                            <div className="w-3 h-8 bg-indigo-500 rounded-full mr-3"></div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                                Отзывы клиентов
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Анна К.",
                                    company: "ООО 'СтройТех'",
                                    text: "Заказывали таблички для офиса - сделали быстро, качественно, с учетом всех наших пожеланий. Буем обращаться еще!",
                                    rating: 5
                                },
                                {
                                    name: "Иван П.",
                                    company: "Кафе 'Уют'",
                                    text: "Печатаем у них меню уже 3 года. Всегда отличное качество печати, даже после многократного использования.",
                                    rating: 5
                                },
                                {
                                    name: "Елена С.",
                                    company: "Салон красоты 'Элегант'",
                                    text: "Сделали для нас визитки с тиснением - выглядит очень стильно и дорого. Клиенты сразу обращают внимание.",
                                    rating: 5
                                }
                            ].map((review, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-3xl ${
                                                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                                        &quot;{review.text}&quot;
                                    </p>
                                    <div className="font-medium text-gray-800 dark:text-white">{review.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{review.company}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA секция */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Готовы начать сотрудничество?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Перейдите в наш интернет-магазин, чтобы выбрать продукцию
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 px-12 py-6 text-lg">
                                <Link href="/" className="flex items-center justify-center">
                                    <span>Перейти в магазин</span>
                                    <ArrowRight className="w-10 h-10" />
                                </Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
