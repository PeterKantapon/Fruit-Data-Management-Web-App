-- ===================================
-- FRUIT MANAGEMENT DATABASE SETUP
-- ===================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create fruits table
CREATE TABLE IF NOT EXISTS fruits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  amount DECIMAL(10,6) NOT NULL,
  unit INTEGER NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT INTO users (username, password) 
VALUES ('admin', '$2b$10$v.uUQ/5XuWu.5G1msh9hXuP6ecrC300RQNFFFHL5MozNreApJu4he')
ON CONFLICT (username) DO NOTHING;

-- Insert sample data
INSERT INTO fruits (date, product_name, color, amount, unit, total) VALUES
('2024-11-20', 'Banana', 'Yellow', 51.763838, 3, 155.29),
('2024-11-18', 'Cherry', 'Red', 48.64937, 13, 632.44),
('2024-11-23', 'Apple', 'Red', 52.244486, 4, 208.98),
('2024-12-01', 'Orange', 'Orange', 13.487048, 19, 256.25),
('2024-11-04', 'Banana', 'Yellow', 43.95729, 17, 747.27)
ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Database setup completed!' as status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as fruit_count FROM fruits;