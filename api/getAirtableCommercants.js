const axios = require('axios');

module.exports = async (req, res) => {
    // Récupérer le Annee de la requête, en supposant que vous l'envoyez comme paramètre de requête ou dans le corps de la requête
    const Annee = req.query.Annee || (req.body && req.body.Annee);

    if (!Annee) {
        return res.status(400).json({ error: 'Annee is required' });
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.get(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_COMMERCANTS)}?filterByFormula=FIND(%22${Annee}%22,{Année})`, config);
        const records = response.data.records;

        const Commercants = records.map(record => ({
            nomDuCommercant: record.fields["Nom du commerce"] ? record.fields["Nom du commerce"][0] : false
        }));

        const CommercantsTries = Commercants.sort((a, b) => {
            return b.nomDuCommercant - a.nomDuCommercant;
        });
        
        

        res.status(200).json({ CommercantsTries });
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
