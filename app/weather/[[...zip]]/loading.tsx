import { Card, CardContent, CardHeader, Skeleton } from '@mui/material';

export default function Loading() {
	return (
		<Card variant="outlined">
			<CardHeader title="5-day Forecast" />
			<CardContent>
				<Skeleton />
			</CardContent>
		</Card>
	);
};