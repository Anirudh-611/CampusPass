import { AppError } from '../utils/customError.js';

/**
 * Restricts route access to specified roles (e.g. restrictTo('admin')).
 * Must be executed AFTER the protect auth middleware.
 *
 * @param  {...string} roles - Authorized roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Access forbidden: You do not have the required administrative permissions to perform this action.',
          403
        )
      );
    }
    next();
  };
};

