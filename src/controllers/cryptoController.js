const CryptoPrice = require('../models/cryptoPrice');

class CryptoController {
    /**
     * Get the latest price, market cap and 24h volume for a cryptocurrency
     * @route GET /api/stats
     * @param {string} coin - Query parameter: 'bitcoin', 'ethereum', or 'matic-network'
     * @returns {Object} { price, marketCap, 24hChange }
     */
    async getStats(req, res) {
        try {
            const { coin } = req.query;
            if (!coin) {
                return res.status(400).json({ error: 'Coin parameter is required' });
            }

            const latestData = await CryptoPrice.findOne(
                { coinId: coin },
                { priceUSD: 1, marketCapUSD: 1, change24h: 1 },
                { sort: { timestamp: -1 } }
            );

            if (!latestData) {
                return res.status(404).json({ error: 'No data found for this coin' });
            }

            return res.json({
                price: latestData.priceUSD,
                marketCap: latestData.marketCapUSD,
                "24hChange": latestData.change24h
            });
        } catch (error) {
            console.error('Error in getStats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Get the standard deviation of prices for a cryptocurrency
     * @route GET /api/deviation
     * @param {string} coin - Query parameter: 'bitcoin', 'ethereum', or 'matic-network'
     * @returns {Object} { deviation }
     */
    async getDeviation(req, res) {
        try {
            const { coin } = req.query;
            if (!coin) {
                return res.status(400).json({ error: 'Coin parameter is required' });
            }

            const prices = await CryptoPrice.find(
                { coinId: coin },
                { priceUSD: 1 },
                { sort: { timestamp: -1 }, limit: 100 }
            ).lean();

            if (!prices.length) {
                return res.status(404).json({ error: 'No data found for this coin' });
            }

            const priceValues = prices.map(p => p.priceUSD);
            const deviation = this.calculateStandardDeviation(priceValues);

            return res.json({
                deviation: parseFloat(deviation.toFixed(6))
            });
        } catch (error) {
            console.error('Error in getDeviation:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    calculateStandardDeviation(values) {
        const n = values.length;
        if (n < 2) return 0;

        const mean = values.reduce((sum, value) => sum + value, 0) / n;
        const sumSquaredDiff = values.reduce((sum, value) => {
            const diff = value - mean;
            return sum + (diff * diff);
        }, 0);
        const variance = sumSquaredDiff / (n - 1);
        return Math.sqrt(variance);
    }
}

module.exports = new CryptoController();
