import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			// TODO: point this at wherever turf/profile photos actually get
			// hosted (S3, Cloudinary, etc.) once that's decided.
			{ protocol: "https", hostname: "your-image-host.example.com" },
		],
	},
};

export default nextConfig;
