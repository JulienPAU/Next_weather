"use client";

import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { getWeatherIcon, formatCityName, getCurrentHourIndex, formatDateTime, getWeatherText, getCurrentDayIndex, getWindDirectionIcon } from "./utils/utils";
import { fetchWeatherData, fetchCityCoordinates } from "./utils/api";
import { WeatherData, Location, HourlyForecast } from "./utils/types/weather";
import Header from "./components/Header";
import WeatherCard from "./components/WeatherCard";

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [showMore, setShowMore] = useState(false);
    const [showMoreWeekly, setShowMoreWeekly] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<Location>({
        latitude: 48.0833,
        longitude: 7.3667,
        cityName: "Colmar",
    });

    const loadWeatherData = async (lat: number, long: number, cityName?: string) => {
        setLoading(true);
        try {
            const { weatherData, location: newLocation } = await fetchWeatherData(lat, long, cityName);
            setWeatherData(weatherData);
            setLocation({
                latitude: lat,
                longitude: long,
                cityName: newLocation.cityName,
            });
            setLoading(false);
        } catch (err) {
            setError("Erreur lors du chargement des données météo");
            setLoading(false);
        }
    };

    // Effets de chargement initial et sauvegarde de location
    useEffect(() => {
        const savedLocation = localStorage.getItem("lastLocation");
        if (savedLocation) {
            const parsedLocation = JSON.parse(savedLocation);
            loadWeatherData(parsedLocation.latitude, parsedLocation.longitude, parsedLocation.cityName);
        } else {
            loadWeatherData(location.latitude, location.longitude);
        }
    }, []);

    useEffect(() => {
        const { latitude, longitude, cityName } = location;
        localStorage.setItem("lastLocation", JSON.stringify({ latitude, longitude, cityName }));
    }, [location]);

    // Gestion des erreurs et chargement
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

    if (loading || !weatherData) {
        return <Loader />;
    }

    // Préparation des données de prévision
    const currentHourIndex = getCurrentHourIndex(weatherData.hourly.time);
    const currentDayIndex = getCurrentDayIndex(weatherData.daily.time);

    const hourlyForecast = weatherData.hourly.time.map((time, index) => ({
        time,
        temperature: weatherData.hourly.temperature_2m[index],
        wind: weatherData.hourly.wind_speed_10m[index],
        wind_direction: weatherData.hourly.wind_direction_10m[index],

        humidity: weatherData.hourly.relative_humidity_2m[index],
        visibility: weatherData.hourly.visibility[index],
        precipitation: weatherData.hourly.precipitation[index],
        weathercode: weatherData.hourly.weather_code[index],
        temperature_apparent: weatherData.hourly.apparent_temperature[index],
        is_day: weatherData.hourly.is_day[index],
    }));

    const dailyForecast = weatherData.daily.time.map((time, index) => ({
        time,
        wind: weatherData.daily.wind_speed_10m_max[index],
        precipitation: weatherData.daily.precipitation_sum[index],
        weathercode: weatherData.daily.weather_code[index],
        temperature_2m_max: weatherData.daily.temperature_2m_max[index],
        temperature_2m_min: weatherData.daily.temperature_2m_min[index],
        temperature_apparent_max: weatherData.daily.apparent_temperature_max[index],
        temperature_apparent_min: weatherData.daily.apparent_temperature_min[index],
        sunrise: weatherData.daily.sunrise[index],
        sunset: weatherData.daily.sunset[index],
    }));

    const getLocalDateTime = (time: string, timeZone: string) => {
        return new Date(new Date(time).toLocaleString("en-US", { timeZone }));
    };

    const isDayTime = (forecastTime: string, timeZone: string) => {
        const localDate = getLocalDateTime(forecastTime, timeZone);
        const hour = localDate.getHours(); // Heure locale

        // Récupère les valeurs sunrise et sunset sous forme de chaîne ISO
        const sunriseRaw = weatherData.daily.sunrise[currentDayIndex];
        const sunsetRaw = weatherData.daily.sunset[currentDayIndex];

        // Affiche les valeurs brutes

        // Convertir les chaînes ISO en objets Date
        const sunriseDate = new Date(sunriseRaw);
        const sunsetDate = new Date(sunsetRaw);

        // Vérifie si la conversion en Date a échoué
        if (isNaN(sunriseDate.getTime()) || isNaN(sunsetDate.getTime())) {
            console.error("Invalid sunrise or sunset date", sunriseDate, sunsetDate);
            return false;
        }

        // Formatage des heures avec toLocaleTimeString
        const sunriseHour = sunriseDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const sunsetHour = sunsetDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });

        // Convertir l'heure locale en format hh:mm
        const localTime = localDate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });

        // Comparer les heures
        return localTime >= sunriseHour && localTime < sunsetHour;
    };

    return (
        <div className={`container mx-auto w-full `}>
            <Header
                location={location}
                setLocation={setLocation}
                loadWeatherData={loadWeatherData}
                weatherData={weatherData}
                fetchCityCoordinates={fetchCityCoordinates}
                formatCityName={formatCityName}
                formatDateTime={formatDateTime}
                getWeatherIcon={getWeatherIcon}
                getWeatherText={getWeatherText}
                getWindDirectionIcon={getWindDirectionIcon}
            />
            <div className="flex flex-wrap flex-col justify-evenly p-4  w-full">
                <div className="rounded-3xl  flex flex-wrap flex-col gap-3 items-center justify-evenly text-center sm:text-left sm:flex-1 shadow-light dark:shadow-dark my-5">
                    <h2 className="text-2xl font-semibold mt-2 text-center">Prévisions horaires</h2>
                    <div className="flex flex-wrap w-full  lg:gap-1 sm:gap-3 justify-evenly">
                        {hourlyForecast.slice(currentHourIndex + 1, currentHourIndex + 6).map((forecast, index) => (
                            <WeatherCard
                                key={index}
                                icon={getWeatherIcon(forecast.weathercode, forecast.precipitation, isDayTime(forecast.time, weatherData.timezone) ? 1 : 0)}
                                description={getWeatherText(forecast.weathercode)}
                                time={new Date(forecast.time).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: weatherData.timezone,
                                })}
                                temperature={forecast.temperature}
                                temperature_apparent={forecast.temperature_apparent}
                                wind={forecast.wind}
                                humidity={forecast.humidity}
                                visibility={forecast.visibility}
                                precipitation={forecast.precipitation}
                                cardStyle="bg-none w-full lg:w-2/12 text-center py-1"
                            />
                        ))}

                        {showMore &&
                            hourlyForecast.slice(currentHourIndex + 6, currentHourIndex + 11).map((forecast, index) => (
                                <WeatherCard
                                    key={index}
                                    icon={getWeatherIcon(forecast.weathercode, forecast.precipitation, isDayTime(forecast.time, weatherData.timezone) ? 1 : 0)}
                                    description={getWeatherText(forecast.weathercode)}
                                    time={new Date(forecast.time).toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: weatherData.timezone,
                                    })}
                                    temperature={forecast.temperature}
                                    temperature_apparent={forecast.temperature_apparent}
                                    wind={forecast.wind}
                                    humidity={forecast.humidity}
                                    visibility={forecast.visibility}
                                    precipitation={forecast.precipitation}
                                    cardStyle="bg-none w-full lg:w-2/12 text-center py-1"
                                />
                            ))}
                    </div>
                    <button onClick={() => setShowMore(!showMore)} className="mt-2 mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        {showMore ? "Voir moins" : "Voir plus"}
                    </button>
                </div>

                <div className="rounded-3xl  flex flex-wrap flex-col gap-3 items-center justify-evenly text-center sm:text-left sm:flex-1 shadow-light dark:shadow-dark my-5">
                    <h2 className="text-2xl font-semibold mt-2 text-center">Prévisions hebdomadaires</h2>
                    <div className="flex flex-wrap w-full  lg:gap-1 sm:gap-3 justify-evenly">
                        {dailyForecast.slice(currentDayIndex - 1, currentDayIndex + 4).map((forecast, index) => (
                            <WeatherCard
                                key={index}
                                title="Prévision quotidienne"
                                icon={getWeatherIcon(forecast.weathercode, forecast.precipitation, 1)}
                                description={getWeatherText(forecast.weathercode)}
                                time={new Date(forecast.time).toLocaleDateString("fr-FR", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                })}
                                precipitation={forecast.precipitation}
                                high={forecast.temperature_2m_max}
                                low={forecast.temperature_2m_min}
                                cardStyle="bg-none w-full lg:w-2/12 text-center py-1 px-1"
                                sunrise={new Date(forecast.sunrise).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                sunset={new Date(forecast.sunset).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            />
                        ))}

                        {showMoreWeekly &&
                            dailyForecast.slice(currentDayIndex + 4).map((forecast, index) => (
                                <WeatherCard
                                    key={index}
                                    title="Prévision quotidienne"
                                    icon={getWeatherIcon(forecast.weathercode, forecast.precipitation, 1)}
                                    description={getWeatherText(forecast.weathercode)}
                                    time={new Date(forecast.time).toLocaleDateString("fr-FR", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                    })}
                                    precipitation={forecast.precipitation}
                                    high={forecast.temperature_2m_max}
                                    low={forecast.temperature_2m_min}
                                    cardStyle="bg-none w-full lg:w-2/12 text-center py-1 px-1"
                                    sunrise={new Date(forecast.sunrise).toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    sunset={new Date(forecast.sunset).toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                />
                            ))}
                    </div>

                    <button onClick={() => setShowMoreWeekly(!showMoreWeekly)} className="mt-2 mb-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        {showMoreWeekly ? "Voir moins" : "Voir plus"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WeatherPage;
