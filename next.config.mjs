/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.181.233.235:3001', 'localhost:3001'],
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb'
    }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  }
};

export default nextConfig;
