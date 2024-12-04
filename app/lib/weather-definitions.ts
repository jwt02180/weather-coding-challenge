export interface ApiError {
	cod: string;
	message: string;
};

export interface ZipGeocoderRequestParams extends BaseApiRequestParams {
	zip: string;
};

export interface ZipGeocoderResponse {
	zip: string;
	name: string;
	lat: number;
	lon: number;
	country: string;
};

export interface ForecastRequestParams extends BaseApiRequestParams {
	lat: number;
	lon: number;
	units?: Units;
	mode?: 'xml';
	cnt?: number;
	lang?: Language;
};

export interface ForecastResponse {
	cod: string;
	message: number;
	cnt: number;
	list: ForecastEntry[];
	city: {
		id: number;
		name: string;
		coord: Coordinate;
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	}
};

export interface Coordinate {
	lat: number;
	lon: number;
};

export interface ForecastEntry {
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		sea_level: number;
		grnd_level: number;
		humidity: number;
		temp_kf: number;
	};
	weather: WeatherCondition[];
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	visibility: number;
	pop: number;
	rain?: {
		'3h': number;
	};
	snow?: {
		'3h': number;
	};
	sys: {
		pod: PartOfDay;
	};
	dt_txt: string;
};

export interface WeatherCondition {
	id: number;
	main: string;
	description: string;
	icon: string;
};

export type Units = 'standard' | 'metric' | 'imperial';

export enum PartOfDay {
	Day='d',
	Night='n'
};

export enum Language {
	Albanian='sq',
	Afrikaans='af',
	Arabic='ar',
	Azerbaijani='az',
	Basque='eu',
	Belarusian='be',
	Bulgarian='bg',
	Catalan='ca',
	Chinese_Simplified='zh_cn',
	Chinese_Traditional='zh_tw',
	Croatian='hr',
	Czech='cz',
	Danish='da',
	Dutch='nl',
	English='en',
	Finnish='fi',
	French='fr',
	Galician='gl',
	German='de',
	Greek='el',
	Hebrew='he',
	Hindi='hi',
	Hungarian='hu',
	Icelandic='is',
	Indonesian='id',
	Italian='it',
	Japanese='ja',
	Korean='kr',
	Kurmanji='ku',
	Latvian='la',
	Lithuanian='lt',
	Macedonian='mk',
	Norwegian='no',
	Persian='fa',
	Polish='pl',
	Portuguese='pt',
	Portugues_Brasil='pt_br',
	Romanian='ro',
	Russian='ru',
	Serbian='sr',
	Slovak='sk',
	Slovenian='sl',
	Spanish='es',
	Swedish='se',
	Thai='th',
	Turkish='tr',
	Ukrainian='uk',
	Vietnamese='vi',
	Zulu='zu'
};

interface BaseApiRequestParams {
	appid: string;
};