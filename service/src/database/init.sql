-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create parts table
CREATE TABLE IF NOT EXISTS parts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    brand VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES parts(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, part_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    part_id INTEGER REFERENCES parts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, part_id)
);

-- Insert sample data
INSERT INTO parts (name, title, brand, category, price, description, image) VALUES
('Engine Oil 5W-30', 'Synthetic Engine Oil', 'Mobil', 'Oils', 2500.00, 'Fully synthetic engine oil for modern engines', 'oil.jpg'),
('Air Filter', 'Premium Air Filter', 'Bosch', 'Filters', 1500.00, 'High-quality air filter for better engine performance', 'filter.jpg'),
('Brake Pads', 'Ceramic Brake Pads', 'Brembo', 'Brakes', 3500.00, 'Premium ceramic brake pads for better stopping power', 'brakes.jpg')
ON CONFLICT DO NOTHING; 