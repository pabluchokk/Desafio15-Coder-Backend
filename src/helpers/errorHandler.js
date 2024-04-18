function customErrorHandler(error, req, res, next) {
    console.error(error.stack);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'Error en producción' : error.stack,
    });
}

export default customErrorHandler;
