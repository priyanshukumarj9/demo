//exports.handler = async (event) => {
//    // TODO implement
//    const response = {
//        statusCode: 200,
//        body: JSON.stringify('Hello from Lambda!'),
//    };
//    return response;
//};

const weatherSDK = require('/opt/weather-sdk'); // Import SDK from Lambda Layer

exports.handler = async (event) => {
    const path = event.rawPath || '/';
    const method = event.requestContext.http.method || 'GET';

    if (path === '/weather' && method === 'GET') {
        try {
            const forecast = await weatherSDK.getCurrentWeather();
            // Ensure `hourly` data is included in the response
            return {
                statusCode: 200,
                body: JSON.stringify({
                    latitude: forecast.latitude,
                    longitude: forecast.longitude,
                    generationtime_ms: forecast.generationtime_ms,
                    timezone: forecast.timezone,
                    elevation: forecast.elevation,
                    hourly_units: forecast.hourly_units,
                    hourly: forecast.hourly, // Include hourly data
                }),
                headers: {
                    'content-type': 'application/json',
                },
                isBase64Encoded: false,
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'Failed to fetch weather data',
                    error: error.message,
                }),
                headers: {
                    'content-type': 'application/json',
                },
                isBase64Encoded: false,
            };
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            statusCode: 400,
            message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`,
        }),
        headers: {
            'content-type': 'application/json',
        },
        isBase64Encoded: false,
    };
};