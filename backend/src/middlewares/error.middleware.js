import { AppError } from '../utils/AppError.js';

export const globalErrorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  
  console.error('ERROR :', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
