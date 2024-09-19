const { Pool } = require('pg');

// Создание подключения
const pool = new Pool({
  user: 'postgres',     
  host: 'localhost',         
  database: 'shop',   
  password: 'pgsql',    
  port: 5432,                 
});

module.exports = pool;