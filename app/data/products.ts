
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    content?: string; // Content to be delivered via email
}

export const products: Product[] = [
    {
        id: 1,
        name: "Discord Auto Mod Bot",
        description:
            "Bot moderasi otomatis untuk server Discord Anda. Blokir spam, kata kasar, dan link mencurigakan!",
        price: 75000,
        content: "Link Download: https://example.com/bot-v1.zip\nLicense Key: XXX-YYY-ZZZ"
    },
    {
        id: 2,
        name: "Script Auto Post",
        description: "Auto post teks discord bot.",
        price: 75000,
        content: "Script: https://github.com/example/script"
    },
    {
        id: 3,
        name: "Custom Discord Bot",
        description:
            "Bot Discord kustom sesuai kebutuhan server Anda. Fitur unlimited!",
        price: 15000,
        content: "Please contact admin manually for custom requirements discussion."
    },
    {
        id: 4,
        name: "Redfinger Redeem Code 7D",
        description: "Redeem Code Redfinger",
        price: 19500,
        content: "Code: RED-7D-XXXX-YYYY"
    },
    {
        id: 5,
        name: "Redfinger Redeem Code 30D",
        description: "Redeem Code Redfinger",
        price: 59500,
        content: "Code: RED-30D-AAAA-BBBB"
    },
    {
        id: 6,
        name: "Auto Reply Discord Bot",
        description:
            "Auto reply ketika ada yang dm, ada yang tag, dan ada yang reply pesan mu.",
        price: 15000,
        content: "Download: https://example.com/autoreply.zip"
    },
    {
        id: 7,
        name: "Vouch & Testimoni Discord Bot",
        description: "Bot discord untuk Vouch & Testimoni",
        price: 20000,
        content: "Setup Guide: https://docs.example.com/vouch-bot"
    },
];
