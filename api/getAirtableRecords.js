const axios = require('axios');

module.exports = async (req, res) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.get(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_TIRAGES)}`, config);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY);
        console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID);
        console.log('AIRTABLE_TABLE_TIRAGES:', process.env.AIRTABLE_TABLE_TIRAGES);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
