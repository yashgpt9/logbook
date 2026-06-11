const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function setupAuth() {
  try {
    console.log('Creating users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'operator') NOT NULL DEFAULT 'operator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Checking for existing users...');
    const [rows] = await pool.query('SELECT * FROM users');
    
    if (rows.length === 0) {
      console.log('Seeding default users...');
      
      const adminPass = await bcrypt.hash('admin123', 10);
      const operatorPass = await bcrypt.hash('operator123', 10);

      await pool.query(`
        INSERT INTO users (username, password_hash, role) VALUES 
        ('admin', ?, 'admin'),
        ('operator', ?, 'operator')
      `, [adminPass, operatorPass]);

      console.log('Default users created successfully!');
      console.log('Admin: admin / admin123');
      console.log('Operator: operator / operator123');
    } else {
      console.log('Users table already seeded.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error setting up auth:', error);
    process.exit(1);
  }
}

setupAuth();
