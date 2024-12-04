export interface ParseZipCodeResult {
	isValid: boolean;
	message?: string;
};

export interface ValidateZipCodeResult {
	isValid: boolean;
	data?: ZipCode;
	message?: string;
};

export interface GetForecastResult {
	locationName: string;
	dates: ForecastDate[];
	forecast: ForecastInfo[][];
};

export interface Forecast {
	locationName: string;
	calendarData: Map<number, ForecastDate>;
	dailyForecast: Map<number, ForecastInfo[]>;
};

export interface ZipCode {
	name: string;
	country: string;
	zipCode: string;
	coordinates: CoordinatePair;
};

export interface CoordinatePair {
	lat: number;
	long: number;
};

export interface ForecastDate {
	label: string;
	disabled?: boolean;
	tempMin: number;
	tempMax: number;
};

export interface ForecastInfo {
	timestamp: number;
	localDate: Date;
	timeOfForecast: string;
	temperature: number;
	min: number;
	max: number;
	feelsLike: number;
	humidity: number;
	weatherConditions: WeatherCondition;
};

export interface WeatherCondition {
	title: string;
	description: string;
	iconSrc: string;
	wind: WindInfo;
	rainAccumulation?: string;
	snowAccumulation?: string;
};

export interface WindInfo {
	speed: string;
	direction: number;
};