import type { NextConfig } from "next";

const weatherIcons = new URL(process.env.OPENWEATHER_ICON_BASE_URL);

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: weatherIcons.hostname,
			port: '',
			pathname: `${weatherIcons.pathname}**`
		}],
	}
};

export default nextConfig;
