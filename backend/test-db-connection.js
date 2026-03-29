import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

console.log('DATABASE_URL:', process.env.DATABASE_URL);

client.connect()
  .then(() => {
    console.log("✅ Connected to database successfully");
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log("✅ Query successful:", result.rows[0]);
    return client.end();
  })
  .then(() => console.log("✅ Connection closed"))
  .catch(err => console.error("❌ Error:", err));
