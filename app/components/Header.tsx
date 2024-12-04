import { useState, useCallback } from "react";
import { Location } from "../utils/types/weather";

interface HeaderProps {
    location: Location;
    setLocation: (location: Location) => void;
    loadWeatherData: (lat: number, long: number, cityName?: string) => Promise<void>;
    weatherData: any;
    fetchCityCoordinates: (city: string) => Promise<{ lat: number; lon: number; displayName: string }>;
    formatCityName: (cityName: string) => string;
    formatDateTime: () => string;
    getWeatherIcon: (weatherCode: number, precipitation: number) => string;
    getWeatherText: (weatherCode: number) => string;
}

export default function Header({ location, setLocation, loadWeatherData, weatherData, fetchCityCoordinates, formatCityName, formatDateTime, getWeatherIcon, getWeatherText }: HeaderProps) {
    const [error, setError] = useState<string | null>(null);
    const [citySearch, setCitySearch] = useState("");

    // Fonction de debounce réutilisable
    const debounce = (func: (...args: any[]) => void, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const handleInputChange = useCallback(
        debounce((value: string) => setCitySearch(value), 50),
        []
    );

    const handleCitySearch = async (city: string) => {
        if (!city.trim()) {
            setError("Veuillez entrer une ville");
            return;
        }
        try {
            const { lat, lon, displayName } = await fetchCityCoordinates(city);
            await loadWeatherData(lat, lon, displayName);
            setCitySearch("");
        } catch (err) {
            setError("Ville introuvable");
        }
    };

    const handleGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ ...location, latitude, longitude });
                    loadWeatherData(latitude, longitude);
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

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 gap-10 mb-6">
            {/* Premier élément */}
            <div className="card  rounded-3xl p-4 flex flex-col gap-3 items-center text-center sm:text-left sm:flex-1 ">
                <h1 className="text-2xl sm:text-3xl font-bold">{formatCityName(location.cityName)} || "Rechercher votre ville" </h1>
                <p className="font-bold">{formatDateTime()}</p>
            </div>
            <div className="card p-4 rounded-3xl">
                <div className="flex flex-col items-center ">
                    <i className={`fas ${getWeatherIcon(weatherData?.current?.weather_code, weatherData?.current?.precipitation)} text-7xl mb-2 `}></i>
                    <p className="font-bold">{getWeatherText(weatherData?.current?.weather_code)}</p>
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

            {/* Dernier élément */}
            <div className="flex flex-col items-center gap-3 sm:flex-1 card  rounded-3xl p-4 ">
                <input
                    type="text"
                    placeholder="Rechercher une ville"
                    value={citySearch}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCitySearch(citySearch)}
                    className="border bg-slate-200 rounded-lg px-4 py-2 w-full sm:max-w-xs mb-2"
                />
                <div className="flex gap-4">
                    <button onClick={() => handleCitySearch(citySearch)} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto">
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
