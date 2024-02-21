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
        console.log(`Requête envoyée à Airtable pour l'Evènement: ${IDTirage}`);
        
        const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_TICKETS)}?filterByFormula=FIND(%22${IDTirage}%22,{IDTirage)`;
        const response = await axios.get(url, config);
        const records = response.data.records;

        // Modification ici pour inclure les IDs des records
        const ticketsGagnants = records.map(record => ({
            id: record.id,
            nomDuCommercant: record.fields["Nom du Commerçant"] ? record.fields["Nom du Commerçant"] : "non disponible",
            status: record.fields["Status"] ? record.fields["Status"] : "non disponible",
            numeroTicketGagnant: record.fields["Numéro Ticket Gagnant"] ? record.fields["Numéro Ticket Gagnant"] : "non disponible"
        }));

        // Tri alphabétique des noms des commerçants, pas nécessaire de trier par ID
        const ticketsGagnantsTries = ticketsGagnants.sort((a, b) => a.numeroTicketGagnant.localeCompare(b.numeroTicketGagnant));
        
        console.log('Données récupérées et traitées avec succès.');

        // Réponse avec les données triées, incluant les IDs
        res.status(200).json({ TicketsGagnants: ticketsGagnantsTries });
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
