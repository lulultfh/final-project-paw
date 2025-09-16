/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://10.69.2.146:3001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
