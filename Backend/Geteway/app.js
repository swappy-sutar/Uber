import express from 'express';
import expressProxy from 'express-http-proxy';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use('/api/v1/users', expressProxy('http://localhost:3001'));
app.use('/api/v1/captains', expressProxy('http://localhost:3002'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});
