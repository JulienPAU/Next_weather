import moment from "moment";
import "moment/locale/fr"; // Importez la locale française
import "moment/locale/en-gb"; // Importez la locale anglaise (britannique)
import "moment-timezone";

export const getWeatherIcon = (weatherCode: number, precipitation: number, is_day: number) => {
    // Codes de conditions météo selon WMO (Organisation Météorologique Mondiale)
    switch (true) {
        // Ciel dégagé
        case weatherCode === 0 || weatherCode === 1:
            return is_day ? "fa-sun text-yellow-500" : "fa-moon text-blue-500";

        // Partiellement nuageux
        case weatherCode === 2:
            return is_day ? "fa fa-cloud-sun inset-0 text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-gray-500" : "fa-cloud-moon  inset-0 text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-gray-700";

        // Nuageux
        case weatherCode === 3:
            return "fa-cloud text-gray-600";

        // Brouillard et brume
        case weatherCode >= 45 && weatherCode <= 49:
            return "fa-smog text-gray-400";

        // Bruine
        case weatherCode >= 50 && weatherCode <= 59:
            return "fa-cloud-rain text-gray-400";

        // Pluies
        case weatherCode >= 60 && weatherCode <= 69:
            if (precipitation > 5) {
                return "fa-cloud-showers-heavy text-blue-800";
            }
            return "fa-cloud-rain text-blue-600";

        // Gel
        case weatherCode >= 80 && weatherCode <= 84:
            return "fa-icicles text-blue-400";

        // Neige
        case weatherCode >= 70 && weatherCode <= 79:
            return "fa-snowflake text-white";

        // Averses de neige
        case weatherCode === 85 || weatherCode === 86:
            return " fa-snowflake  text-blue-300";

        // Orages
        case weatherCode >= 95 && weatherCode <= 99:
            return "fa-cloud-bolt sun inset-0 text-transparent bg-clip-text bg-gradient-to-t from-yellow-500 to-gray-500";

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
            return "Gel";
        case weatherCode === 85 || weatherCode === 86:
            return "Pluie / Neige";
        case weatherCode >= 95 && weatherCode <= 99:
            return "Orage";
        default:
            return "Conditions inconnues";
    }
};

export const formatCityName = (fullName: string): string => {
    return fullName ? fullName.split(",")[0].trim() : "";
};

export const getWindDirectionIcon = (angle: number): { direction: string; icon: string; rotation: number } => {
    const normalizedAngle = angle % 360;

    // Pour obtenir la direction cardinale
    const sector = Math.floor(((normalizedAngle + 22.5) % 360) / 45);
    const directions = ["Nord", "Nord-est", "Est", "Sud-Est", "Sud", "Sud-Ouest", "Ouest", "Nord-Ouest"];

    return {
        direction: directions[sector],
        icon: "fa-location-arrow",
        rotation: normalizedAngle - 45, // -45 car l'icône pointe par défaut vers le nord-est
    };
};
export const getCurrentHourIndex = (hourlyTimes: string[]): number => {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();
    const currentDate = now.getUTCDate();
    const currentHour = now.getUTCHours();

    return hourlyTimes.findIndex((time) => {
        const forecastTime = new Date(time + "Z"); // Conversion en UTC
        return forecastTime.getUTCFullYear() === currentYear && forecastTime.getUTCMonth() === currentMonth && forecastTime.getUTCDate() === currentDate && forecastTime.getUTCHours() === currentHour;
    });
};

export const getCurrentDayIndex = (dailyTimes: string[]): number => {
    const now = new Date();
    return dailyTimes.findIndex((time) => {
        const forecastDate = new Date(time);
        return forecastDate.getFullYear() === now.getFullYear() && forecastDate.getMonth() === now.getMonth() && forecastDate.getDate() === now.getDate();
    });
};

export const formatDateTime = (timezone: string): { date: string; time: string } => {
    const time = moment().tz(timezone);

    // Vérifiez si le fuseau horaire est en France
    if (timezone.startsWith("Europe/Paris")) {
        time.locale("fr"); // Définir la locale sur "fr"
    } else {
        time.locale("en-gb"); // Définir la locale sur "en-gb" (anglais britannique)
    }

    const datePart = time.format("dddd D MMMM");
    const timePart = time.format("HH : mm");
    return { date: datePart, time: timePart };
};
