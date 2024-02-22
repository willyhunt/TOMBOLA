const axios = require('axios');

module.exports = async (req, res) => {
    console.log('Début du traitement de la requête de Ticket Gagnant.');

    // Extraire les données nécessaires depuis la requête
    const { EmailReclamation, iDTicketGagnant } = req.body;

    // Vérification de la présence des données requises
    if (!EmailReclamation || !iDTicketGagnant) {
        console.error('Tous les champs sont requis.');
        return res.status(400).json({ error: 'Tous les champs sont requis: EmailReclamation, iDTicketGagnant.' });
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const data = {
        fields: {
            'Email de Réclamation': EmailReclamation
        }
    };

    try {
        const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_TICKETS}/${iDTicketGagnant}`;

        const response = await axios.patch(url, data, config);

        console.log('Ticket Gagnant patché avec succès.');

        // Réponse avec les données de l'enregistrement ajouté
        res.status(200).json({ success: true, message: 'Ticket Gagnant ajoutée avec succès.', data: response.data });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la Ticket Gagnant dans Airtable:', error);
        res.status(500).json({ error: 'Failed to add the Ticket Gagnant to Airtable.' });
    }
};
