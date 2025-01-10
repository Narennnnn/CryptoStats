# CryptoStats

A cryptocurrency statistics API service that provides real-time crypto market data and statistical analysis.

## Features by Task

### Background Job (Task 1)
The service includes an automated scheduler that:
- Runs every 2 hours
- Fetches current data from CoinGecko API for Bitcoin, Ethereum, and Matic
- Stores the following data points in MongoDB:
  - Current USD price
  - Market cap in USD
  - 24-hour volume
- Uses CoinGecko's free API with proper coin IDs:
  - bitcoin
  - ethereum
  - matic-network

### Get Cryptocurrency Statistics (Task 2)
- **Endpoint:** `/api/stats`
- **Method:** `GET`
- **Description:** Get the latest price, market cap, and 24h volume for a cryptocurrency.
- **Query Parameters:**
   `coin`: The name of the cryptocurrency (e.g., `bitcoin`, `ethereum`, `matic-network`).
- **Response:** JSON object with `price`, `marketCap`, and `24hVolume` fields.

Example GET request:
```
GET /api/stats?coin=bitcoin
```

Sample response:
```json
{
    "price": 95080.93,
    "marketCap": 12527020028.8343,
    "24hChange": 269467087.871579
}
```

### Price Deviation Analysis (Task 3)
- **Endpoint:** `/api/deviation`
- **Method:** `GET`
- **Description:** Calculate standard deviation of cryptocurrency price for last 100 records.
- **Query Parameters:**
   `coin`: The name of the cryptocurrency (e.g., `bitcoin`, `ethereum`, `matic-network`).
- **Response:** JSON object with standard deviation value.

Example GET request:
```
GET /api/deviation?coin=bitcoin
```

Sample response:
```json
{
    "deviation": 124.044747
}
```

## Deployment

### Production Deployment
The backend is currently deployed on an AWS EC2 instance and can be accessed through these public endpoints:

1. Get Statistics:
```
GET http://52.65.211.94:3000/api/stats?coin=bitcoin
```
Sample response:
```json
{
    "price": 95080.93,
    "marketCap": 12527020028.8343,
    "24hChange": 269467087.871579
}
```

2. Get Price Deviation:
```
GET http://52.65.211.94:3000/api/deviation?coin=bitcoin
```
Sample response:
```json
{
    "deviation": 124.044747
}
```

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/Narennnnn/CryptoStats.git
cd CryptoStats
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other configurations
```

4. Start the server:
```bash
node src/app.js
```

The server will be available at `http://localhost:3000`

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t cryptostats .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env cryptostats
```

The server will be available at `http://localhost:3000`

## Note

Rate limiting for CoinGecko API is not a concern for this service because:
1. Data fetching occurs only every 2 hours via the scheduler
2. API endpoints (`/api/stats` and `/api/deviation`) serve data directly from MongoDB
3. No direct calls to CoinGecko API are made during user requests

Therefore, the service stays well within CoinGecko's free tier limits of 30 calls/minute.
