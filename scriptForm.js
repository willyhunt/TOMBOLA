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
        const evenement = getURLParameter('Evenement'); // Récupère l'evènement depuis l'URL
        console.log(`Récupération des commerçants pour l'evènement: ${evenement}`);

        if (!evenement) {
            console.error('Evenement est requis en paramètre de l\'URL.');
            return;
        }

        try {
            const response = await fetch(`/api/getAirtableCommercants?Evenement=${evenement}`);
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
    
        // Récupération des valeurs du formulaire
        const emailCommande = document.getElementById('email_commande').value;
        const commercantSelect = document.getElementById('commercant');
        const commercantID = commercantSelect.value;
        const commercantNom = commercantSelect.options[commercantSelect.selectedIndex].text;
        const nombreCarnets = document.getElementById('nombre_carnets').value;
        const evenement = getURLParameter('Evenement');
        // Pas besoin de récupérer l'evènement si elle n'est pas affichée dans le récapitulatif
    
        // Validation simplifiée (pour exemple, votre implémentation peut varier)
        if (!emailCommande || !commercantID || !nombreCarnets) {
            M.toast({html: 'Veuillez remplir tous les champs requis.'});
            return;
        }
    
        const formData = {
            EmailCommande: emailCommande,
            Commercant: commercantID, // Utiliser l'ID pour la requête mais stocker le nom pour l'affichage
            NombreCarnets: nombreCarnets,
            Evenement: evenement
        };
    
        try {
            const response = await fetch('/api/setAirtableCommande', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur lors de l'envoi des données: ${errorData.error || response.status}`);
            }
    
            // Stocker les détails pour l'affichage sur la page de redirection
            localStorage.setItem('commandeDetails', JSON.stringify({
                emailCommande,
                commercantNom, // Stocker le nom pour un affichage convivial
                nombreCarnets,
            }));
    
            // Redirection vers la page de récapitulatif
            window.location.href = 'redirection.html';
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire:', error);
            M.toast({html: `Erreur: ${error.message}`});
        }
    }
   

    fetchCommercants();
    form.addEventListener('submit', handleSubmit);
});
