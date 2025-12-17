import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="description" content="Daily cross-border trade intelligence with currency markets, export commodities, and global trade indicators" />
                <meta name="author" content="Trade Intelligence Dashboard" />

                {/* Open Graph */}
                <meta property="og:title" content="Trade Morning Brew - Cross-Border Trade Intelligence" />
                <meta property="og:description" content="Daily cross-border trade intelligence with currency markets, export commodities, and global trade indicators" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@eximpe" />
                <meta name="twitter:image" content="" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
