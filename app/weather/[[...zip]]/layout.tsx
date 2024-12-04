import { notFound } from 'next/navigation';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import ZipSearch from '@/app/ui/zip/search';

type LayoutProps = {
	params: Promise<{ zip?: string[] }>;
	children: React.ReactNode;
};

export default async function Layout({ params, children}: LayoutProps) {
	const { zip } = await params;
	const zipCode = zip && zip[0];
	
	if (zip && zip.length > 1) {
		// Thought it'd be nice to support _no_ zip in the URL, so this route is configured as an "optional catch-all"
		// Which means we need to handle scenarios for other URLS, like "weather/12345/some/other/path" (expected behavior, show a 404)
		// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#optional-catch-all-segments
		notFound();
	}
	
	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">Weather App</Typography>
				</Toolbar>
				<Toolbar>
					<ZipSearch zip={zipCode} />
				</Toolbar>
			</AppBar>
			<Container maxWidth="sm">
				<Box sx={{ marginTop: 4 }}>
					{children}
				</Box>
			</Container>
		</>
	);
};