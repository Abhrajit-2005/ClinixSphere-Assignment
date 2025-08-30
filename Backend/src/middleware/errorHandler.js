export function notFound(_req, _res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
}

export function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const isProd = process.env.NODE_ENV === 'production';
    const payload = { message: err.message || 'Server error' };

    if (!isProd && err.stack) {
        payload.stack = err.stack;
    }

    res.status(status).json(payload);
}
