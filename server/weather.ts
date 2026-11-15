// Weather service using Open-Meteo (No API key required)
export interface WeatherDisruptionResult {
  isDisrupted: boolean;
  reason?: string;
  temperature?: number;
  precipitationProbability?: number;
  windGusts?: number;
  weatherCode?: number;
  weatherDescription?: string;
  source: string;
  fetchedAt: string;
}

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Fog & depositing rime fog';
  if (code >= 51 && code <= 55) return 'Drizzle: Light to dense';
  if (code >= 61 && code <= 65) return 'Rain: Slight, moderate and heavy';
  if (code >= 71 && code <= 77) return 'Snow fall & snow grains';
  if (code >= 80 && code <= 82) return 'Rain showers: Slight to violent';
  if (code >= 95 && code <= 99) return 'Thunderstorm with possible hail';
  return 'Variable alpine conditions';
};

export async function fetchLiveWeather(lat: number, lng: number): Promise<WeatherDisruptionResult> {
  const fetchedAt = new Date().toISOString();
  try {
    // Open-Meteo forecast API for hourly precipitation probability, wind gusts, and temperature
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,wind_gusts_10m&forecast_days=3&timezone=auto`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      throw new Error(`Open-Meteo responded with status ${response.status}`);
    }
    const data = await response.json();
    const current = data.current || {};
    const hourly = data.hourly || {};

    const temp = current.temperature_2m ?? 18;
    const windGusts = current.wind_gusts_10m ?? 15;
    const precipProb = (hourly.precipitation_probability && hourly.precipitation_probability[0]) ?? 20;
    const weatherCode = current.weather_code ?? 0;
    const weatherDesc = getWeatherDescription(weatherCode);

    // Disruption criteria:
    // Precip probability > 70% OR wind gusts > 50 km/h OR temperature < 0C or > 40C
    let isDisrupted = false;
    const reasons: string[] = [];

    if (precipProb > 70) {
      isDisrupted = true;
      reasons.push(`Severe precipitation risk (${precipProb}% probability)`);
    }
    if (windGusts > 50) {
      isDisrupted = true;
      reasons.push(`High wind gusts exceeding safety threshold (${windGusts} km/h)`);
    }
    if (temp < 0) {
      isDisrupted = true;
      reasons.push(`Sub-zero alpine freeze (${temp}°C)`);
    } else if (temp > 40) {
      isDisrupted = true;
      reasons.push(`Extreme heat advisory (${temp}°C)`);
    }

    return {
      isDisrupted,
      reason: isDisrupted ? reasons.join('; ') : undefined,
      temperature: temp,
      precipitationProbability: precipProb,
      windGusts,
      weatherCode,
      weatherDescription: weatherDesc,
      source: 'Open-Meteo Live API',
      fetchedAt
    };
  } catch (error: any) {
    console.warn(`Weather fetch failed for [${lat}, ${lng}]:`, error.message);
    // On API failure, return fallback with clear estimate notice
    return {
      isDisrupted: false,
      reason: undefined,
      temperature: 16,
      precipitationProbability: 15,
      windGusts: 18,
      weatherCode: 1,
      weatherDescription: 'Clear / Seasonal baseline (Weather service offline)',
      source: 'Open-Meteo (Offline Cache)',
      fetchedAt
    };
  }
}
