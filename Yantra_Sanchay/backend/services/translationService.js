const axios = require('axios');

const translationService = {
    translate: async (text, source = 'english', target = 'telugu') => {
        try {
            const translationServiceUrl = process.env.TRANSLATION_SERVICE_URL || 'http://127.0.0.1:8000';

            const response = await axios.post(`${translationServiceUrl}/translate`, {
                text,
                source,
                target,
            });

            return response.data;
        } catch (error) {
            console.error('Translation service error:', error.message);
            // Return original text if translation fails
            return { translated_text: text };
        }
    },

    translateArray: async (texts, source = 'english', target = 'telugu') => {
        try {
            const results = [];
            for (const text of texts) {
                const result = await translationService.translate(text, source, target);
                results.push(result);
            }
            return results;
        } catch (error) {
            console.error('Error translating array:', error.message);
            return texts.map((text) => ({ translated_text: text }));
        }
    },
};

module.exports = translationService;
