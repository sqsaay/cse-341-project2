const notFound = (req, res) => {
    return res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
};

const handleError = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = Number(err.statusCode || err.status);
    const isClientError = statusCode >= 400 && statusCode < 500;
    const status = isClientError ? statusCode : 500;
    const message = err.type === 'entity.parse.failed'
        ? 'Request body contains invalid JSON'
        : isClientError
            ? err.message
            : 'Internal server error';

    if (status === 500) {
        console.error(err);
    }

    return res.status(status).json({ message });
};

module.exports = {
    notFound,
    handleError
};