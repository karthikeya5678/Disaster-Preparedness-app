/**
 * A centralized error handling middleware.
 * Catches errors from route handlers and sends a standardized JSON error response.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error('An error occurred:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred on the server.';

    // Send a structured error response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

module.exports = errorHandler;