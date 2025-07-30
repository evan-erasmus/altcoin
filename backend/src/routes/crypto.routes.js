const express = require('express');
const axios = require('axios');
const db = require('../services/db.service');
const redis = require('../services/redis.service');
const router = express.Router();

// get live cryptocurrency data
router.get('/live', async (req, res) => {
  try {
    // check cache
    const cachedCoins = await redis.getCache('coin-price');

    if (cachedCoins) {
      return res.json(JSON.parse(cachedCoins));
    }

    // if not found in cache, query teh external api
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=zar&ids=bitcoin,ethereum,litecoin');
    const newCoinData = response.data;

    // save new data to cache and db
    redis.setCache('coin-price', newCoinData);
    newCoinData.forEach(async (i) => {
      const cryptoId = await db.getCryptoId(i);
      await db.insertHistory(cryptoId, i);
    });

    return res.json(newCoinData);
  } catch(err) {
    console.error('Error fetching live crypto data:', err);
    return res.status(500).send({
      message: 'Internal Server Error.'
    });
  }
});


//return a list of coins
router.get('/coins', async (req, res) => {
  try {
    const cachedCoins = await redis.getCache('coin-data');

    if (cachedCoins) {
      return res.json(JSON.parse(cachedCoins));
    }

    const dbCoinData = await db.getAllCryptos();
    if (dbCoinData && dbCoinData.length > 0) {
      redis.setCache('coin-data', dbCoinData, 3600);
      return res.json(dbCoinData);
    }

    return res.status(404).send({
      message: 'No cryptocurrencies found.'
    });
  } catch(err) {
    return res.status(500).send({
      message: 'Internal Server Error.'
    });
  }
});

//get historical data for a single coin
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

    return res.json(history);
  } catch (err) {
    return res.status(500).send({
      message: 'Internal Server Error.'
    });
  }
});

// clear cache
router.delete('/cache', async (req, res) => {
  console.log('Clearing cache...');
  try {
    const { key } = req.query;

    if (key) {
      await redis.redisClient.del(key);
      return res.json({ message: `Cache key "${key}" deleted successfully` });
    } else {
      const keys = await redis.redisClient.keys('*');
      if (keys.length > 0) {
        await redis.redisClient.del(keys);
      }
      return res.json({ message: 'All cache cleared successfully' });
    }
  } catch (err) {
    console.error('Error clearing cache:', err);
    return res.status(500).json({ message: 'Failed to clear cache' });
  }
});

module.exports = router;
