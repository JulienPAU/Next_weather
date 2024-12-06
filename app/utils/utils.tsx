import moment from "moment";
import "moment/locale/fr"; // Importez la locale française
import "moment/locale/en-gb"; // Importez la locale anglaise (britannique)
import "moment-timezone";

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
                return "fa-cloud-showers-heavy text-blue-500";
            }
            return "fa-cloud-rain text-gray-500";

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
            return "fa-cloud-bolt text-yellow-300";

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

export const formatDateTime = (timezone: string): string => {
    const time = moment().tz(timezone);

    // Vérifiez si le fuseau horaire est en France
    if (timezone.startsWith("Europe/Paris")) {
        time.locale("fr"); // Définir la locale sur "fr"
    } else {
        time.locale("en-gb"); // Définir la locale sur "en-gb" (anglais britannique)
    }

    const datePart = time.format("ddd D MMM YY");
    const timePart = time.format("HH:mm");
    return `${datePart} ${timePart}`;
};
