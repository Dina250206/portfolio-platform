const axios = require('axios');

const FINANCIAL_API_KEY = process.env.FINANCIAL_API_KEY; // Получите ключ API от Alpha Vantage
const BASE_URL = 'https://www.alphavantage.co/query';

const getFinancialData = async (symbol) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol,
                interval: '1min',
                apikey: FINANCIAL_API_KEY,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching financial data:', error);
        throw error;
    }
};

module.exports = { getFinancialData };
