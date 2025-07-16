import { Pool, PoolClient } from 'pg';
import { FruitRecord, User, PaginatedResponse } from '../types';

class PostgreSQLDatabase {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      database: process.env.DB_NAME || 'fruit_management',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'admin123',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      console.log('✅ Database connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT id, username, password, created_at as "createdAt" FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async getAllFruits(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<FruitRecord>> {
    const client = await this.pool.connect();
    try {
      let whereClause = '';
      const params: any[] = [];

      if (search) {
        whereClause = `WHERE 
          product_name ILIKE $1 OR 
          color ILIKE $1 OR 
          date::text ILIKE $1`;
        params.push(`%${search}%`);
      }

      // Count total records
      const countQuery = `SELECT COUNT(*) FROM fruits ${whereClause}`;
      const countResult = await client.query(countQuery, search ? [`%${search}%`] : []);
      const total = parseInt(countResult.rows[0].count);

      // Calculate grand total
      const grandTotalQuery = `SELECT SUM(total) as grand_total FROM fruits ${whereClause}`;
      const grandTotalResult = await client.query(grandTotalQuery, search ? [`%${search}%`] : []);
      const grandTotal = parseFloat(grandTotalResult.rows[0].grand_total) || 0;

      // Get paginated data
      const offset = (page - 1) * limit;
      const dataQuery = `
        SELECT 
          id,
          date,
          product_name as "productName",
          color,
          amount,
          unit,
          total,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM fruits
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
      
      params.push(limit, offset);
      const dataResult = await client.query(dataQuery, params);

      return {
        data: dataResult.rows,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        grandTotal
      };
    } finally {
      client.release();
    }
  }

  async createFruit(fruitData: Omit<FruitRecord, 'id' | 'total' | 'createdAt' | 'updatedAt'>): Promise<FruitRecord> {
    const client = await this.pool.connect();
    try {
      const total = fruitData.amount * fruitData.unit;
      
      const result = await client.query(`
        INSERT INTO fruits (date, product_name, color, amount, unit, total)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING 
          id,
          date,
          product_name as "productName",
          color,
          amount,
          unit,
          total,
          created_at as "createdAt",
          updated_at as "updatedAt"
      `, [fruitData.date, fruitData.productName, fruitData.color, fruitData.amount, fruitData.unit, total]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

    async updateFruit(id: string, updates: Partial<FruitRecord>): Promise<FruitRecord | null> {
  const client = await this.pool.connect();
  try {
    // Step 1: ดึงข้อมูลปัจจุบัน
    const currentResult = await client.query(
      'SELECT amount, unit FROM fruits WHERE id = $1',
      [id]
    );
    
    if (currentResult.rows.length === 0) {
      return null;
    }
    
    const currentData = currentResult.rows[0];
    
    // Step 2: คำนวณค่าใหม่
    const newAmount = updates.amount !== undefined ? updates.amount : currentData.amount;
    const newUnit = updates.unit !== undefined ? updates.unit : currentData.unit;
    const newTotal = newAmount * newUnit;
    
    // Step 3: เตรียม SQL สำหรับ update
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // เพิ่มฟิลด์ที่ต้องการอัปเดต
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'total' && value !== undefined) {
        const dbKey = key === 'productName' ? 'product_name' : key;
        setClause.push(`${dbKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    // เพิ่ม total ที่คำนวณใหม่
    setClause.push(`total = $${paramIndex}`);
    values.push(newTotal);
    paramIndex++;

    // เพิ่ม updated_at
    setClause.push(`updated_at = CURRENT_TIMESTAMP`);

    // Step 4: Execute update
    const query = `
      UPDATE fruits 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        date,
        product_name as "productName",
        color,
        amount,
        unit,
        total,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    
    values.push(id);
    console.log('🔧 Update Query:', query);
    console.log('🔧 Update Values:', values);
    
    const result = await client.query(query, values);
    
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

    async deleteFruit(id: string): Promise<boolean> {
      const client = await this.pool.connect();
      try {
        const result = await client.query('DELETE FROM fruits WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
      } finally {
        client.release();
      }
    }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export default new PostgreSQLDatabase();