import { Card, CardContent, CardHeader, Skeleton } from '@mui/material';
import FiveDayForecastSkeleton from '@/app/ui/forecast/skeleton';

export default function Loading() {
	return (
		<Card variant="outlined">
			<CardHeader title="5-day Forecast" subheader={<Skeleton width={100} />} />
			<CardContent>
				<FiveDayForecastSkeleton />
			</CardContent>
		</Card>
	);
};