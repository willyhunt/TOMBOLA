document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('ticketGagnant');
    const form = document.getElementById('formReclamation');

    // Initialisation des éléments select
    var elemsSelect = document.querySelectorAll('select');
    M.FormSelect.init(elemsSelect);

    // Assurez-vous d'initialiser correctement le textarea
    var elemTextarea = document.querySelector('.materialize-textarea');
    if (elemTextarea) {
        M.textareaAutoResize(elemTextarea);
    }

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

    // Fonction pour valider l'adresse e-mail
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Fonction pour valider le numéro de téléphone
    function validatePhone(phone) {
        const regex = /^\+?(\d{10,15})$/; // Modifiez selon le format souhaité
        return regex.test(phone);
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
        const ticketGagnantText = ticketGagnantSelect.options[ticketGagnantSelect.selectedIndex].text; 
    
        if (!emailReclamation || !iDTicketGagnant || !nom || !prenom || !contactPref) {
            M.toast({html: 'Veuillez remplir tous les champs requis.'});
            return;
        }
     
        // Validation de l'adresse e-mail et du numéro de téléphone
        if (!validateEmail(emailReclamation)) {
            M.toast({html: 'Adresse e-mail invalide.'});
            return;
        }
        if (!validatePhone(telephone)) {
            M.toast({html: 'Numéro de téléphone invalide.'});
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
                nom,
                prenom,
                adresse,
                telephone,
                contactPref,
                informationsSupplementaires,
                ticketGagnantText // Stockage du texte pour un affichage significatif
            }));
    
            window.location.href = 'redirectionReclamation.html';
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire:', error);
            M.toast({html: `Erreur: ${error.message}`});
        }
    }

    fetchticketGagnants();
    form.addEventListener('submit', handleSubmit);
});
