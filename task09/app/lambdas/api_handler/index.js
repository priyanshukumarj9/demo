//exports.handler = async (event) => {
//    // TODO implement
//    const response = {
//        statusCode: 200,
//        body: JSON.stringify('Hello from Lambda!'),
//    };
//    return response;
//};

const weatherSDK = require('/opt/weather-sdk'); // Import SDK from Lambda Layer

/**
 * Lambda function handler for weather API requests
 */
exports.handler = async (event) => {
    // Extract path and method from the request
    const path = event.rawPath || '/';
    const method = event.requestContext.http.method || 'GET';

    // Check if the request is targeting the `/weather` endpoint with GET method
    if (path === '/weather' && method === 'GET') {
        try {
            // Use weatherSDK to fetch data from Open-Meteo API
            const forecast = await weatherSDK.getCurrentWeather();
            return {
                statusCode: 200,
                body: JSON.stringify(forecast),
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

    // Return 400 Bad Request for unsupported paths or methods
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
