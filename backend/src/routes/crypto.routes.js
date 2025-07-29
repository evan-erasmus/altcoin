const express = require('express');
const axios = require('axios');
const db = require('../services/db.service');
const redis = require('../services/redis.service');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // check cache
    const cachedCoins = await redis.getCache('coin-data');

    if (cachedCoins) {
      return res.json(JSON.parse(cachedCoins));
    }
    console.log('  REDIS: No cached coins found, querying external API...');

    // if not found in cache, query teh external api
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=zar&ids=bitcoin,ethereum,litecoin');
    const newCoinData = response.data;

    // save new data to cache and db
    redis.setCache('coin-data', newCoinData);
    newCoinData.forEach(async (i) => {
      const cryptoId = await db.getCryptoId(i);
      await db.insertHistory(cryptoId, i);
    });

    res.json(newCoinData);
  } catch(err) {
    res.status(500).send({
      message: 'Internal Server Error.'
    });
  }
});

router.get('/history/:id', async (req, res) => {
  try {
    const { start, end } = req.query;
    const cryptoId = req.params.id;
    const history = await db.getHistory(cryptoId, start || '1970-01-01', end || '9999-12-31');

    // check if the start end end dates are parsed
    if (start) {
      if (isNaN(Date.parse(start))) {
        return res.status(400).send({
          message: 'Invalid start date format. Use YYYY-MM-DD.'
        });
      }
    }

    if (end) {
      if (isNaN(Date.parse(end))) {
        return res.status(400).send({
          message: 'Invalid end date format. Use YYYY-MM-DD.'
        });
      }
    }

    if (!history || history.length === 0) {
      return res.status(404).send({
        message: 'No history found for this cryptocurrency.'
      });
    }

    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).send({
      message: 'Internal Server Error.'
    });
  }
});

module.exports = router;