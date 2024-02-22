document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des éléments select
    var elemsSelect = document.querySelectorAll('select');
    var instancesSelect = M.FormSelect.init(elemsSelect);

    // Initialisation du champ textarea pour les informations supplémentaires
    var elemsTextarea = document.querySelectorAll('.materialize-textarea');
    M.textareaAutoResize(elemsTextarea);

    // Gestion de l'envoi du formulaire
    var form = document.getElementById('formReclamation');
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche l'envoi classique du formulaire

        // Validation des champs (exemple simple)
        if (validateForm()) {
            // Traitement des données du formulaire
            // Ici, vous pouvez ajouter la logique pour envoyer les données à un serveur
            console.log("Formulaire validé, prêt à être envoyé.");
            // Exemple : sendDataToServer(new FormData(form));
        } else {
            // Afficher un message d'erreur ou une indication sur les champs à corriger
            console.log("Erreur de validation, vérifiez vos informations.");
        }
    });

    // Fonction de validation du formulaire (exemple très basique)
    function validateForm() {
        // Ici, validez chaque champ comme requis
        // Cet exemple retourne simplement true pour simplifier
        return true;
    }

    // Optionnel : Fonction pour envoyer les données à un serveur
    // function sendDataToServer(formData) {
    //     // Utilisez fetch ou XMLHttpRequest pour envoyer les données
    //     console.log("Envoi des données du formulaire au serveur...");
    // }
});




/*document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('ticketGagnant');
    const form = document.getElementById('formReclamation');

    var elemsSelect = document.querySelectorAll('select');
    M.FormSelect.init(elemsSelect);

    //var elemsTextarea = document.querySelectorAll('textarea');
    //M.Textarea.init(elemsTextarea);

    // Foncti on pour récupérer les paramètres de l'URL
    function getURLParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    // Fonction pour récupérer les tickets gagnants depuis l'API
    async function fetchticketGagnants() {
        const tirageId = getURLParameter('tirageId');
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

    // Fonction pour remplir le select des tickets gagnants
    function fillTicketsGagnantSelect(TicketsGagnants) {
        console.log('Remplissage du select des tickets Gagnant...');
        selectElement.innerHTML = '<option value="" disabled selected>Choisissez un Ticket</option>';
        TicketsGagnants.forEach(({ id, numeroTicketGagnant }) => {
            console.log(`Ajout du TicketGagnant: ${numeroTicketGagnant} avec l'ID: ${id}`);
            const option = new Option(numeroTicketGagnant, id);
            selectElement.appendChild(option);
        });
        M.FormSelect.init(selectElement);
    }

    // Fonction pour valider et envoyer le formulaire
    async function handleSubmit(event) {
        event.preventDefault();
    
        // Récupération des valeurs du formulaire
        const emailReclamation = document.getElementById('email_reclamation').value;
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const adresse = document.getElementById('adresse').value;
        const telephone = document.getElementById('telephone').value;
        const contactPref = document.getElementById('contact_pref').value;
        const informationsSupplementaires = document.getElementById('informations_supplementaires').value;
        const ticketGagnantSelect = document.getElementById('ticketGagnant');
        const iDTicketGagnant = ticketGagnantSelect.value;
        const tirageId = getURLParameter('tirageId');
    
        if (!emailReclamation || !iDTicketGagnant || !nom || !prenom || !contactPref) {
            M.toast({html: 'Veuillez remplir tous les champs requis.'});
            return;
        }
    
        const formData = {
            EmailReclamation: emailReclamation,
            Nom: nom,
            Prenom: prenom,
            Adresse: adresse,
            Telephone: telephone,
            ContactPref: contactPref,
            InformationsSupplementaires: informationsSupplementaires,
            iDTicketGagnant: iDTicketGagnant, 
            TirageId: tirageId
        };
    
        try {
            const response = await fetch('/api/setAirtableReclamerTicketGagnant', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur lors de l'envoi des données: ${errorData.error || response.status}`);
            }
    
            localStorage.setItem('reclamationDetails', JSON.stringify({
                emailReclamation,
                numeroTicketGagnant,
            }));
    
            window.location.href = 'redirectionReclamation.html';
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire:', error);
            M.toast({html: `Erreur: ${error.message}`});
        }
    }

    fetchticketGagnants();
    form.addEventListener('submit', handleSubmit);
});*/
