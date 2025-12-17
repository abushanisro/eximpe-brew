import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Trade Morning Brew - Cross-Border Trade Intelligence",
    description: "Daily cross-border trade intelligence with currency markets, export commodities, and global trade indicators",
    authors: [{ name: "Trade Intelligence Dashboard" }],
    openGraph: {
        title: "Trade Morning Brew - Cross-Border Trade Intelligence",
        description: "Daily cross-border trade intelligence with currency markets, export commodities, and global trade indicators",
        type: "website",
        images: [""],
    },
    twitter: {
        card: "summary_large_image",
        site: "@Lovable",
        images: [""],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
