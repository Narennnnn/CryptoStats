const mongoose = require('mongoose');

/**
 * MongoDB Schema for storing cryptocurrency price data
 * 
 * Sample documents in the collection:
 * {
 *   "_id": ObjectId("6781680c9a8221bc1c6dd3d5"),
 *   "coinId": "bitcoin",
 *   "priceUSD": 95331.95,
 *   "marketCapUSD": 12590304325.6824,
 *   "change24h": 274157326.632843,    // 24h trading volume in USD
 *   "timestamp": ISODate("2025-01-10T18:33:48.635Z")
 * }
 * 
 * {
 *   "_id": ObjectId("6781680d9a8221bc1c6dd3d9"),
 *   "coinId": "matic-network",
 *   "priceUSD": 0.45685718,
 *   "marketCapUSD": 877984316.768083,
 *   "change24h": 481509.338925462,
 *   "timestamp": ISODate("2025-01-10T18:33:49.283Z")
 * }
 * 
 * {
 *   "_id": ObjectId("6781680d9a8221bc1c6dd3db"),
 *   "coinId": "ethereum",
 *   "priceUSD": 3296.04,
 *   "marketCapUSD": 10015406692.967,
 *   "change24h": 1216113303.22616,
 *   "timestamp": ISODate("2025-01-10T18:33:49.699Z")
 * }
 */

const CryptoPriceSchema = new mongoose.Schema({
    coinId: {
        type: String,
        required: true,
        enum: ['bitcoin', 'matic-network', 'ethereum']
    },
    priceUSD: {
        type: Number,
        required: true
    },
    marketCapUSD: {
        type: Number,
        required: true
    },
    change24h: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('CryptoPrice', CryptoPriceSchema);

