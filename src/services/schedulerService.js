const cron = require('node-cron');
const CryptoPrice = require('../models/cryptoPrice');
const geckoTerminalService = require('./geckoTerminalService');

class SchedulerService {
    constructor() {
        this.coins = ['bitcoin', 'matic-network', 'ethereum'];
    }

    async fetchAndStoreCryptoData() {
        try {
            for (const coinId of this.coins) {
                const data = await geckoTerminalService.getCoinData(coinId);
                
                await CryptoPrice.create({
                    coinId,
                    priceUSD: data.priceUSD,                    marketCapUSD: data.marketCapUSD,
                    change24h: data.change24h
                });

                console.log(`Data stored for ${coinId}`);
            }
        } catch (error) {
            console.error('Error in crypto data fetch job:', error);
        }
    }

    startScheduler() {
        // Run every 2 hours using cron expression
        cron.schedule('0 */2 * * *', async () => {
            // console.log('Running crypto data fetch job...');
            await this.fetchAndStoreCryptoData();
        });

        // Initial fetch when service starts
        this.fetchAndStoreCryptoData();
    }
}

module.exports = new SchedulerService();
