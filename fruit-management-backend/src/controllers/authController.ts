import { Request, Response } from 'express';
import authService from '../services/authService';
import { LoginRequest } from '../types';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password }: LoginRequest = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const result = await authService.login({ username, password });

      if (!result) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async me(req: Request & { user?: any }, res: Response): Promise<void> {
    try {
      res.json({ user: req.user });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AuthController();