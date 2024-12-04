import Image from 'next/image';
import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid2 as Grid, Typography } from '@mui/material';
import { ForecastInfo, WindInfo } from '@/app/lib/app-definitions';
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDownOutlined';

type DailyForecastProps = {
	data: ForecastInfo[];
};

export default function DailyForecast({ data }: DailyForecastProps) {
	const [expanded, setExpanded] = useState<number>(0);
	
	return (
		<>
			{data.map((forecast, idx) => (
				<Accordion key={idx} expanded={expanded === idx} onChange={() => setExpanded(idx)}>
					<AccordionSummary color='primary' sx={{ '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', my: 0.25 }}}>
						<Box sx={{ width: '100%' }}>
							<MainForecastDisplay data={forecast} />
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						Feels like {forecast.feelsLike}&deg;
						{forecast.weatherConditions.rainAccumulation && (
							<div>Rain accumulation: {forecast.weatherConditions.rainAccumulation}</div>
						)}
						{forecast.weatherConditions.snowAccumulation && (
							<div>Snow accumulation: {forecast.weatherConditions.snowAccumulation}</div>
						)}
					</AccordionDetails>
				</Accordion>
			))}
		</>
	);
};

type MainForecastDisplayProps = {
	data: ForecastInfo;
};

function MainForecastDisplay({ data }: MainForecastDisplayProps) {
	const { timeOfForecast, temperature, weatherConditions: { iconSrc, description, wind }} = data;
	
	return (
		<Grid container spacing={2}>
			<Grid display="flex" justifyContent="start" alignItems="center" size={3}>
				{timeOfForecast}
			</Grid>
			<Grid display="flex" justifyContent="center" alignItems="center" size="grow">
				<Image src={iconSrc} width={50} height={50} alt={`Weather condition, ${description}`} />
				{temperature}&deg;
			</Grid>
			<Grid display="flex" justifyContent="end" alignItems="center" size={3}>
				<WindDisplay data={wind} />
			</Grid>
		</Grid>
	);
}

type WindDisplayProps = {
	data: WindInfo;
};

function WindDisplay({ data }: WindDisplayProps) {
	const { speed, direction } = data;
	
	return (
		<Grid container>
			<Grid display="flex" justifyContent="center" alignItems="center" size={12}>
				<ArrowCircleDown fontSize="large" sx={{ transform: `rotate(${direction}deg)`}} />
			</Grid>
			<Grid display="flex" justifyContent="center" alignItems="center" size={12}>
				<Typography variant="caption">{speed}</Typography>
			</Grid>
		</Grid>
	);
};