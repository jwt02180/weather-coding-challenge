import type { Metadata } from 'next';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { roboto } from '@/app/fonts/Roboto';
import theme from '@/app/theme';

export const metadata: Metadata = {
	title: {
		template: '%s | 5-Day Forecast',
		default: 'Weather App',
	},
	description: "A weather application coding challenge",
	creator: 'Jameson Taylor',
	authors: [{ name: 'Jameson Taylor', url: 'https://www.linkedin.com/in/jameson-w-taylor/' }]
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang="en">
			<body className={`${roboto.variable}`}>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						{children}
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
};
