import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Wind, Droplets, AlertTriangle } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface WeatherWarning {
  phenomenon_id: string;
  color_id: number;
  begin_time: string;
  end_time: string;
}

export default function WeatherPanel() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    description: "Partiellement nuageux"
  });
  const [weatherWarnings, setWeatherWarnings] = useState<WeatherWarning[]>([]);

  useEffect(() => {
    const apiUrl = 'https://portail-api.meteofrance.fr/public/DPVigilance/v1';
    const apiKey = 'eyJ4NXQiOiJZV0kxTTJZNE1qWTNOemsyTkRZeU5XTTRPV014TXpjek1UVmhNbU14T1RSa09ETXlOVEE0Tnc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJNYXR0aXNAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJNYXR0aXMiLCJ0aWVyUXVvdGFUeXBlIjpudWxsLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6IkRlZmF1bHRBcHBsaWNhdGlvbiIsImlkIjoyMDA0OCwidXVpZCI6IjJjOWEyODRhLWQzNmItNGFmYS1hYTZmLTFmNmFjOTcyNGMyZCJ9LCJpc3MiOiJodHRwczpcL1wvcG9ydGFpbC1hcGkubWV0ZW9mcmFuY2UuZnI6NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsiNjBSZXFQYXJNaW4iOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6InNlYyJ9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJEb25uZWVzUHVibGlxdWVzVmlnaWxhbmNlIiwiY29udGV4dCI6IlwvcHVibGljXC9EUFZpZ2lsYW5jZVwvdjEiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiJ2MSIsInN1YnNjcmlwdGlvblRpZXIiOiI2MFJlcVBhck1pbiJ9XSwiZXhwIjoxODI1NTg2MzU0LCJ0b2tlbl90eXBlIjoiYXBpS2V5IiwiaWF0IjoxNzMwOTEzNTU0LCJqdGkiOiJjOWQ1ZGVlYS00MTQ4LTQzYTgtYjZlMi05ZDQxNmZiNDU0ZjgifQ==.lX-Uv1a8L5TRuPnDRVy_CvPnjAbTkLbk9fGgAebJ2h0s-Qknixu-PbdcRo18WJiZogkOMrbyt0Kfmx2Q9L-IZUEIKckOs4hcSi4CoqPp4Iz41bSdPjbf0Sd809ZwyRvfxKdlEprn2JMXJ9xndBYPxvu6JIX_30LMNQyx-mlOT14TftJzX-4uHEixa2cImfz_HmkGUK2c597Vq9uQ5mY7LUEX-07mZD7Q-DhUVGZ8OcaDSXtp5yc9sPN4xn_Hh3W26F9LzPBWuu1vtIcerH-GxTYcPKAdcIjsODd-iT5wOBUgh_RPRzy375OBcPX4eY_w3-oYFQZhvh8sRe8dIfUKWg==';

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'apikey': apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      const filteredWarnings = getFilteredWeatherWarnings(data);
      setWeatherWarnings(filteredWarnings);
    })
    .catch(error => {
      console.error('Error fetching weather warnings:', error);
    });
  }, []);

  const getFilteredWeatherWarnings = (data: any): WeatherWarning[] => {
    const weatherWarnings: WeatherWarning[] = [];

    const j1Section = data.product.periods.find((period: any) => period.echeance === "J1");

    if (j1Section) {
      const domain06 = j1Section.timelaps.domain_ids.find((domain: any) => domain.domain_id === "0610");

      if (domain06) {
        domain06.phenomenon_items.forEach((phenomenon: any) => {
          if (phenomenon.phenomenon_max_color_id > 1) {
            phenomenon.timelaps_items.forEach((timelaps: any) => {
              weatherWarnings.push({
                phenomenon_id: phenomenon.phenomenon_id,
                color_id: timelaps.color_id,
                begin_time: timelaps.begin_time,
                end_time: timelaps.end_time
              });
            });
          }
        });
      }
    }

    return weatherWarnings;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Cloud className="text-amber-500" />
        Météo locale
      </h2>
      
      <div className="space-y-4">
        {/* Weather data and metrics */}
        {/* ... */}

        {/* Weather warnings */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            Avertissements météorologiques
          </h3>
          {weatherWarnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 mb-2">
              <AlertTriangle className={`text-${warning.color_id === 2 ? 'amber-500' : 'red-500'} flex-shrink-0`} size={20} />
              <div>
                <p className="font-medium text-gray-800">Avertissement {warning.phenomenon_id}</p>
                <p className="text-sm text-gray-600">Du {new Date(warning.begin_time).toLocaleString()} au {new Date(warning.end_time).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getFilteredWeatherWarnings = (data: any): WeatherWarning[] => {
  const weatherWarnings: WeatherWarning[] = [];

  const j1Section = data.product.periods.find((period: any) => period.echeance === "J1");

  if (j1Section) {
    const domain06 = j1Section.timelaps.domain_ids.find((domain: any) => domain.domain_id === "0610");

    if (domain06) {
      domain06.phenomenon_items.forEach((phenomenon: any) => {
        if (phenomenon.phenomenon_max_color_id > 1) {
          phenomenon.timelaps_items.forEach((timelaps: any) => {
            weatherWarnings.push({
              phenomenon_id: phenomenon.phenomenon_id,
              color_id: timelaps.color_id,
              begin_time: timelaps.begin_time,
              end_time: timelaps.end_time
            });
          });
        }
      });
    }
  }

  return weatherWarnings;
};