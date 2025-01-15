import { useState, useCallback, useRef, useEffect } from "react";
import { Location } from "../utils/types/weather";
import { fetchCityNameFromCoordinates } from "../utils/api";
import { useDebouncedCallback } from "../utils/debounce";
import { getWindDirectionIcon } from "../utils/utils";

interface HeaderProps {
    location: Location;
    setLocation: (location: Location) => void;
    loadWeatherData: (lat: number, long: number, cityName?: string) => Promise<void>;
    weatherData: any;
    fetchCityCoordinates: (city: string) => Promise<{ lat: number; lon: number; displayName: string }>;
    formatCityName: (cityName: string) => string;
    formatDateTime: (timezone: string) => { date: string; time: string };
    getWeatherIcon: (weatherCode: number, precipitation: number, is_day: number) => string;
    getWeatherText: (weatherCode: number) => string;
    getWindDirectionIcon: (angle: number) => { direction: string; icon: string }; // Modification ici
}

export default function Header({ location, setLocation, loadWeatherData, weatherData, fetchCityCoordinates, formatCityName, formatDateTime, getWeatherIcon, getWeatherText }: HeaderProps) {
    const [error, setError] = useState<string | null>(null);
    const [citySearch, setCitySearch] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    const inputValueRef = useRef("");

    const debouncedSetCitySearch = useDebouncedCallback((value: string) => setCitySearch(value), 2000);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        inputValueRef.current = e.target.value; // Stocker dans la ref
        debouncedSetCitySearch(e.target.value); // Appeler debounce pour la recherche
    };

    const handleCitySearch = useCallback(async () => {
        const city = inputValueRef.current.trim();
        if (!city) {
            setError("Veuillez entrer une ville");
            return;
        }
        try {
            const { lat, lon, displayName } = await fetchCityCoordinates(city);
            await loadWeatherData(lat, lon, displayName);
        } catch (err) {
            setError("Ville introuvable");
        }
    }, [fetchCityCoordinates, loadWeatherData]);

    const handleGeolocation = useCallback(async () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        // Récupère le nom de la ville via l'API
                        const cityName = await fetchCityNameFromCoordinates(latitude, longitude);

                        // Mets à jour la localisation avec le nom de la ville
                        setLocation({
                            latitude,
                            longitude,
                            cityName,
                        });

                        // Charge les données météo
                        await loadWeatherData(latitude, longitude, cityName);
                    } catch (err) {
                        console.error("Erreur lors de la récupération du nom de la ville:", err);
                        setError("Impossible de déterminer la ville");
                    }
                },
                (error) => {
                    console.error("Erreur de géolocalisation:", error);
                    setError("Impossible de récupérer la localisation");
                }
            );
        } else {
            setError("Géolocalisation non supportée");
        }
    }, [setLocation, loadWeatherData, fetchCityNameFromCoordinates]);

    useEffect(() => {
        // On vérifie aussi qu'on n'a pas déjà une localisation pour éviter les flashs
        if (isFirstRender && !location.cityName && !location.latitude && !location.longitude) {
            handleGeolocation();
            setIsFirstRender(false);
        }
    }, [handleGeolocation, isFirstRender, location]);

    const getSunTimeForToday = (weatherData: any, sunEvent: any) => {
        if (!weatherData?.daily) {
            return null;
        }

        const today = new Date();
        const todayDate = today.toISOString().split("T")[0]; // Format de la date actuelle en "YYYY-MM-DD"

        const todayIndex = weatherData.daily.time.findIndex((date: string) => date === todayDate);

        if (todayIndex !== -1 && weatherData.daily[sunEvent][todayIndex]) {
            const sunTime = new Date(weatherData.daily[sunEvent][todayIndex]);
            const hours = sunTime.getHours().toString().padStart(2, "0");
            const minutes = sunTime.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        }

        return null;
    };
    const sunriseTimeToday = getSunTimeForToday(weatherData, "sunrise");
    const sunsetTimeToday = getSunTimeForToday(weatherData, "sunset");

    const { date, time } = formatDateTime(weatherData?.timezone);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-evenly p-4 gap-8  ">
            {/* Premier élément */}
            <div className="rounded-3xl p-3 flex flex-wrap flex-col w-full lg:w-auto gap-3 items-center text-center sm:text-left shadow-light dark:shadow-dark">
                <h1 className="text-4xl  font-bold"> {location.cityName ? formatCityName(location.cityName) : "Rechercher votre ville"} </h1>
                <div className="font-extrabold  text-4xl">{time}</div>
                <div className="flex flex-row gap-2 lg:gap-3 items-center justify-center">
                    <div className="font-bold">{date}</div>
                    {weatherData?.current?.is_day ? (
                        <div className=" fas fa-sun text-yellow-500 ">
                            <span className=" text-sm font-serif px-1.5">Jour</span>
                        </div>
                    ) : (
                        <div className=" fas fa-moon text-blue-700 ">
                            <span className=" text-sm font-serif px-1.5">Nuit</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Élement du milieu */}
            <div className="shadow-light dark:shadow-dark p-4 rounded-3xl  flex flex-col lg:flex-row gap-4">
                <div className="flex justify-evenly items-center gap-6 ">
                    <div className="text-center flex gap-3">
                        <i className={`fas ${getWeatherIcon(weatherData?.current?.weather_code, weatherData?.current?.precipitation, weatherData?.current?.is_day)} text-8xl mb-2 lg:text-9xl `}></i>

                        <div className="flex flex-col gap-1">
                            <div className="text-4xl font-extrabold lg:text-5xl">{weatherData?.current?.temperature_2m}°C</div>
                            <p className="font-bold italic ">{getWeatherText(weatherData?.current?.weather_code)}</p>
                        </div>
                    </div>
                </div>

                <div className=" flex flex-col gap-3 items-center justify-center text-center sm:flex-1">
                    {/* <h2 className="font-bold text-xl sm:text-2xl text-black">Conditions actuelles</h2> */}
                    <div className="flex flex-row w-full justify-evenly text-lg lg:text-base font-bold">
                        <div className="flex flex-col font-semibold">
                            {" "}
                            <img src="sunrise.png" alt="Lever du soleil" className="icon" />
                            <p>{sunriseTimeToday}</p>
                        </div>
                        <div className="flex flex-col font-semibold">
                            <img src="sunset.png" alt="Coucher du soleil" className="icon" />
                            <p> {sunsetTimeToday}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center text-lg lg:text-base font-bold">
                        <div>
                            <i className="fas fa-thermometer-half text-blue-500"></i> Ressenti {weatherData?.current?.apparent_temperature}°C
                        </div>
                        <div>
                            <i className="fas fa-wind text-gray-500"></i> {weatherData?.current?.wind_speed_10m} km/h
                        </div>
                        <div>
                            <i className={`fas fa-location-arrow text-cyan-300`} style={{ transform: `rotate(${getWindDirectionIcon(weatherData?.current?.wind_direction_10m)?.rotation}deg)` }} />{" "}
                            {getWindDirectionIcon(weatherData?.current?.wind_direction_10m)?.direction}
                        </div>

                        <div>
                            <i className="fas fa-tint text-blue-300"></i> {weatherData?.current?.relative_humidity_2m}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3  w-full lg:w-auto shadow-light dark:shadow-dark rounded-3xl p-4 ">
                <input
                    type="text"
                    defaultValue=""
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
                    placeholder="Rechercher une ville"
                    className="border bg-slate-200 rounded-lg px-4 py-2 w-3/4 lg:w-full sm:max-w-xs mb-2 dark:text-black"
                />

                <div className="flex gap-4">
                    <button onClick={() => handleCitySearch()} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto">
                        Rechercher
                    </button>
                    <button onClick={handleGeolocation} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full fas fa-location-dot text-2xl">
                        {" "}
                    </button>
                </div>
            </div>
        </div>
    );
}
