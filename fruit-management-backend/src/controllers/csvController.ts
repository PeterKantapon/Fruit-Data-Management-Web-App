import { Request, Response } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { PostgreSQLDatabase } from '../utils/database';

const database = new PostgreSQLDatabase();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadMiddleware = upload.single('csvFile');

export const importCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    console.log(`📁 Processing CSV file: ${req.file.filename}`);

    // Read CSV file
    const filePath = req.file.path;
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    console.log('📊 CSV Headers:', headers);
    console.log(`📊 Total rows: ${lines.length - 1}`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',');
        
        if (values.length !== 5) {
          errors.push(`Row ${i}: Invalid number of columns (${values.length})`);
          errorCount++;
          continue;
        }

        const [date, productName, color, amountStr, unitStr] = values;
        
        // Validate and convert data
        const amount = parseFloat(amountStr);
        const unit = parseInt(unitStr);
        
        if (isNaN(amount) || isNaN(unit)) {
          errors.push(`Row ${i}: Invalid amount or unit values`);
          errorCount++;
          continue;
        }

        // Format date if needed (dd/mm/yyyy to yyyy-mm-dd)
        let formattedDate = date;
        if (date.includes('/')) {
          const parts = date.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }

        // Insert into database
        await database.createFruit({
          date: formattedDate,
          productName: productName.trim(),
          color: color.trim(),
          amount,
          unit,
        });

        successCount++;
      } catch (error) {
        console.error(`Error processing row ${i}:`, error);
        errors.push(`Row ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        errorCount++;
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Return results
    res.json({
      message: 'CSV import completed',
      totalRows: lines.length - 1,
      successCount,
      errorCount,
      errors: errors.slice(0, 10), // Return first 10 errors
    });

    console.log(`✅ CSV Import completed: ${successCount} success, ${errorCount} errors`);

  } catch (error) {
    console.error('💥 CSV import error:', error);
    
    // Clean up file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({ 
      error: 'CSV import failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
