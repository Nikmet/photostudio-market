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
                    "Удобная керамическая кружка с ярким принтом. Идеальна для кофе или чая. Отличный подарок для клиентов и друзей.",
                price: 600,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/cup.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/cups`
            },
            {
                title: "Футболка",
                description:
                    "Качественная футболка с долговечной печатью. Подходит для мероприятий, промо и повседневной носки.",
                price: 800,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/tshirt.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/t_shirts`
            },
            {
                title: "Магнитик",
                description: "Яркий магнит на холодильник с фирменным дизайном. Недорогой, но запоминающийся сувенир.",
                price: 150,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/magnet.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/magnets`
            },
            {
                title: "Значки (50шт.)",
                description: "Компактный значок с прочным покрытием. Идеален для рюкзаков, одежды и мероприятий.",
                price: 150,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/badge.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/souvenirs/badges`
            },
            {
                title: "Печать",
                description:
                    "Удобные печати для документов. Легко крепится и не повреждает бумагу. Подходит для офисов и учебных заведений.",
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
                    "Элегантный аншлаг с адресом для фасада дома. Устойчив к погодным условиям. Практичное и стильное решение для вашего участка или здания.",
                price: 500,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/address_plaques.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/address_plaques`
            },
            {
                title: "Банер",
                description: "Прочный баннер для улицы и мероприятий. Большой формат и стойкость к погодным условиям.",
                price: 1000,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/banner.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/banners`
            },
            {
                title: "Визитки (100 шт.)",
                description:
                    "Качественные визитки с индивидуальным дизайном. Отличное первое впечатление о вашем бизнесе.",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/business_cards.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/business-cards`
            },
            {
                title: "Информационная вывеска",
                description: "Таблички для важной информации с долговечными материалами.",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/newsletters.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/newsletters`
            },
            {
                title: "Стенд",
                description: "Информационные и рекламные стенды, способные улучшить ваш информационный уголок",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/stands.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/stands`
            },
            {
                title: "Табличка",
                description: "Таблички из металла и пластика. Идеальны для обозначений и навигации в помещении.",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/table.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/tables`
            },
            {
                title: "Широкоформатная печать",
                description:
                    "Печать любых материалов формата больше A4 — постеры, плакаты и т. д. Яркие цвета, высокая детализация и стойкость к внешним условиям.",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/LFP.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/advertising/lfp`
            }
        ]
    },
    {
        category: "Рамки",
        products: [
            {
                title: "Фоторамка",
                description: "Фоторамки разных размеров и стилей. Идеальны для дома, офиса или подарка.",
                price: 300,
                imageUrl: `${process.env.NEXT_PUBLIC_URL}/frames.png`,
                link: `${process.env.NEXT_PUBLIC_URL}/frames/frames`
            }
        ]
    }
];
