const axios = require('axios');
const tirageId = "recvZAICq2tq7TFgH";
// Remplacer {ID Tirage (from Tirage)} par le nom exact du champ si nécessaire.
const filterFormula2 = `FIND('${tirageId}', {ID Tirage (from Tirage)})`;
const encodedFormula = encodeURIComponent(filterFormula2); 


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
