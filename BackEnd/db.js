// importing packajes
import pkg from 'pg';
const { Client } = pkg;

// Create a new client
const data = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"sql123",
    database:"pumpStatement"
})


// Connect to the database
await data.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Connection error', err));

export default data;
