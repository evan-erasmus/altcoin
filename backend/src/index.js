require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const db = require('./services/db.service');
const redis = require('./services/redis.service');
const cryptoRoutes = require('./routes/crypto.routes');

const app = express();
const PORT = process.env.PORT;


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/crypto', cryptoRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});


app.listen(PORT, async () => {
  await db.setupDatabase();
  await redis.connect();
  console.log('running on port: ' + PORT);
});

