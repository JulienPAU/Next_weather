import React from "react";

interface WeatherCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  temperature: number;
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
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  title,
  subtitle,
  icon,
  temperature,
  description,
  high,
  low,
  wind,
  humidity,
  visibility,
  time,
  precipitation,
  temperature_apparent,
  cardStyle = "bg-white",
}) => {
  return (
    <div className={`${cardStyle} w-1/3 lg:w-1/6 `}>
      <div className="font-bold mb-3">{time}</div>
      <i className={`${icon} fas text-4xl mb-2`}></i>
      <p>{description}</p>

      {high ? (
        <>
          <div>
            <i className="fas fa-thermometer-half text-blue-500 mr-2"></i>
            max {high}°C
          </div>
          <div>
            <i className="fas fa-thermometer-half text-blue-500 mr-2"></i>
            min {low}°C`
          </div>
        </>
      ) : (
        <div>
          <i className="fas fa-thermometer-half text-blue-500 mr-2"></i>
          {temperature} °C
        </div>
      )}

      {temperature_apparent !== null && temperature_apparent !== undefined ? (
        <div>
          <i className="fas fa-thermometer-half text-blue-500 mr-2"></i>
          Ressenti {temperature_apparent}°C
        </div>
      ) : null}

      <div>
        <i className="fas fa-wind text-gray-500"></i> {wind} km/h
      </div>
      {visibility ? (
        <div>
          <i className="fas fa-tint text-blue-300"></i> {humidity}%
        </div>
      ) : null}
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
