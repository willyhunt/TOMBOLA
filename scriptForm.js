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
        commercants.forEach(commercant => {
            const option = new Option(commercant, commercant); // Le texte et la valeur sont les mêmes ici
            selectElement.appendChild(option);
        });

        // Réinitialiser le composant select pour afficher les nouvelles options
        M.FormSelect.init(selectElement);
    }

    fetchCommercants();
});
