const axios = require('axios');

const NEWS_API_KEY = process.env.NEWS_API_KEY; // Получите ключ API от NewsAPI
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const getNews = async (category = 'general', country = 'us') => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category,
                country,
                apiKey: NEWS_API_KEY,
            },
        });

        return response.data.articles;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

module.exports = { getNews };
