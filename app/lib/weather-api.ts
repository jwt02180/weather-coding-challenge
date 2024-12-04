import 'server-only';

import { ApiError, ZipGeocoderRequestParams, ZipGeocoderResponse, Coordinate, ForecastRequestParams, ForecastResponse, Language } from '@/app/lib/weather-definitions';
import { GetForecastResult, ValidateZipCodeResult, ZipCode } from '@/app/lib/app-definitions';
import { parseForecastData, parseZipCode, parseZipGeocoderResponse } from '@/app/lib/weather-util';

export async function validateZip(zip: string): Promise<ValidateZipCodeResult> {
	const { isValid, message } = parseZipCode(zip);
	if (!isValid) {
		return { isValid, message };
	}
	
	try {
		const response = await getCoordinatesFromZip(zip);
		// Don't expose 3rd party API shape to rest of app, protects codebase from data changes in future
		return { isValid: true, data: parseZipGeocoderResponse(response) };
	} catch (e) {
		return { isValid: false, message: (e as Error).message };
	}
};

export async function getForecast(verifiedZip: ZipCode): Promise<GetForecastResult> {
	const { name, coordinates: { lat, long: lon }} = verifiedZip;
	// Don't expose 3rd party API shape to rest of app, protects codebase from data changes in future
	const result = parseForecastData(await getForecastByCoordinates({ lat, lon }));
	// It seems that OpenWeather forecast uses a nearby city for the data, replace locationName with zip lookup instead for continuity
	result.locationName = name;
	return result;
};

async function getCoordinatesFromZip(zip: string): Promise<ZipGeocoderResponse> {
	const params: ZipGeocoderRequestParams = {
		zip: `${zip},US`,
		appid: process.env.OPENWEATHER_API_KEY
	};
	const url = new URL('/geo/1.0/zip', process.env.OPENWEATHER_BASE_URL);
	Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));
	
	return wrappedFetch<ZipGeocoderResponse>(url);
};

async function getForecastByCoordinates(coord: Coordinate): Promise<ForecastResponse> {
	const params: ForecastRequestParams = {
		lat: coord.lat,
		lon: coord.lon,
		appid: process.env.OPENWEATHER_API_KEY,
		lang: Language.English,
		units: 'imperial'
	};
	const url = new URL('/data/2.5/forecast', process.env.OPENWEATHER_BASE_URL);
	Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));
	
	return wrappedFetch<ForecastResponse>(url);
};

async function wrappedFetch<T>(url: URL): Promise<T> {
	const response = await fetch(url);
	
	if (!response.ok) {
		const contentType = response.headers.get('Content-Type')
		
		if (contentType && contentType.includes('application/json')) {
			const errorData = await response.json() as ApiError;
			// OpenWeather seems to only respond with "not found" if there's an issue
			// So make a "safe" assumption for the demo and make it a nicer message
			throw new Error(`City ${errorData.message}`);
		}
		throw new Error(response.statusText);
	}
	
	return response.json();
};