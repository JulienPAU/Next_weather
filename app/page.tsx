"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./components/Loader";

const WeatherPage = () => {
    interface WeatherData {
        current: {
            temperature_2m: number;
            wind_speed_10m: number;
        };
        daily: {
            temperature_2m_max: number[];
            temperature_2m_min: number[];
            time: string[];
            relative_humidity_2m: number[];
            visibility: number[];
            precipitation: number[];
            wind_speed_10m_max: number[];
        };
        hourly: {
            temperature_2m: number[];
            wind_speed_10m: number[];
            relative_humidity_2m: number[];
            time: string[];
            visibility: number[];
            precipitation: number[];
        };
    }

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState({
        latitude: 48.0833, // Colmar par défaut
        longitude: 7.3667,
        cityName: "Colmar",
    });

    // latitude: 48.0833, // Colmar par défaut
    //     longitude: 7.3667,
    //     cityName: "Colmar",

    const [citySearch, setCitySearch] = useState("");

    const fetchWeatherData = async (lat: number, long: number, cityName?: string) => {
        if (weatherData && location.latitude === lat && location.longitude === long) {
            setLoading(false); // Assurez-vous de désactiver le chargement
            return;
        }
        setLoading(true);
        try {
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

            const current = ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "weather_code", "cloudcover", "wind_speed_10m", "wind_direction_10m"];

            const temperatureUnit = "celsius";
            const windSpeedUnit = "kmh";
            const precipitationUnit = "mm";
            const timeformat = "iso8601";
            const timezone = "Europe/Paris";

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
                    forecast_days: 8,
                },
            });
            setWeatherData(response.data);
            setLocation((prev) => ({
                ...prev,
                latitude: lat,
                longitude: long,
                cityName: cityName || prev.cityName,
            }));
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation((prev) => ({
                        ...prev,
                        latitude,
                        longitude,
                    }));
                    fetchWeatherData(latitude, longitude);
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                    setError("Impossible de récupérer la localisation");
                }
            );
        } else {
            setError("Géolocalisation non supportée");
        }
    };

    const handleCitySearch = async (city: string) => {
        if (!city.trim()) {
            setError("Veuillez entrer une ville");
            return;
        }
        try {
            const response = await axios.get(`https://geocode.maps.co/search?q=address&api_key=674f65003eba8677537464hsq6fce16`, {
                params: { q: city },
            });
            const result = response.data[0];
            if (result) {
                const { lat, lon, display_name } = result;
                fetchWeatherData(parseFloat(lat), parseFloat(lon), display_name);
            } else {
                setError("Ville introuvable");
            }
        } catch (err: any) {
            setError("Erreur lors de la recherche de la ville");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleCitySearch(citySearch);
        }
    };

    useEffect(() => {
        const savedLocation = localStorage.getItem("lastLocation");
        if (savedLocation) {
            const parsedLocation = JSON.parse(savedLocation);
            if (parsedLocation.latitude !== location.latitude || parsedLocation.longitude !== location.longitude) {
                fetchWeatherData(parsedLocation.latitude, parsedLocation.longitude, parsedLocation.cityName);
            }
        } else {
            fetchWeatherData(location.latitude, location.longitude);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("lastLocation", JSON.stringify(location));
    }, [location]);

    // useEffect(() => {
    //     fetchWeatherData(location.latitude, location.longitude);
    // }, [location.latitude, location.longitude]);

    if (error) {
        return (
            <div className="text-red-500 text-center mt-10 flex flex-col justify-center items-center text-xl">
                Erreur : {error}{" "}
                <button className="bg-transparent hover:bg-blue-500 mt-10 text-white font-semibold hover:text-white py-2 px-4 border border-white hover:border-transparent rounded">
                    <a href="/">Réessayez</a>
                </button>
            </div>
        );
    }
    if (!weatherData) {
        return <Loader />;
    }

    if (loading) {
        return <Loader />;
    }

    const getCurrentHourIndex = () => {
        const now = new Date();
        return weatherData.hourly.time.findIndex((time) => {
            const forecastTime = new Date(time);
            return forecastTime.getFullYear() === now.getFullYear() && forecastTime.getMonth() === now.getMonth() && forecastTime.getDate() === now.getDate() && forecastTime.getHours() === now.getHours();
        });
    };

    const currentHourIndex = getCurrentHourIndex();
    const hourlyForecast = weatherData.hourly.time.map((time, index) => ({
        time,
        temperature: weatherData.hourly.temperature_2m[index],
        wind: weatherData.hourly.wind_speed_10m[index],
        humidity: weatherData.hourly.relative_humidity_2m[index],
        visibility: weatherData.hourly.visibility[index],
        precipitation: weatherData.hourly.precipitation[index],
    }));

    const dailyForecast = weatherData.daily.time.map((time, index) => ({
        time,
        temperature: weatherData.hourly.temperature_2m[index],
        wind: weatherData.hourly.wind_speed_10m[index],
        humidity: weatherData.hourly.relative_humidity_2m[index],
        visibility: weatherData.hourly.visibility[index],
        precipitation: weatherData.hourly.precipitation[index],
    }));

    console.log("hour", hourlyForecast);
    console.log("daily", dailyForecast);
    // Fonction pour déterminer l'icône météo
    const getWeatherIcon = (weatherCondition: string, precipitation: number) => {
        switch (weatherCondition) {
            case "cloudy":
                return "fa-cloud text-gray-300"; // Temps nuageux
            case "snow":
                return "fa-snowflake text-white"; // Neige
            case "ice":
                return "fa-icicles text-blue-300"; // Verglas
            case "thunderstorm":
                return "fa-bolt text-yellow-300"; // Orage
            case "fog":
                return "fa-smog text-gray-400"; // Brouillard
            default:
                if (precipitation > 5) return "fa-cloud-showers-heavy text-blue-500"; // Pluie forte
                if (precipitation > 0) return "fa-cloud-rain text-gray-400"; // Petite pluie
                return "fa-sun text-yellow-500"; // Beau temps
        }
    };

    // ne garder que colmar dans location.cityname qui contient Colmar, Colmar-Ribeauvillé, Haut-Rhin, Grand Est, Metropolitan France, 68000, France
    if (location.cityName) {
        const cityNameParts = location.cityName.split(",");
        location.cityName = cityNameParts[0].trim();
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap items-center justify-between mb-6 ">
                <div className="flex flex-wrap gap-4">
                    <input type="text" placeholder="Rechercher une ville" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} onKeyDown={handleKeyDown} className="border rounded-lg px-4 py-2" />
                    <button onClick={() => handleCitySearch(citySearch)} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                        Rechercher
                    </button>
                    <button onClick={handleGeolocation} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full fas fa-location-dot text-2xl"></button>
                </div>
            </div>
            {/* Section des cartes principales */}

            <div className="w-4/5 flex gap-5 sm:w-4/5 lg:w-2/6">
                <div className="card p-4 rounded-lg shadow-md text-center ">
                    <h1 className="text-3xl font-bold">{location.cityName}</h1>
                    <p className="text-sm">{new Date().toLocaleString()}</p>
                </div>
                <div className="card p-4 rounded-lg shadow-md text-center">
                    <i className={`fas ${getWeatherIcon("default", hourlyForecast[0].precipitation)} text-4xl mb-2`}></i>

                    <h2 className="font-bold text-lg text-black">Conditions actuelles</h2>
                    <div>
                        <i className="fas fa-thermometer-half text-blue-500"></i> Temp : {weatherData.current.temperature_2m}°C
                    </div>
                    <div>
                        <i className="fas fa-wind text-gray-500"></i> Vent : {weatherData.current.wind_speed_10m} km/h
                    </div>
                    <div>
                        <i className="fas fa-tint text-blue-300"></i> Humidité : {weatherData.hourly.relative_humidity_2m[0]}%
                    </div>
                    <div>
                        <i className="fas fa-eye text-green-500"></i> Visibilité : {weatherData.hourly.visibility[0]} m
                    </div>
                </div>
            </div>

            {/* Section des prévisions horaires */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Prévisions sur 6 heures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {hourlyForecast.slice(currentHourIndex + 1, currentHourIndex + 7).map((forecast, index) => (
                        <div key={index} className="bg-gray-400 p-4 rounded-lg shadow-md card">
                            <i className={`fas ${getWeatherIcon("default", forecast.precipitation)} text-2xl mb-2`}></i>
                            <div className="font-bold">{new Date(forecast.time).toLocaleTimeString("fr-FR")}</div>
                            <div>
                                <i className="fas fa-thermometer-half text-blue-500"></i> {forecast.temperature}°C
                            </div>
                            <div>
                                <i className="fas fa-wind text-gray-500"></i> Vent : {forecast.wind} km/h
                            </div>
                            <div>
                                <i className="fas fa-tint text-blue-300"></i> Humidité : {forecast.humidity}%
                            </div>
                            <div>
                                <i className="fas fa-eye text-green-500"></i> Visibilité : {forecast.visibility} m
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Prévisions hebdomadaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dailyForecast.map((forecast, index) => (
                        <div key={index} className="bg-gray-400 p-4 rounded-lg shadow-md card">
                            <i className={`fas ${getWeatherIcon("default", forecast.precipitation)} text-2xl mb-2`}></i>

                            <div className="font-bold">{new Date(forecast.time).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</div>
                            <div>
                                <i className="fas fa-thermometer-half text-blue-500"></i> {forecast.temperature}°C
                            </div>

                            <div>
                                <i className="fas fa-wind text-gray-500"></i> Vent : {forecast.wind} km/h
                            </div>
                            <div>
                                <i className="fas fa-tint text-blue-300"></i> Humidité : {forecast.humidity}%
                            </div>
                            <div>
                                <i className="fas fa-eye text-green-500"></i> Visibilité : {forecast.visibility} m
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherPage;
