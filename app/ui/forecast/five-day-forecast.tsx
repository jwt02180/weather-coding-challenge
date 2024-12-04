'use client';

import { ForecastInfo } from '@/app/lib/app-definitions';
import { getEmptyNext5Days, getForecastWithLocalDates } from '@/app/lib/weather-util';

type FiveDayForecastProps = {
	data : ForecastInfo[];
};

export default function FiveDayForecast({ data }: FiveDayForecastProps) {
	// Convert Date objects from unix to local time
	const { calendarData, dailyForecast } = getForecastWithLocalDates(data);
	const dates = data.length === 0 ? getEmptyNext5Days() : calendarData;
	const forecast = data.length === 0 ? [] : dailyForecast;
	
	console.log(dates);
	console.log(forecast);
	
	return <div>Forecase here</div>;
};