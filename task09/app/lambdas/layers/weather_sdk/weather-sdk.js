const https = require('https');

/**
 * Fetch the current weather forecast using the Open-Meteo API.
 */
const getCurrentWeather = async () => {
    return new Promise((resolve, reject) => {
        // Open-Meteo API endpoint
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=50.4375&longitude=30.5&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';

        https.get(url, (response) => {
            let data = '';
            // Concatenate response chunks
            response.on('data', (chunk) => {
                data += chunk;
            });

            // Handle complete response
            response.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result); // Return full Open-Meteo API response
                } catch (err) {
                    reject(err); // Handle error in response parsing
                }
            });
        }).on('error', (err) => {
            reject(err); // Handle HTTP errors
        });
    });
};

// Export function for use in main Lambda
module.exports = {
    getCurrentWeather,
};