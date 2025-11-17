/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'screensavy.com'
      },
      {
        protocol: 'https',
        hostname: 'www.googletagmanager.com'
      }
    ]
  }
};

export default nextConfig;
