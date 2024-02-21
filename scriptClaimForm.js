document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('ticketGagnant');
    const form = document.getElementById('formCommande');

    // Initialiser le composant select de Materialize
    M.FormSelect.init(selectElement);

    // Fonction pour récupérer les paramètres de l'URL
    function getURLParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    // Fonction pour remplir le select des ticketGagnants avec leurs IDs comme valeurs
    async function fetchTicketsGagnants() {
        const tirageId = getURLParameter('tirageId'); // Récupère le Tirage depuis l'URL
        console.log(`Récupération des tickets Gagnant pour le Tirage: ${tirageId}`);

        if (!tirageId) {
            console.error('tirageId est requis en paramètre de l\'URL.');
            return;
        }

        try {
            const response = await fetch(`/api/getAirtableTicketsGagnants?tirageId=${tirageId}`);
            if (!response.ok) throw new Error('Réponse réseau non ok');

            const data = await response.json();
            fillTicketsGagnantSelect(data.TicketsGagnants);
        } catch (error) {
            console.error('Erreur lors de la récupération des tickets Gagnant:', error);
        }
    }

    function fillTicketsGagnantSelect(TicketsGagnants) {
        console.log('Remplissage du select des tickets Gagnant...');
        selectElement.innerHTML = '<option value="" disabled selected>Choisissez un commerçant</option>';
        TicketsGagnants.forEach(({ id, numeroTicketGagnant }) => { // Ajustez selon la structure exacte de votre réponse
            console.log(`Ajout du commerçant: ${numeroTicketGagnant} avec l'ID: ${id}`);
            const option = new Option(numeroTicketGagnant, id); // Utilise l'ID comme valeur
            selectElement.appendChild(option);
        });
        M.FormSelect.init(selectElement);
    }

    // Fonction pour valider et envoyer le formulaire avec l'ID du commerçant
    async function handleSubmit(event) {
        event.preventDefault();
    
        // Récupération des valeurs du formulaire
        const emailCommande = document.getElementById('email_commande').value;
        const ticketGagnantSelect = document.getElementById('ticketGagnant');
        const numeroTicketGagnant = ticketGagnantSelect.options[ticketGagnantSelect.selectedIndex].text;
        const nombreCarnets = document.getElementById('nombre_carnets').value;
        const tirageId = getURLParameter('tirageId');
        // Pas besoin de récupérer le Tirage si elle n'est pas affichée dans le récapitulatif
    
        // Validation simplifiée (pour exemple, votre implémentation peut varier)
        if (!emailCommande || !numeroTicketGagnant || !nombreCarnets) {
            M.toast({html: 'Veuillez remplir tous les champs requis.'});
            return;
        }
    
        const formData = {
            EmailCommande: emailCommande,
            numeroTicketGagnant: numeroTicketGagnant, 
            tirageId: tirageId
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
                numeroTicketGagnant, // Stocker le nom pour un affichage convivial
            }));
    
            // Redirection vers la page de récapitulatif
            window.location.href = 'redirection.html';
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire:', error);
            M.toast({html: `Erreur: ${error.message}`});
        }
    }
   

    fetchticketGagnants();
    form.addEventListener('submit', handleSubmit);
});
