const axios = require('axios');
const tirageId = 'recvZAICq2tq7TFgH';

module.exports = async (req, res) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.get(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_TICKETS)}?filterByFormula=FIND(%22${tirageId}%22,{IDTirage})`, config);
        const records = response.data.records;

        const minTicket = records[0].fields["Min Ticket (from Tirage)"][0];
        const maxTicket = records[0].fields["Max Ticket (from Tirage)"][0];

        const ticketsGagnants = records.map(record => {
            return {
                affichage: record.fields["Affichage au tirage (from Lot)"] ? record.fields["Affichage au tirage (from Lot)"][0] : false,
                commercant: record.fields["Commerçant (from Carnets)"] ? record.fields["Commerçant (from Carnets)"][0] : "",
                duree: record.fields["Durrée du Tirage (s) (from Lot)"] ? record.fields["Durrée du Tirage (s) (from Lot)"][0] : 0,
                nomDuLot: record.fields["LOT (from Lot)"] ? record.fields["LOT (from Lot)"][0] : "",
                numeroDuLot: record.fields["Numéro du lot"],
                numeroTicketGagnant: record.fields["Numéro Ticket Gagnant"],
            };
        });

        const tirageData = {
            id: tirageId,
            maxTicket: maxTicket,
            minTicket: minTicket,
            ticketsGagnants: ticketsGagnants
        };

        res.status(200).json({ tirageData });


    } catch (error) {
        console.error('Error fetching Airtable data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Airtable' });
    }
};