const axios = require('axios');

module.exports = async (req, res) => {
    console.log('Début du traitement de la requête.');

    const tirageId = req.query.tirageId || (req.body && req.body.tirageId);

    if (!tirageId) {
        console.error('tirageId is required');
        return res.status(400).json({ error: 'tirageId is required' });
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        console.log(`Requête envoyée à Airtable pour le tirage: ${tirageId}`);
        
        const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_TICKETS)}?filterByFormula=AND(FIND(%22${tirageId}%22,{IDTirage}), OR({Status} = 'Non réclamé', {Status} = 'Réclamé'))`;
        const response = await axios.get(url, config);
        const records = response.data.records;

        // Modification ici pour inclure les IDs des records
        const ticketsGagnants = records.map(record => ({
            id: record.id,
            nomDuCommercant: record.fields["Nom du Commerçant"] ? record.fields["Nom du Commerçant"] : "non disponible",
            status: record.fields["Status"] ? record.fields["Status"] : "non disponible",
            numeroTicketGagnant: record.fields["Numéro Ticket Gagnant"] ? record.fields["Numéro Ticket Gagnant"] : "non disponible"
        }));

        const ticketsGagnantsTries = ticketsGagnants.sort((a, b) => {
            // Convertir en nombres si ce ne sont pas déjà des nombres
            const numA = Number(a.numeroTicketGagnant);
            const numB = Number(b.numeroTicketGagnant);
            
            return numA - numB; // Tri croissant
        });
        
        console.log(`Données récupérées et traitées avec succès: ${ticketsGagnantsTries}`);

        // Réponse avec les données triées, incluant les IDs
        res.status(200).json({ TicketsGagnants: ticketsGagnantsTries });
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
