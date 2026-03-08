/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
     typescript: {
    ignoreBuildErrors: true,
  },
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

