const axios = require('axios');

module.exports = async (req, res) => {
    console.log('Début du traitement de la requête.');

    const Evenement = req.query.Evenement || (req.body && req.body.Evenement);

    if (!Evenement) {
        console.error('Evenement is required');
        return res.status(400).json({ error: 'Evenement is required' });
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        console.log(`Requête envoyée à Airtable pour l'Evènement: ${Evenement}`);
        
        const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_COMMERCANTS)}?filterByFormula=FIND(%22${Evenement}%22,{Evènement ID})`;
        const response = await axios.get(url, config);
        const records = response.data.records;

        // Modification ici pour inclure les IDs des records
        const commercantsData = records.map(record => ({
            id: record.id,
            nomDuCommercant: record.fields["Nom du commerce"] ? record.fields["Nom du commerce"] : "Nom non disponible"
        }));

        // Tri alphabétique des noms des commerçants, pas nécessaire de trier par ID
        const CommercantsTries = commercantsData.sort((a, b) => a.nomDuCommercant.localeCompare(b.nomDuCommercant));
        
        console.log('Données récupérées et traitées avec succès.');

        // Réponse avec les données triées, incluant les IDs
        res.status(200).json({ Commercants: CommercantsTries });
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
