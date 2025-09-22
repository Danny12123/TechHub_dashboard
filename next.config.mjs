/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true,
    domains: [
      "media.istockphoto.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "https://static.independent.co.uk/"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.independent.co.uk"
      }
    ]
  }
};

export default nextConfig
