const axios = require('axios');

class GeckoTerminalService {
    constructor() {
        if (!process.env.GECKOTERMINAL_BASE_URL) {
            throw new Error('GECKOTERMINAL_BASE_URL environment variable is not set');
        }
        
        this.baseURL = process.env.GECKOTERMINAL_BASE_URL;
        console.log('GeckoTerminal Base URL:', this.baseURL);
        
        this.tokenMapping = {
            'ethereum': {
                network: 'eth',
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
            },
            'bitcoin': {
                network: 'eth',
                address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
            },
            'matic-network': {
                network: 'eth',
                address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
            }
        };
    }

    async getCoinData(coinId) {
        try {
            const tokenInfo = this.tokenMapping[coinId];
            if (!tokenInfo) {
                throw new Error(`Unsupported coin: ${coinId}`);
            }

            const url = `${this.baseURL}/networks/${tokenInfo.network}/tokens/${tokenInfo.address}/pools`;
            console.log('Requesting URL:', url);

            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.data || !response.data.data || !response.data.data[0]) {
                throw new Error('Invalid response format from GeckoTerminal');
            }

            const poolData = response.data.data[0].attributes;
            
            return {
                priceUSD: parseFloat(poolData.base_token_price_usd || 0),
                marketCapUSD: parseFloat(poolData.base_token_price_usd * poolData.base_token_total_supply || 0),
                change24h: parseFloat(poolData.price_change_24h || 0)
            };
        } catch (error) {
            console.error(`Error fetching data for ${coinId}:`, error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    }
}

module.exports = new GeckoTerminalService();
