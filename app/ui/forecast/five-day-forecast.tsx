'use client';

import React, { useState } from 'react';
import { Typography, Tabs, Tab, Box, useMediaQuery, TypographyProps } from '@mui/material';
import { ForecastDate, ForecastInfo, LocalForecastInfo } from '@/app/lib/app-definitions';
import DailyForecast from '@/app/ui/forecast/daily-forecast';
import { getEmptyNext5Days, getForecastWithLocalDates } from '@/app/lib/weather-util';

type FiveDayForecastProps = {
	data : ForecastInfo[];
};

export default function FiveDayForecast({ data }: FiveDayForecastProps) {
	// Convert Date objects from unix to local time
	const { calendarData, dailyForecast } = getForecastWithLocalDates(data);
	const dates = data.length === 0 ? getEmptyNext5Days() : calendarData;
	const forecast = data.length === 0 ? [] : dailyForecast;
	
	return <Forecast data={{ dates, forecast }} />;
};

type ForecastProps = {
	data: {
		dates: ForecastDate[];
		forecast: LocalForecastInfo[][];
	};
};

function Forecast({ data }: ForecastProps) {
	const { dates, forecast } = data;
	const [selectedTab, setSelectedTab] = useState(0);
	const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	
	const handleChange = (newSelection: number) => {
		setSelectedTab(newSelection);
	};
	
	return (
		<Box sx={{ bgcolor: 'background.paper', display: isSmall ? 'block' : 'flex' }}>
			<Tabs
				suppressHydrationWarning
				value={selectedTab}
				onChange={(_, next: number) => handleChange(next)}
				variant={isSmall ? 'fullWidth' : 'standard'}
				orientation={isSmall ? 'horizontal' : 'vertical'}
				sx={isSmall ? {borderBottom: 1, borderColor: 'divider'} : {borderRight: 1, borderColor: 'divider'}}
				>
				{dates.map((date) => (
					<Tab disabled={date.disabled} key={date.label} label={<TabLabel date={date} />} sx={{ minWidth: { xs: '36px', sm: '135px' } }} />
				))}
			</Tabs>
			{forecast.length === 0 && (
				<TabContent isSelected={true}>
					<div style={{ height: '100%', width: '100%', textAlign: 'center' }}>
						<Typography color="textDisabled" sx={{ fontStyle: 'italic' }}>No Forecast Available</Typography>
					</div>
				</TabContent>
			)}
			{forecast.map((day, idx) => (
				<TabContent key={idx} isSelected={selectedTab === idx}>
					<div suppressHydrationWarning>
						<DailyForecast data={day} />
					</div>
				</TabContent>
			))}
		</Box>
	);
};

type TabLabelProps = {
	date: ForecastDate;
};

// https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
function TabLabel({ date }: TabLabelProps) {
	const { label, tempMin, tempMax, disabled } = date;
	const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	const min = Math.round(tempMin);
	const max = Math.round(tempMax);
	const color: TypographyProps['color'] = disabled ? 'textDisabled' : 'textSecondary';
	const labelText = disabled ? 'Unavailable' : `HI ${min}\u00B0 | LO ${max}\u00B0`;
	
	return (
		<>
			<Typography variant={isSmall ? 'subtitle2' : 'h6'} textTransform={'none'}>
				{label}
			</Typography>
			<Typography
				variant="caption"
				color={color}
				sx={{ fontStyle: disabled ? 'italic' : 'normal', display: { xs: 'none', sm : 'inline' } }}
				>
				{labelText}
			</Typography>
		</>
	);
};

type TabContentProps = {
	isSelected: boolean;
	children?: React.ReactNode;
};

function TabContent({ isSelected, children }: TabContentProps) {
	return (
		<div style={{ flexGrow: 1 }} hidden={!isSelected}>
			<Box sx={{ px: { xs: 0, sm: 3}, py: { xs: 3, sm: 0 }}}>
				{children}
			</Box>
		</div>
	);
};