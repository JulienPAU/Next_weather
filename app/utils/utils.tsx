export const getWeatherIcon = (weatherCode: number, precipitation: number) => {
    // Codes de conditions météo selon WMO (Organisation Météorologique Mondiale)
    switch (true) {
        // Ciel dégagé
        case weatherCode === 0 || weatherCode === 1:
            return "fa-sun text-yellow-500";

        // Partiellement nuageux
        case weatherCode === 2:
            return "fa-cloud-sun text-yellow-900";

        // Nuageux
        case weatherCode === 3:
            return "fa-cloud text-gray-300";

        // Brouillard et brume
        case weatherCode >= 45 && weatherCode <= 49:
            return "fa-smog text-gray-400";

        // Bruine
        case weatherCode >= 50 && weatherCode <= 59:
            return "fa-cloud-rain text-gray-400";

        // Pluies
        case weatherCode >= 60 && weatherCode <= 69:
            if (precipitation > 5) {
                return "fa-cloud-showers-heavy text-blue-500";
            }
            return "fa-cloud-rain text-gray-400";

        // Gel
        case weatherCode >= 80 && weatherCode <= 84:
            return "fa-icicles text-blue-300";

        // Neige
        case weatherCode >= 70 && weatherCode <= 79:
            return "fa-snowflake text-white";

        // Orages
        case weatherCode >= 95 && weatherCode <= 99:
            return "fa-bolt text-yellow-300";

        // Par défaut
        default:
            return "fa-question text-gray-500";
    }
};

export const getWeatherText = (weatherCode: number): string => {
    switch (true) {
        case weatherCode === 0 || weatherCode === 1:
            return "Clair";
        case weatherCode === 2:
            return "Nuageux";
        case weatherCode === 3:
            return "Couvert";
        case weatherCode >= 45 && weatherCode <= 49:
            return "Brouillard";
        case weatherCode >= 50 && weatherCode <= 59:
            return "Bruine";
        case weatherCode >= 60 && weatherCode <= 69:
            return "Pluie";
        case weatherCode >= 70 && weatherCode <= 79:
            return "Neige";
        case weatherCode >= 80 && weatherCode <= 84:
            return "Averses";
        case weatherCode === 85 || weatherCode === 86:
            return "Averses de neige";
        case weatherCode >= 95 && weatherCode <= 99:
            return "Orage";
        default:
            return "Conditions inconnues";
    }
};

export const formatCityName = (fullName: string): string => {
    return fullName ? fullName.split(",")[0].trim() : "";
};

export const getCurrentHourIndex = (hourlyTimes: string[]): number => {
    const now = new Date();
    return hourlyTimes.findIndex((time) => {
        const forecastTime = new Date(time);
        return forecastTime.getFullYear() === now.getFullYear() && forecastTime.getMonth() === now.getMonth() && forecastTime.getDate() === now.getDate() && forecastTime.getHours() === now.getHours();
    });
};

export const formatDateTime = (): string => {
    const time = new Date();
    return time.toLocaleString("fr-FR", {
        weekday: "short",
        year: "2-digit",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};
