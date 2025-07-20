import { FruitRecord, CreateFruitRequest, UpdateFruitRequest, PaginatedResponse } from '../types';
import database from '../utils/database';

export class FruitService {
  private validFruits = [
    'Banana', 'Cherry', 'Apple', 'Orange', 'Watermelon',
    'Mango', 'Grapes', 'Strawberry', 'Peach', 'Pineapple'
  ];

  private fruitColors: Record<string, string[]> = {
    'Banana': ['Yellow'],
    'Cherry': ['Red'],
    'Apple': ['Red', 'Green'],
    'Orange': ['Orange'],
    'Watermelon': ['Green'],
    'Mango': ['Yellow', 'Orange'],
    'Grapes': ['Purple', 'Green'],
    'Strawberry': ['Red', 'Pink'],
    'Peach': ['Pink', 'Orange'],
    'Pineapple': ['Yellow', 'Brown']
  };

  async getAllFruits(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<FruitRecord>> {
    return await database.getAllFruits(page, limit, search);
  }

  async createFruit(fruitData: CreateFruitRequest): Promise<FruitRecord> {
    this.validateFruit(fruitData);
    
    const newFruit = {
      date: fruitData.date,
      productName: fruitData.productName,
      color: fruitData.color,
      amount: fruitData.amount,
      unit: fruitData.unit
    };

    return await database.createFruit(newFruit);
  }

  async updateFruit(id: string, updates: UpdateFruitRequest): Promise<FruitRecord | null> {
    if (Object.keys(updates).length > 0) {
      this.validateFruit(updates);
    }
    
    return await database.updateFruit(id, updates);
  }

  async deleteFruit(id: string): Promise<boolean> {
    return await database.deleteFruit(id);
  }

  private validateFruit(fruit: Partial<FruitRecord>): void {
    if (fruit.productName && !this.validFruits.includes(fruit.productName)) {
      throw new Error(`Invalid fruit: ${fruit.productName}. Valid fruits: ${this.validFruits.join(', ')}`);
    }

    // if (fruit.productName && fruit.color && 
    //     !this.fruitColors[fruit.productName]?.includes(fruit.color)) {
    //   throw new Error(`Invalid color ${fruit.color} for fruit ${fruit.productName}. Valid colors: ${this.fruitColors[fruit.productName]?.join(', ')}`);
    // }

    if (fruit.amount && fruit.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (fruit.unit && fruit.unit <= 0) {
      throw new Error('Unit must be greater than 0');
    }

    // if (fruit.date && !this.isValidDate(fruit.date)) {
    //   throw new Error('Invalid date format. Use DD-MM-YYYY');
    // }
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  getValidFruits(): string[] {
    return this.validFruits;
  }

  getColorsForFruit(fruitName: string): string[] {
    return this.fruitColors[fruitName] || [];
  }
}

export default new FruitService();