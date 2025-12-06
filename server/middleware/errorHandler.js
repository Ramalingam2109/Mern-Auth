const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err.stack);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    // JWT authentication error
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    // File upload size limit error
    return res.status(413).json({
      success: false,
      message: 'File size too large'
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      field
    });
  }

  if (err.name === 'CastError') {
    // Mongoose invalid ID error
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID'
    });
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;