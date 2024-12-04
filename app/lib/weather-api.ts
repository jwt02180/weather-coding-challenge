import 'server-only';

import { ApiError, ZipGeocoderRequestParams, ZipGeocoderResponse, Coordinate, ForecastRequestParams, ForecastResponse, Language } from '@/app/lib/weather-definitions';

export async function getCoordinatesFromZip(zip: string): Promise<ZipGeocoderResponse> {
	const params: ZipGeocoderRequestParams = {
		zip: `${zip},US`,
		appid: process.env.OPENWEATHER_API_KEY
	};
	const url = new URL('/geo/1.0/zip', process.env.OPENWEATHER_BASE_URL);
	Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));
	
	return wrappedFetch<ZipGeocoderResponse>(url);
};

export async function getForecastByCoordinates(coord: Coordinate): Promise<ForecastResponse> {
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