import jwt from 'jsonwebtoken';

/**
 * Signs a stateless JSON Web Token (JWT) with user identity claims.
 *
 * @param {Object} user - Mongoose User document
 * @returns {string} Signed JWT string
 */
export const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'campuspass_super_secure_jwt_secret_key_2026_dev_mode',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

