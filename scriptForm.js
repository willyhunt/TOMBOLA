document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('commercant');
    const form = document.getElementById('formCommande');

    // Initialiser le composant select de Materialize
    M.FormSelect.init(selectElement);

    // Fonction pour récupérer les paramètres de l'URL
    function getURLParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    // Fonction pour remplir le select des commercants avec leurs IDs comme valeurs
    async function fetchCommercants() {
        const annee = getURLParameter('Annee'); // Récupère l'année depuis l'URL
        console.log(`Récupération des commerçants pour l'année: ${annee}`);

        if (!annee) {
            console.error('Annee est requis en paramètre de l\'URL.');
            return;
        }

        try {
            const response = await fetch(`/api/getAirtableCommercants?Annee=${annee}`);
            if (!response.ok) throw new Error('Réponse réseau non ok');

            const data = await response.json();
            fillCommercantSelect(data.Commercants);
        } catch (error) {
            console.error('Erreur lors de la récupération des commerçants:', error);
        }
    }

    function fillCommercantSelect(commercants) {
        console.log('Remplissage du select des commerçants...');
        selectElement.innerHTML = '<option value="" disabled selected>Choisissez un commerçant</option>';
        commercants.forEach(({ id, nomDuCommercant }) => { // Ajustez selon la structure exacte de votre réponse
            console.log(`Ajout du commerçant: ${nomDuCommercant} avec l'ID: ${id}`);
            const option = new Option(nomDuCommercant, id); // Utilise l'ID comme valeur
            selectElement.appendChild(option);
        });
        M.FormSelect.init(selectElement);
    }

    // Fonction pour valider et envoyer le formulaire avec l'ID du commerçant
    async function handleSubmit(event) {
        event.preventDefault();

        const emailCommande = document.getElementById('email_commande').value;
        const commercantID = selectElement.value; // Récupère l'ID du commerçant sélectionné
        const nombreCarnets = document.getElementById('nombre_carnets').value;
        const annee = getURLParameter('Annee');

        console.log('Données du formulaire:', { emailCommande, commercantID, nombreCarnets, annee });

        if (!emailCommande || !commercantID || !nombreCarnets) {
            M.toast({html: 'Veuillez remplir tous les champs requis.'});
            return;
        }

        const formData = {
            EmailCommande: emailCommande,
            Commercant: commercantID, // Poste l'ID du commerçant
            NombreCarnets: nombreCarnets,
            Annee: annee
        };

        try {
            const response = await fetch('/api/setAirtableCommande', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'envoi des données.');

            M.toast({html: 'Commande enregistrée avec succès!'});
            form.reset();
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire:', error);
            M.toast({html: `Erreur: ${error.message}`});
        }
    }

    fetchCommercants();
    form.addEventListener('submit', handleSubmit);
});
