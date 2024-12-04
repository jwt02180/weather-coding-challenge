import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { ForecastInfo } from '@/app/lib/app-definitions';
import { getForecast, validateZip } from '@/app/lib/weather-api';
import FiveDayForecast from '@/app/ui/forecast/five-day-forecast';

type PageProps = {
	params: Promise<{ zip?: string[] }>;
};

// Fetch requests should be automatically deduped here, so validateZip() in both the page/metadata is fine
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#returns
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zip } = await params;
  const zipCode = zip && zip[0];

  let title = '';
  if (zipCode) {
    const { data } = await validateZip(zipCode);
    title = data?.name || '';
  }
 
  return title.length > 0 ? { title } : {};
};

export default async function Page({ params }: PageProps) {
	const { zip } = await params;
	const zipCode = zip && zip[0];
	
	let zipName = '';
	let validationMessage = 'Please enter a zip';
	let forecastData: ForecastInfo[] = [];
	
	if (zipCode) {
		const { isValid, data: result, message } = await validateZip(zipCode);
		if (message) {
			validationMessage = message;
		}
		
		if (isValid && result) {
			const { locationName, data } = await getForecast(result);
			zipName = locationName;
			forecastData = data;
		}
	}
	
	return (
		<Card variant="outlined">
			<CardHeader
				title="5-day Forecast"
				subheader={
					<Typography color={zipName.length > 0 ? 'textSecondary' : 'warning'}>
						{zipName || validationMessage}
					</Typography>
				} />
			<CardContent>
				<FiveDayForecast data={forecastData} />
			</CardContent>
		</Card>
	);
};
