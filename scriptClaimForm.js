document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('ticketGagnant');
    const form = document.getElementById('formReclamation');

    var elemsSelect = document.querySelectorAll('select');
    M.FormSelect.init(elemsSelect);

    // Initialisation du champ textarea pour les informations supplémentaires
    var elemsTextarea = document.querySelectorAll('.materialize-textarea');
    M.textareaAutoResize(elemsTextarea);

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
});
