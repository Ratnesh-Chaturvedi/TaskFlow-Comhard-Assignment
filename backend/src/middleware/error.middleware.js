export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  // Use error's explicit statusCode, or current response status if not 200, else fallback to 500
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  // MongoDB connection / buffering error
  if (err.name === 'MongooseError' && err.message?.includes('buffering timed out')) {
    statusCode = 503;
    message = 'Database connection error: MongoDB Atlas is unreachable. Please verify your MongoDB Atlas Network Access allows connections from anywhere (0.0.0.0/0) and credentials in .env are correct.';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with specified identifier';
  }

  // Mongoose duplicate key error (MongoDB error code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    message = `An account with that ${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired, please log in again';
  }

  console.error(`[API Error ${statusCode}]`, err.message);

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors ? Object.keys(err.errors).map(k => ({ field: k, message: err.errors[k].message })) : []
  });
};

