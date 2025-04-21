import jwt from 'jsonwebtoken';

//  access token
export const generateAccessToken = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key_12345';
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role?.toLowerCase() || 'user',
    },
    JWT_SECRET,
    { expiresIn: '2h' } 
  );
};

// refresh token
export const generateRefreshToken = (user) => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'my_refresh_secret_key_54321';
  
  return jwt.sign(
    { id: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } 
  );
};
//verification
export const verifyAccessToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key_12345';
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token) => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'my_refresh_secret_key_54321';
  
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
