const axios = require('axios');

module.exports = async (req, res) => {
    console.log('Début du traitement de la requête de commande.');

    // Extraire les données nécessaires depuis la requête
    const { Commercant, NombreCarnets, EmailCommande, Annee } = req.body;

    // Vérification de la présence des données requises
    if (!Commercant || !NombreCarnets || !EmailCommande || !Annee) {
        console.error('Tous les champs sont requis.');
        return res.status(400).json({ error: 'Tous les champs sont requis: Commercant, NombreCarnets, EmailCommande, Annee.' });
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const data = {
        fields: {
            'Commerçant': Commercant,
            'Nombre de carnets': parseInt(NombreCarnets, 10),
            'Email de commande': EmailCommande
        }
    };

    try {
        const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_COMMANDES}`;

        const response = await axios.post(url, data, config);

        console.log('Commande ajoutée avec succès.');

        // Réponse avec les données de l'enregistrement ajouté
        res.status(200).json({ success: true, message: 'Commande ajoutée avec succès.', data: response.data });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la commande dans Airtable:', error);
        res.status(500).json({ error: 'Failed to add the command to Airtable.' });
    }
};
