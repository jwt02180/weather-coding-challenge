import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { ForecastInfo } from '@/app/lib/app-definitions';
import { getForecast, validateZip } from '@/app/lib/weather-api';
import FiveDayForecast from '@/app/ui/forecast/five-day-forecast';

type PageProps = {
	params: Promise<{ zip?: string[] }>;
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
