import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRequest, AuthResponse, User } from '../types';
import database from '../utils/database';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse | null> {
    try {
      const user = await database.findUserByUsername(credentials.username);
      
      if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return null;
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  verifyToken(token: string): { userId: string; username: string } | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();