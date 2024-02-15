document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('commercant');

    // Initialiser le composant select de Materialize
    M.FormSelect.init(selectElement);

    // Fonction pour récupérer les paramètres de l'URL
    function getURLParameter(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    async function fetchCommercants() {
        const annee = getURLParameter('Annee'); // Récupère l'année depuis l'URL
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
        const selectElement = document.getElementById('commercant');
        // S'assurer de garder l'option par défaut en place
        selectElement.innerHTML = '<option value="" disabled selected>Choisissez un commerçant</option>';
    
        commercants.forEach(commercant => {
            const option = new Option(commercant, commercant); // Le texte et la valeur sont les mêmes ici
            selectElement.appendChild(option);
        });
    
        // Réinitialiser le composant select pour afficher les nouvelles options
        M.FormSelect.init(selectElement);
    }
    

    fetchCommercants();
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formCommande');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire pour la démonstration

        // Validation de l'email
        const email = document.getElementById('email_commande');
        if (!email.value) {
            M.toast({html: 'L\'email de commande est obligatoire.'});
            return;
        }

        // Validation du commerçant
        const commercant = document.getElementById('commercant');
        if (commercant.value === "") {
            M.toast({html: 'Veuillez choisir un commerçant.'});
            return;
        }

        // Validation du nombre de carnets
        const nombreCarnets = document.getElementById('nombre_carnets');
        const carnetsValue = parseInt(nombreCarnets.value, 10);
        if (isNaN(carnetsValue) || carnetsValue < 1 || carnetsValue > 1000) {
            M.toast({html: 'Le nombre de carnets doit être compris entre 1 et 1000.'});
            return;
        }

        // Si toutes les validations sont passées, vous pouvez procéder à l'envoi du formulaire
        // form.submit(); // Décommentez pour activer l'envoi du formulaire
    });
});
