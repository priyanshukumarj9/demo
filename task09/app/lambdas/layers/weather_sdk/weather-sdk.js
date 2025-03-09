const https = require('https');

/**
 * Fetch the current weather forecast using the Open-Meteo API.
 */
const getCurrentWeather = async () => {
    return new Promise((resolve, reject) => {
        // Open-Meteo API endpoint
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=50.4375&longitude=30.5&hourly=temperature_2m';

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
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
};

// Export function for use in the main Lambda
module.exports = {
    getCurrentWeather,
};