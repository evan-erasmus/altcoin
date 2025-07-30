const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

async function setupDatabase() {
  const tables =[
    `CREATE TABLE IF NOT EXISTS cryptocurrencies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      api_id VARCHAR(50) NOT NULL UNIQUE,
      symbol VARCHAR(10) NOT NULL,
      name VARCHAR(50) NOT NULL,
      img_url VARCHAR(255),
      max_supply DECIMAL(20,8),
      total_supply DECIMAL(20,8),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS crypto_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      crypto_id INT NOT NULL,
      price DECIMAL(18,8),
      market_cap DECIMAL(20,2),
      volume_24h DECIMAL(20,2),
      high_24h DECIMAL(18,8),
      low_24h DECIMAL(18,8),
      change_24h DECIMAL(18,8),
      change_pct_24h DECIMAL(8,4),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (crypto_id) REFERENCES cryptocurrencies(id)
    );`
  ];

  try {
    tables.forEach(async (sql) => {
      await query(sql);
    });
  } catch (err) {
    console.error('Error in db setup:', err);
  }
}

async function query(sql, params) {
  let conn = null;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } finally {
    if (conn) conn.end();
  }
}

async function getCryptoId(coin) {
  const selectSql = `
    SELECT id
    FROM cryptocurrencies
    WHERE api_id = ?
    LIMIT 1
  `;
  const insertSql = `
    INSERT INTO cryptocurrencies (api_id, symbol, name, img_url, max_supply, total_supply)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const rows = await query(selectSql, [coin.id]);
  if (rows.length > 0) {
    return rows[0].id;
  }

  const result = await query(insertSql, [
    coin.id,
    coin.symbol,
    coin.name,
    coin.image,
    coin.max_supply || null,
    coin.total_supply || null
  ]);

  return result.insertId;
}

async function insertHistory(cryptoId, coin) {
  const sql = `
    INSERT INTO crypto_history (crypto_id, price, market_cap, volume_24h, high_24h, low_24h, change_24h, change_pct_24h)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    cryptoId,
    coin.current_price,
    coin.market_cap,
    coin.total_volume,
    coin.high_24h,
    coin.low_24h,
    coin.price_change_24h,
    coin.price_change_percentage_24h
  ];

  await query(sql, values);
}

async function getHistory(cryptoId, startDate, endDate) {
  const idSql = `
    SELECT *
    FROM cryptocurrencies
    WHERE api_id = ?
    LIMIT 1
  `;

  const internalId = await query(idSql, [cryptoId]);

  const sql = `
    SELECT *
    FROM crypto_history
    WHERE crypto_id = ?
    AND (timestamp >= ?)
    AND (timestamp <= ?)
  `;

  return await query(sql, [internalId[0].id, startDate, endDate]);
}

async function getAllCryptos() {
  const sql = `
    SELECT *
    FROM cryptocurrencies
    ORDER BY name ASC
  `;

  return await query(sql);
}


module.exports = { getAllCryptos, getCryptoId, insertHistory, getHistory, setupDatabase, query, pool };
