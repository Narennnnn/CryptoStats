const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class GeckoTerminalService {
    constructor() {
        if (!process.env.GECKOTERMINAL_BASE_URL) {
            throw new Error('GECKOTERMINAL_BASE_URL environment variable is not set');
        }
        
        this.baseURL = process.env.GECKOTERMINAL_BASE_URL;
        // console.log('GeckoTerminal Base URL:', this.baseURL);
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
            // endpoint to get the token data
            const url = `${this.baseURL}/networks/${tokenInfo.network}/tokens/${tokenInfo.address}`;
            // console.log('Requesting URL:', url);

            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.data || !response.data.data || !response.data.data.attributes) {
                throw new Error('Invalid response format from GeckoTerminal');
            }

            const tokenData = response.data.data.attributes;
            
            return {
                id: uuidv4(),
                coinId: coinId,
                priceUSD: parseFloat(tokenData.price_usd || 0),
                marketCapUSD: parseFloat(tokenData.market_cap_usd || 0),
                change24h: parseFloat(tokenData.volume_usd?.h24 || 0)
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
