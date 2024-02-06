const axios = require('axios');
const tirageId = 'recvZAICq2tq7TFgH';
const fieldName = 'IDTirage'; // Remplacez par le nom exact du champ
const formula = `FIND('${tirageId}', {${fieldName}})`;


module.exports = async (req, res) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        params: {
            filterByFormula: encodeURIComponent(encodedFormula)
        }
    };

    try {
        const response = await axios.get(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_TIRAGES)}`, config);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
