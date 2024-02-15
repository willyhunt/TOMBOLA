const axios = require('axios');
const { Console } = require('console');

module.exports = async (req, res) => {
    // Log de début de traitement
    console.log('Début du traitement de la requête.');

    // Récupérer l'année de la requête, en supposant que vous l'envoyez comme paramètre de requête ou dans le corps de la requête
    const Annee = req.query.Annee || (req.body && req.body.Annee);

    // Vérification de la présence de l'année
    if (!Annee) {
        console.error('Annee is required');
        return res.status(400).json({ error: 'Annee is required' });
    }

    // Configuration de la requête HTTP
    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        // Log de la requête envoyée à Airtable
        console.log(`Requête envoyée à Airtable pour l'année: ${Annee}`);
        
        const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_COMMERCANTS)}?filterByFormula=FIND(%22${Annee}%22,{ID (from Année)})`;
        const response = await axios.get(url, config);
        const records = response.data.records;

        // Extraction des noms des commerçants dans une liste simple
        const nomsDesCommercants = records.map(record => record.fields["Nom du commerce"] ? record.fields["Nom du commerce"] : null);

        // Tri alphabétique des noms des commerçants
        const CommercantsTries = nomsDesCommercants.sort((a, b) => a.localeCompare(b));
        
        // Log de succès
        console.log('Données récupérées et traitées avec succès.');

        // Réponse avec les données triées
        res.status(200).json({ Commercants: CommercantsTries });
    } catch (error) {
        // Log de l'erreur
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
