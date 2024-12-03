import React from "react";

interface WeatherCardProps {
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    temperature: number;
    description: string;
    high: number;
    low: number;
    wind: string;
    humidity: string;
    visibility: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ title, subtitle, icon, temperature, description, high, low, wind, humidity, visibility }) => {
    return (
        <div className=" flex items-center justify-center ">
            <div className="flex flex-col card p-4 w-full max-w-xs rounded-xl shadow-xl">
                <div className="font-bold text-xl">{title}</div>
                <div className="text-sm text-gray-500">{subtitle}</div>
                <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">{icon}</div>
                <div className="flex flex-row items-center justify-center mt-6">
                    <div className="font-medium text-6xl">{temperature}°</div>
                    <div className="flex flex-col items-center ml-6">
                        <div>{description}</div>
                        <div className="mt-1">
                            <span className="text-sm">↑</span>
                            <span className="text-sm font-light text-gray-500">{high}°C</span>
                        </div>
                        <div>
                            <span className="text-sm">↓</span>
                            <span className="text-sm font-light text-gray-500">{low}°C</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between mt-6">
                    <div className="flex flex-col items-center">
                        <div className="font-medium text-sm">Vent</div>
                        <div className="text-sm text-gray-500">{wind}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="font-medium text-sm">Humidité</div>
                        <div className="text-sm text-gray-500">{humidity}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="font-medium text-sm">Visibilité</div>
                        <div className="text-sm text-gray-500">{visibility}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
