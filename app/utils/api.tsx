import axios from "axios";
import { Location, WeatherData } from "../utils/types/weather";

export const fetchWeatherData = async (lat: number, long: number, cityName?: string): Promise<{ weatherData: WeatherData; location: Location }> => {
    const hourly = [
        "temperature_2m",
        "relative_humidity_2m",
        "dewpoint_2m",
        "apparent_temperature",
        "precipitation_probability",
        "precipitation",
        "rain",
        "showers",
        "snowfall",
        "snow_depth",
        "weather_code",
        "cloudcover",
        "cloudcover_low",
        "cloudcover_mid",
        "cloudcover_high",
        "visibility",
        "evapotranspiration",
        "et0_fao_evapotranspiration",
        "vapor_pressure_deficit",
        "wind_speed_10m",
        "wind_speed_80m",
        "wind_speed_120m",
        "wind_speed_180m",
        "wind_direction_10m",
        "wind_direction_80m",
        "wind_direction_120m",
        "wind_direction_180m",
        "wind_gusts_10m",
        "temperature_80m",
        "temperature_120m",
        "temperature_180m",
        "soil_temperature_0cm",
        "soil_temperature_6cm",
        "soil_temperature_18cm",
        "soil_temperature_54cm",
        "soil_moisture_0_1cm",
        "soil_moisture_1_3cm",
        "soil_moisture_3_9cm",
        "soil_moisture_9_27cm",
        "soil_moisture_27_81cm",
    ];

    const daily = [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunrise",
        "sunset",
        "daylight_duration",
        "sunshine_duration",
        "uv_index_max",
        "uv_index_clear_sky_max",
        "precipitation_sum",
        "rain_sum",
        "showers_sum",
        "snowfall_sum",
        "precipitation_hours",
        "precipitation_probability_max",
        "wind_speed_10m_max",
        "wind_gusts_10m_max",
        "wind_direction_10m_dominant",
        "shortwave_radiation_sum",
        "et0_fao_evapotranspiration",
    ];

    const current = ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "weather_code", "cloudcover", "wind_speed_10m", "wind_direction_10m", "visibility"];

    const temperatureUnit = "celsius";
    const windSpeedUnit = "kmh";
    const precipitationUnit = "mm";
    const timeformat = "iso8601";
    const timezone = "auto"; // Utilisez "auto" pour détecter automatiquement le fuseau horaire
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
                latitude: lat,
                longitude: long,
                hourly,
                daily,
                current,
                temperature_unit: temperatureUnit,
                wind_speed_unit: windSpeedUnit,
                precipitation_unit: precipitationUnit,
                timeformat,
                timezone,
                past_days: 0,
                forecast_days: 9,
            },
        });

        return {
            weatherData: response.data,
            location: {
                latitude: lat,
                longitude: long,
                cityName: cityName || "",
            },
        };
    } catch (error) {
        throw new Error("Failed to fetch weather data");
    }
};

export const fetchCityCoordinates = async (city: string) => {
    try {
        const response = await axios.get(`https://geocode.maps.co/search`, {
            params: {
                q: city,
                api_key: "674f65003eba8677537464hsq6fce16",
            },
        });

        const result = response.data[0];
        if (result) {
            return {
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon),
                displayName: result.display_name,
            };
        }
        throw new Error("City not found");
    } catch (error) {
        throw new Error("Error searching for city");
    }
};

export const fetchCityNameFromCoordinates = async (lat: number, lon: number): Promise<string> => {
    try {
        const response = await axios.get(`https://geocode.maps.co/reverse`, {
            params: {
                lat,
                lon,
                api_key: "674f65003eba8677537464hsq6fce16",
            },
        });

        const result = response.data;
        if (result && result.address) {
            return result.address.city || result.address.town || result.address.village || "Ville inconnue";
        }
        throw new Error("City not found");
    } catch (error) {
        throw new Error("Error fetching city name");
    }
};
