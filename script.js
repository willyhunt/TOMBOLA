document.addEventListener('DOMContentLoaded', function() {
    var dropZones = document.querySelectorAll('.logo-container');

    // Fonction pour gérer le dépôt d'images
    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        var dt = e.dataTransfer;
        var files = dt.files;

        if (files.length) {
            var file = files[0];
            var reader = new FileReader();
            
            reader.onload = function(event) {
                var imgElement = e.target.querySelector('img') || document.createElement('img');
                imgElement.src = event.target.result;
                
                if (!e.target.querySelector('img')) {
                    e.target.appendChild(imgElement);
                }
            };

            reader.readAsDataURL(file);
        }
    }

    // Fonction pour empêcher le comportement par défaut
    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // Montre l'opération de copie
    }

    // Ajout des écouteurs d'événements pour chaque zone de dépôt
    dropZones.forEach(function(zone) {
        zone.addEventListener('dragover', handleDragOver, false);
        zone.addEventListener('drop', handleDrop, false);
    });

    console.log("Le contenu HTML a été chargé et analysé.");

    // Exemple d'interaction : affichage d'une alerte lors du clic sur un élément
    var lotName = document.getElementById('lotName');
    lotName.addEventListener('click', function() {
        alert("Bienvenue sur Mon Site Web !");
    });
});

// Vous pouvez ajouter d'autres fonctions pour enrichir les interactions utilisateur
