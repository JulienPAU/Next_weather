import React from "react";

interface WeatherCardProps {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    temperature?: number;
    description: string;
    high?: number;
    low?: number;
    wind: number;
    humidity?: number;
    visibility?: number;
    time: string;
    precipitation?: number;
    cardStyle?: string;
    temperature_apparent?: number;
    sunrise?: string;
    sunset?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ title, subtitle, icon, temperature, description, high, low, wind, humidity, visibility, time, precipitation, temperature_apparent, sunrise, sunset, cardStyle = "bg-white" }) => {
    return (
        <div className={`${cardStyle}   bg-slate-200 rounded-xl mx-5 lg:mx-0  mb-5 lg:mb-3 gap-5 items-center align-middle shadow-md shadow-gray-300  dark:shadow-gray-700 dark:bg-slate-900  border-2 border-gray-300 dark:border-gray-700`}>
            <div className="text-center ">
                <div className="flex justify-evenly items-center ">
                    <div className="font-bold text-lg ">{time}</div>

                    <div className="font-bold  ">{description}</div>
                </div>
                <div className="flex justify-evenly items-center font-bold my-2 ">
                    <i className={`${icon} fas text-6xl mb-2`}></i>
                    {high ? (
                        <div className="flex flex-col gap-2">
                            <div>
                                <i className="fas fa-thermometer-half text-blue-500 mr-2"></i>
                                Max {high}°C
                            </div>
                            <div>
                                <i className="fas fa-thermometer-half text-blue-500 mr-2"></i>
                                Min {low}°C`
                            </div>
                        </div>
                    ) : (
                        <div className="text-3xl">{temperature} °C</div>
                    )}
                </div>
                {temperature_apparent !== null && temperature_apparent !== undefined ? (
                    <div className="font-semibold italic">
                        <i className="fas fa-thermometer-half text-blue-500 mr-2 "></i>
                        Ressenti {temperature_apparent}°C
                    </div>
                ) : null}
            </div>
            <div className="font-semibold">
                {/* 

                <div>
                    <i className="fas fa-wind text-gray-500"></i> {wind} km/h
                </div>
                {visibility ? (
                    <div>
                        <i className="fas fa-tint text-blue-300"></i> {humidity}%
                    </div>
                ) : null} */}

                {sunrise && sunset ? (
                    <div className="flex justify-evenly items-center">
                        <div className="flex gap-1">
                            <img src="sunrise.png" alt="Lever du soleil" className="icon-small" /> {sunrise}
                        </div>
                        <div className="flex  gap-1">
                            <img src="sunset.png" alt="Coucher du soleil" className="icon-small" />
                            {sunset}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default React.memo(WeatherCard);

{
    /* 


<div className="mt-4 text-center">
<div className="text-sm text-gray-500">Précipitations</div>
<div className="font-bold text-lg">{precipitation} mm</div>
</div> */
}

{
    /* <div className="mt-4 grid grid-cols-2 gap-4">
<div className="text-center">
    <div className="text-sm text-gray-500">Max</div>
    <div className="font-bold text-lg">{high}°C</div>
</div>
<div className="text-center">
    <div className="text-sm text-gray-500">Min</div>
    <div className="font-bold text-lg">{low}°C</div>
</div>
</div> */
}
