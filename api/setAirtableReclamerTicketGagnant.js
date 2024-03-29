const axios = require('axios');

module.exports = async (req, res) => {
    console.log('Début du traitement de la requête de Ticket Gagnant.');

    // Extraire les données nécessaires depuis la requête
    const {
        EmailReclamation, iDTicketGagnant, Nom, Prenom, Adresse, Telephone,
        ContactPref, InformationsSupplementaires
    } = req.body;

    // Vérification de la présence des données requises
    if (!EmailReclamation || !iDTicketGagnant) {
        console.error('EmailReclamation et iDTicketGagnant sont requis.');
        return res.status(400).json({ error: 'EmailReclamation et iDTicketGagnant sont requis.' });
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const data = {
        fields: {
            'Ticket': [iDTicketGagnant],
            'Email': EmailReclamation,
            'Prénom': Prenom,
            'Nom': Nom,
            'Adresse': Adresse,
            'Téléphone': Telephone,
            'Contacté': ContactPref, // Assurez-vous que les valeurs correspondent à celles de votre champ Single Select dans Airtable
            'Infos': InformationsSupplementaires
        }
    };

    try {
        const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_RECLAMATIONS}`;

        const response = await axios.post(url, data, config);

        console.log('Ticket Gagnant patché avec succès.');

        // Réponse avec les données de l'enregistrement mis à jour
        res.status(200).json({ success: true, message: 'Ticket Gagnant mis à jour avec succès.', data: response.data });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du Ticket Gagnant dans Airtable:', error);
        res.status(500).json({ error: 'Failed to update the Ticket Gagnant in Airtable.' });
    }
};
