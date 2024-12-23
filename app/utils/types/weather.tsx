export interface WeatherData {
    current: {
        temperature_2m: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        weather_code: number;
        time: string;
        visibility: number;
        is_day: number;
    };
    daily: {
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        time: string[];
        relative_humidity_2m: number[];
        visibility: number[];
        precipitation_sum: number[];
        wind_speed_10m_max: number[];
        weather_code: number[];
        apparent_temperature_max: number[];
        apparent_temperature_min: number[];
        sunrise: any[];
        sunset: any[];
    };
    hourly: {
        temperature_2m: number[];
        wind_speed_10m: number[];
        wind_direction_10m: number[];
        relative_humidity_2m: number[];
        time: string[];
        timezone: string[];
        visibility: number[];
        precipitation: number[];
        weather_code: number[];
        apparent_temperature: number[];
        is_day: number[];
    };
    timezone: string;
}

export interface Location {
    latitude: number;
    longitude: number;
    cityName: string;
}

export interface HourlyForecast {
    time: string;
    temperature: number;
    wind: number;
    humidity: number;
    visibility: number;
    precipitation: number;
    timezone: string;
}

export interface DailyForecast {
    time: string;
    wind: number;
    precipitation: number;
    weathercode: number;
    temperature_2m_max: number;
    temperature_2m_min: number;
    temperature_apparent_max: number;
    temperature_apparent_min: number;
    sunrise: string;
    sunset: string;
}
