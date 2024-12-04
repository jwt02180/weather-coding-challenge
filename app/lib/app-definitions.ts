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
	data: ForecastInfo[];
};

export interface LocalForecastData {
	calendarData: ForecastDate[];
	dailyForecast: LocalForecastInfo[][];
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
	temperature: number;
	min: number;
	max: number;
	feelsLike: number;
	humidity: number;
	weatherConditions: WeatherCondition;
};

export interface LocalForecastInfo extends Omit<ForecastInfo, 'timestamp'> {
	timeOfForecast: string;
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