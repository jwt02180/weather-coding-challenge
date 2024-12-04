import { getCoordinatesFromZip, getForecastByCoordinates } from '@/app/lib/weather-api';
import { Card, CardContent, CardHeader } from '@mui/material';

type PageProps = {
	params: Promise<{ zip?: string[] }>;
};

export default async function Page({ params }: PageProps) {
	const { zip } = await params;
	const zipCode = zip && zip[0];
	
	console.log(zipCode);

	if (zipCode) {
		const { lat, lon } = await getCoordinatesFromZip(zipCode);
		console.log(lat, lon);

		const result = await getForecastByCoordinates({ lat, lon });
		console.log(result);
	}
	
	return (
		<Card variant="outlined">
			<CardHeader title="5-day Forecast" />
			<CardContent>
				<div>Forecast details here</div>
			</CardContent>
		</Card>
	);
};
