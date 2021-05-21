import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Session invalid');
    }
  }
};

export default getUser;
