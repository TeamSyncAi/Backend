export function errorHandler(err, req, res, next) {
    console.error(`Error occurred: ${err.message}`);
    
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message, errors: err.errors });
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404).json({ error: 'Invalid ID' });
    } else if (err.code && err.code === 11000) {
        res.status(409).json({ error: 'Duplicate key error', field: err.keyValue });
    } else if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized', details: err.code });
    } else if (err.message) {
        res.status(500).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export function notFoundError(req, res, next) {
    console.error(`Not Found: ${req.originalUrl}`);
    res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
}