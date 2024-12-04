import Fraction from 'fraction.js';
import { addDays, eachDayOfInterval, format, fromUnixTime, getDate, lightFormat, startOfToday } from 'date-fns';
import { ZipGeocoderResponse, ForecastResponse, ForecastEntry } from '@/app/lib/weather-definitions';
import { ForecastDate, ForecastInfo, GetForecastResult, LocalForecastData, LocalForecastInfo, ParseZipCodeResult, ZipCode } from '@/app/lib/app-definitions';
import { zipCodeSchema } from '@/app/lib/schemas';

export function parseZipCode(zip: string): ParseZipCodeResult {
	const parsedInput = zipCodeSchema.safeParse({ zip });
	
	if (!parsedInput.success) {
		return { isValid: false, message: 'Zip code invalid'};
	}
	return { isValid: true };
};

// Only use this in a client component to ensure correct Date operations
export function getEmptyNext5Days(): ForecastDate[] {
	const start = startOfToday();
	const end = addDays(start, 5);
	const days = eachDayOfInterval({ start, end });
	
	// Generate a dummy list of dates for the next 5 days for when zip is invalid
	return days.map((date) => ({
		label: format(date, 'E'),
		disabled: true,
		tempMin: 0,
		tempMax: 0
	}));
};

// Only use this in a client component to ensure correct Date operations
export function getForecastWithLocalDates(forecast: ForecastInfo[]): LocalForecastData {
	const calendarData = new Map<number, ForecastDate>();
	const dailyForecast = new Map<number, LocalForecastInfo[]>();
	
	forecast.forEach((info) => {
		const { timestamp, min, max, ...rest } = info;
		const localDate = fromUnixTime(timestamp);
		const timeOfForecast = lightFormat(localDate, 'h a');
		const localForecast: LocalForecastInfo = { ...rest, min, max, timeOfForecast };
		const date = getDate(localDate);
		const group = dailyForecast.get(date);
		
		if (group === undefined) {
			// Add entries for date on first ocurrance
			calendarData.set(date, {
				label: format(localDate, 'E'),
				tempMin: min,
				tempMax: max
			});
			dailyForecast.set(date, [localForecast]);
		} else {
			const calendarDate = calendarData.get(date);
			if (calendarDate) {
				// If date already exists update min/max temperature calculations for the day as a whole
				const { label, tempMin: prevMin, tempMax: prevMax } = calendarDate;
				calendarData.set(date, {
					label,
					tempMin: Math.min(min, prevMin),
					tempMax: Math.max(max, prevMax)
				});
			}
			// Update forecast with additional hourly forecasts
			dailyForecast.set(date, [...group, localForecast]);
		}
	});
	
	return {
		calendarData: Array.from(calendarData.values()),
		dailyForecast: Array.from(dailyForecast.values())
	};
};

export function parseZipGeocoderResponse(response: ZipGeocoderResponse): ZipCode {
	const { name, country, zip, lat, lon } = response;
	return { name, country, zipCode: zip, coordinates: { lat, long: lon } };
};

export function parseForecastData(response: ForecastResponse): GetForecastResult {
	const { list, city: { name: locationName } } = response;
	
	return {
		locationName,
		data: list.map(parseForecastEntry)
	};
};

function parseForecastEntry(data: ForecastEntry): ForecastInfo {
	const { dt, main, weather, wind: { speed, deg: direction }, rain, snow } = data;
	const { temp, temp_min, temp_max, feels_like, humidity } = main;
	const { main: title, description, icon } = weather[0];
	
	return {
		timestamp: dt,
		humidity,
		temperature: Math.round(temp),
		min: Math.round(temp_min),
		max: Math.round(temp_max),
		feelsLike: Math.round(feels_like),
		weatherConditions: {
			title,
			description,
			iconSrc: generateWeatherIconUrl(icon),
			wind: { speed: `${Math.round(speed)} mph`, direction },
			rainAccumulation: rain && convertAccumulationToInches(rain["3h"]),
			snowAccumulation: snow && convertAccumulationToInches(snow["3h"])
		}
	};
};

function generateWeatherIconUrl(icon: string): string {
	return new URL(`${icon}@2x.png`, process.env.OPENWEATHER_ICON_BASE_URL).toString();
};

// OpenWeather API only offers accumulation data in mm's regardless of "unit" type specified
function convertAccumulationToInches(mm: number): string|undefined {
	const inches = new Fraction(mm / 25.4);
	const roundedAccumulation = inches.roundTo(0.1);
	
	// If after rounding it's less than 1/10", just ignore it as a useless measurement
	return roundedAccumulation.lt(0.1) ? undefined : `${roundedAccumulation.toFraction()} in.`;
};