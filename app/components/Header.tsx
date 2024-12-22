import { useState, useCallback, useRef } from "react";
import { Location } from "../utils/types/weather";
import { fetchCityNameFromCoordinates } from "../utils/api";
import { useDebouncedCallback } from "../utils/debounce";

interface HeaderProps {
    location: Location;
    setLocation: (location: Location) => void;
    loadWeatherData: (lat: number, long: number, cityName?: string) => Promise<void>;
    weatherData: any;
    fetchCityCoordinates: (city: string) => Promise<{ lat: number; lon: number; displayName: string }>;
    formatCityName: (cityName: string) => string;
    formatDateTime: (timezone: string) => string;
    getWeatherIcon: (weatherCode: number, precipitation: number, is_day: number) => string;
    getWeatherText: (weatherCode: number) => string;
}

export default function Header({ location, setLocation, loadWeatherData, weatherData, fetchCityCoordinates, formatCityName, formatDateTime, getWeatherIcon, getWeatherText }: HeaderProps) {
    const [error, setError] = useState<string | null>(null);
    const [citySearch, setCitySearch] = useState("");
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

    const handleGeolocation = async () => {
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
    };

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

    const [isDark, setIsDark] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 gap-10 border-b-4 ">
            {/* Premier élément */}
            <div className="rounded-3xl p-4 flex flex-wrap flex-col gap-3 items-center text-center sm:text-left sm:flex-1 shadow-light dark:shadow-dark">
                <div className="flex flex-col justify-center items-center gap-2 lg:gap-3 lg:flex-row lg:items-start  ">
                    <h1 className="text-4xl  font-bold"> {location.cityName ? formatCityName(location.cityName) : "Rechercher votre ville"} </h1>
                    <div className="">
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
                <div className="font-bold">{formatDateTime(weatherData?.timezone)}</div>
            </div>
            <div className="shadow-light dark:shadow-dark p-4 rounded-3xl mb-2">
                <div className="flex justify-evenly items-center ">
                    <div className="flex flex-col font-semibold">
                        {" "}
                        <img src="sunrise.png" alt="Lever du soleil" className="icon" />
                        <p>{sunriseTimeToday}</p>
                    </div>
                    <div className="text-center">
                        <i className={`fas ${getWeatherIcon(weatherData?.current?.weather_code, weatherData?.current?.precipitation, weatherData?.current?.is_day)} text-7xl mb-2 `}></i>
                        <p className="font-bold ">{getWeatherText(weatherData?.current?.weather_code)}</p>
                    </div>
                    <div className="flex flex-col font-semibold">
                        <img src="sunset.png" alt="Coucher du soleil" className="icon" />
                        <p> {sunsetTimeToday}</p>
                    </div>
                </div>
                {/* Élement du milieu */}
                <div className="p-4 flex flex-col gap-3 items-center justify-center text-center sm:flex-1">
                    {/* <h2 className="font-bold text-xl sm:text-2xl text-black">Conditions actuelles</h2> */}
                    <div className="flex flex-wrap gap-4 justify-center text-lg lg:text-base font-bold">
                        <div>
                            <i className="fas fa-thermometer-half text-blue-500"></i> {weatherData?.current?.temperature_2m}°C
                        </div>
                        <div>
                            <i className="fas fa-thermometer-half text-blue-500"></i> Ressenti {weatherData?.current?.apparent_temperature}°C
                        </div>
                        <div>
                            <i className="fas fa-wind text-gray-500"></i> {weatherData?.current?.wind_speed_10m} km/h
                        </div>

                        <div>
                            <i className="fas fa-tint text-blue-300"></i> {weatherData?.current?.relative_humidity_2m}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-1 shadow-light dark:shadow-dark rounded-3xl p-4 ">
                <input
                    type="text"
                    defaultValue=""
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
                    placeholder="Rechercher une ville"
                    className="border bg-slate-200 rounded-lg px-4 py-2 w-full sm:max-w-xs mb-2"
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
