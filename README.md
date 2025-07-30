# AltCoinTrader technical assessment

## Install and run the app
1. Clone this repo
2. Run `npm install` in both the frontend and backend folders seperately
3. Copy `backend/.env.example` to `backend/.env` (default values are used for simplicity)
4. Run `docker compose up -d --build` in the root folder
5. Navigate to `localhost:3000` for the frontend content

## Key points in this project

### Frontend
 - Reactjs frontend
 - Bootstrap for styling
 - Rechart for charts
 - The app consists of 2 pages:
   - Home (/)
   - Coin History (/coin/{coin id, e.g: bitcoin, ethereum, litecoin})

### Backend
 - Nodejs backend, using nodemon (development environment)
 - Axios for API requests to external API provider
 - Redis service for connecting to redis
 - DB service for connecting to db
 - Api endpoints available:
   - /health (debugging if app is running)
   - /api/crypto/live
     - Checks cache for existing live data
     - If none is found, requests external provider
     - Inserts new data into history table and cache
     - Inserts coiin data into coin metadata table
     - Returns data for 3 coins, bitccoin, ethereum, litecoin
   - /api/crypto/coins
     - Checks cache for existing static coin data
     - If none is found, queries database for coin data
     - Returns all available crypto currency metadata
   - /api/crypto/history/:id
     - Accepts id as parameter (e.g bitcoin, litecoin, etc.)
     - If ?start and ?end are present, selects history for coins between date range
     - If no date ranges are passed, selects all history
     - History is not cached by redis
   - /api/crypto/cache
     - Clears redis cache
     - if ?key is provided, only clears that key

### Cache
 - Redis on default port

### Database
 - Mariadb on default port
