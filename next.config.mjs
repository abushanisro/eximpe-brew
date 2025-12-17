/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Explicitly disable App Router - using Pages Router only
    experimental: {
        appDir: false
    }
};

export default nextConfig;
