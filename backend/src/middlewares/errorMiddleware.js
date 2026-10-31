const notFound = (req, res, next) => next(Object.assign(new Error('Resource not found'), { statusCode: 404 }));

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal server error';
  if (err.name === 'CastError') { statusCode = 400; message = 'Invalid resource identifier'; }
  if (err.code === 11000) { statusCode = 409; message = 'A record with this value already exists'; }
  if (err.name === 'ValidationError') { statusCode = 400; message = Object.values(err.errors).map((item) => item.message).join(', '); }
  if (err.type === 'entity.too.large') { statusCode = 413; message = 'Request body is too large'; }
  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
