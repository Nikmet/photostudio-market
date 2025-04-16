//TODO: Подумать как цены подставлять динамически
//TODO: Описания поменять

interface ICards {
    category: string;
    products: {
        title: string;
        description: string;
        price: number;
        imageUrl: string;
        link: string;
    }[];
}

export const CARDS: ICards[] = [
    {
        category: "Сувениры",
        products: [
            {
                title: "Кружка",
                description:
                    "Создайте уют с нашей стильной керамической кружкой! Яркий логотип, нанесенный методом качественной печати, не выцветает со временем. Удобная ручка и оптимальный объем (330 мл) делают её идеальной для утреннего кофе или вечернего чая. Отличный подарок для коллег, друзей и клиентов!",
                price: 600,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/cup.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/cups`
            },
            {
                title: "Футболка",
                description:
                    "Выбирайте комфорт и стиль! Наши футболки из мягкого, дышащего материала с яркой долговечной печатью. Универсальный дизайн подходит для повседневной носки, корпоративных мероприятий или промоакций. Доступны разные размеры и цвета - подчеркните индивидуальность!",
                price: 800,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/tshirt.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/t_shirts`
            },
            {
                title: "Магнитик",
                description:
                    "Миниатюрный, но запоминающийся сувенир! Наши магниты с яркой печатью украсят любой холодильник и напомнят о вашем бренде. Отличный недорогой подарок для клиентов, партнеров и туристов. Разнообразие дизайнов - выберите свой!",
                price: 150,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/magnet.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/magnets`
            },
            {
                title: "Значок",
                description:
                    "Стильный аксессуар для любого случая! Наши значки с четкой детализацией и прочным покрытием подходят для рюкзаков, сумок или одежды. Идеальный промо-продукт или сувенир для мероприятий. Маленький размер - большая выразительность!",
                price: 150,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/badge.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/badges`
            },
            {
                title: "Печать",
                description:
                    "Качественная печать на любой поверхности! Визитки, буклеты, открытки - мы создадим яркие и профессиональные материалы для вашего бизнеса. Быстро, четко, с гарантией отличного результата. Заявите о себе с лучшей стороны!",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/printing.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/printings`
            }
        ]
    },
    {
        category: "Реклама",
        products: [
            {
                title: "Адресный аншлаг",
                description:
                    "Четкая навигация и презентабельный вид! Наши аншлаги из долговечных материалов с устойчивой к погодным условиям печатью. Подходит для офисов, магазинов и общественных мест. Сделайте вашу компанию легко узнаваемой!",
                price: 500,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/address_plaques.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/address_plaques`
            },
            {
                title: "Банер",
                description:
                    "Привлекайте внимание с нашими баннерами! Широкая печать на прочных материалах, устойчивых к ветру и дождю. Идеально для рекламных акций, мероприятий и outdoor-продвижения. Большой формат - максимальная заметность!",
                price: 1000,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/banner.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/banners`
            },
            {
                title: "Визитки (100 шт.)",
                description:
                    "Ваше первое впечатление - в наших руках! Стильные, лаконичные или креативные визитки на качественной бумаге с различными вариантами отделки. Оставьте клиентам не просто контакты, а запоминающийся образ вашего бренда!",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/business_cards.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/business_cards`
            },
            {
                title: "Информационная табличка",
                description:
                    "Четкость и функциональность! Таблички с важной информацией, выполненые в строгом или современном дизайне. Подходят для офисов, магазинов и общественных пространств. Долговечные материалы - информация всегда на виду!",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/newsletters.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/newsletters`
            },
            {
                title: "Стенд",
                description:
                    "Организуйте пространство с нашими стендами! Удобные конструкции для информации, рекламы или навигации. Различные размеры и варианты дизайна под любой интерьер. Сделайте подачу информации удобной и эстетичной!",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/stands.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/stands`
            },
            {
                title: "Табличка",
                description:
                    "Элегантность и функциональность! Наши таблички из металла, пластика или акрила с четкой гравировкой или печатью. Подходят для номеров офисов, указателей и декора. Качественное исполнение - долгий срок службы!",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/table.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/tables`
            },
            {
                title: "Широкоформатная печать",
                description:
                    "Масштабная реклама с безупречным качеством! Печать на баннерах, плёнке, бумаге и других материалах для билбордов, стендов и промо-акций. Яркие цвета, стойкость к выцветанию - ваше сообщение увидит каждый!",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/LFP.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/LFP`
            }
        ]
    },
    {
        category: "Рамки",
        products: [
            {
                title: "Фоторамка",
                description:
                    "Добавьте стиля вашим воспоминаниям! Наши фоторамки из качественных материалов подчеркнут красоту фотографий, сертификатов или картин. Различные размеры и дизайны - для дома, офиса или в подарок. Оформляйте моменты с любовью!",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/frames.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/frames/frames`
            }
        ]
    }
];
