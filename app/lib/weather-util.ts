import Fraction from 'fraction.js';
import { TZDate } from '@date-fns/tz';
import { format, getDate, lightFormat } from 'date-fns';
import { ZipGeocoderResponse, ForecastResponse, ForecastEntry } from '@/app/lib/weather-definitions';
import { Forecast, ForecastDate, ForecastInfo, ParseZipCodeResult, ZipCode } from '@/app/lib/app-definitions';
import { zipCodeSchema } from '@/app/lib/schemas';

export function parseZipCode(zip: string): ParseZipCodeResult {
	const parsedInput = zipCodeSchema.safeParse({ zip });
	
	if (!parsedInput.success) {
		return { isValid: false, message: 'Zip code invalid'};
	}
	return { isValid: true };
};

export function parseZipGeocoderResponse(response: ZipGeocoderResponse): ZipCode {
	const { name, country, zip, lat, lon } = response;
	return { name, country, zipCode: zip, coordinates: { lat, long: lon } };
};

export function parseAndGroupForecastData(response: ForecastResponse): Forecast {
	const { list, city: { name: locationName, timezone } } = response;
	const utcOffset = convertTimezoneOffset(timezone);
	
	const result: Forecast = {
			locationName,
			calendarData: new Map<number, ForecastDate>(),
			dailyForecast: new Map<number, ForecastInfo[]>()
	};

	list.forEach((entry) => {
			const { temp_min, temp_max } = entry.main;
			const parsedEntry = parseForecastEntry(entry, utcOffset);
			const date = getDate(parsedEntry.localDate);
			const group = result.dailyForecast.get(date);


			if (group === undefined) {
					// Add entries for date on first ocurrance
					result.calendarData.set(date, {
							label: format(parsedEntry.localDate, 'E'),
							tempMin: temp_min,
							tempMax: temp_max
					});
					result.dailyForecast.set(date, [parsedEntry]);
			} else {
					const calendarDate = result.calendarData.get(date);
					if (calendarDate) {
							// If date already exists update min/max temperature calculations for the day as a whole
							const { label, tempMin: prevMin, tempMax: prevMax } = calendarDate;
							result.calendarData.set(date, {
									label,
									tempMin: Math.min(temp_min, prevMin),
									tempMax: Math.max(temp_max, prevMax)
							});
					}
					// Update forecast with additional hourly forecasts
					result.dailyForecast.set(date, [...group, parsedEntry]);
			}
	});

	return result;
};

function parseForecastEntry(data: ForecastEntry, utcOffset: string): ForecastInfo {
	const { dt, main, weather, wind: { speed, deg: direction }, rain, snow } = data;
	const { temp, temp_min, temp_max, feels_like, humidity } = main;
	const { main: title, description, icon } = weather[0];
	
	// OpenWeather API gives timestamp in s, JS uses ms
	const timestamp = dt*1000;
	const localDate = new TZDate(timestamp, utcOffset);

	return {
		timestamp: dt,
		localDate,
		timeOfForecast: lightFormat(localDate, 'h a'),
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

// OpenWeather API gives the timezone offset in seconds, but date-fns wants a proper UTC offset to work
function convertTimezoneOffset(timezone: number): string {
	const sign = timezone < 0 ? '-' : '+';
	const seconds = Math.abs(timezone);
	const hours = `0${Math.floor(seconds / 3600)}`.slice(-2);
	const minutes = `0${Math.floor(seconds % 3600 / 60)}`.slice(-2);
	return `${sign}${hours}:${minutes}`;
}