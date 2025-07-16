import { Request, Response } from 'express';
import fruitService from '../services/fruitService';
import { CreateFruitRequest, UpdateFruitRequest } from '../types';

export class FruitController {
  async getAllFruits(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await fruitService.getAllFruits(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error('Get fruits error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createFruit(req: Request, res: Response): Promise<void> {
    try {
      const fruitData: CreateFruitRequest = req.body;
      
      const result = await fruitService.createFruit(fruitData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Create fruit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  }

  async updateFruit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateFruitRequest = req.body;
      
      const result = await fruitService.updateFruit(id, updates);
      
      if (!result) {
        res.status(404).json({ error: 'Fruit not found' });
        return;
      }
      
      res.json(result);
    } catch (error) {
      console.error('Update fruit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: errorMessage });
    }
  }

  async deleteFruit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const result = await fruitService.deleteFruit(id);
      
      if (!result) {
        res.status(404).json({ error: 'Fruit not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Delete fruit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getValidFruits(req: Request, res: Response): Promise<void> {
    try {
      const fruits = fruitService.getValidFruits();
      res.json({ fruits });
    } catch (error) {
      console.error('Get valid fruits error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getColorsForFruit(req: Request, res: Response): Promise<void> {
    try {
      const { fruitName } = req.params;
      const colors = fruitService.getColorsForFruit(fruitName);
      res.json({ colors });
    } catch (error) {
      console.error('Get colors error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new FruitController();