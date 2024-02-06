const axios = require('axios');

module.exports = async (req, res) => {
    // Récupérer le tirageId de la requête, en supposant que vous l'envoyez comme paramètre de requête ou dans le corps de la requête
    const tirageId = req.query.tirageId || (req.body && req.body.tirageId);

    if (!tirageId) {
        return res.status(400).json({ error: 'tirageId is required' });
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.get(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_TICKETS)}?filterByFormula=FIND(%22${tirageId}%22,{IDTirage})`, config);
        const records = response.data.records;

        const minTicket = records.length > 0 && records[0].fields["Min Ticket (from Tirage)"] ? records[0].fields["Min Ticket (from Tirage)"][0] : null;
        const maxTicket = records.length > 0 && records[0].fields["Max Ticket (from Tirage)"] ? records[0].fields["Max Ticket (from Tirage)"][0] : null;

        const ticketsGagnants = records.map(record => ({
            affichage: record.fields["Affichage au tirage (from Lot)"] ? record.fields["Affichage au tirage (from Lot)"][0] : false,
            commercant: record.fields["Nom du Commerçant"],
            duree: record.fields["Durrée du Tirage (s) (from Lot)"],
            nomDuLot: record.fields["LOT (from Lot)"],
            numeroDuLot: record.fields["Numéro du lot"],
            numeroTicketGagnant: record.fields["Numéro Ticket Gagnant"],
        }));

        const ticketsGagnantsTries = ticketsGagnants.sort((a, b) => {
            return Number(b.numeroDuLot) - Number(a.numeroDuLot);
        });
        
        

        const tirageData = {
            id: tirageId,
            maxTicket: maxTicket,
            minTicket: minTicket,
            ticketsGagnants: ticketsGagnantsTries
        };

        res.status(200).json({ tirageData });
    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};
