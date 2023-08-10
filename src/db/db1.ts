require("dotenv").config();
import { Client }  from 'pg';

// Create a new PostgreSQL client instance
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'practiceDB',
  password: '123',
  port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect();

// Exporting
export default client;