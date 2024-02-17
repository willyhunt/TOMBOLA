var isVerbose = true;

var maxRetries = 500; // Maximum number of retries
var retryCount = 0;  // Counter for retries

function logVerbose(message) {
    if (isVerbose) {
        console.log(message);
    }
}

var currentRowTirage;
var minMaxRowTickets;    
var min = 0;   
var max = 0;
var ticketsGagnants = [];
var nombreDeLots = 0;
var indexLot = 0;
var titlePrefix = "Tirage du lot N°";

async function init() {
    // Extraire le tirageId de l'URL courante
    const urlParams = new URLSearchParams(window.location.search);
    const tirageId = urlParams.get('tirageId');

    // S'assurer que tirageId est défini avant de continuer
    if (!tirageId) {
        console.error('Erreur : tirageId est requis');
        return;
    }

    // Construire l'URL pour inclure tirageId en tant que paramètre de requête
    const apiUrl = `${window.location.origin}/api/getAirtableRecords?tirageId=${tirageId}`;

    // Envoyer la requête GET et traiter la réponse
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const dataTirage = await response.json();
            console.log(dataTirage);
            var data = dataTirage.tirageData;
            min = data.minTicket;
            max = data.maxTicket;
            ticketsGagnants = data.ticketsGagnants;
            nombreDeLots = data.ticketsGagnants.length;
            logVerbose("nombreDeLots: " + nombreDeLots);
            /*logVerbose("ticketsGagnants: " + ticketsGagnants);
            logVerbose("ticketsGagnants[0]: " + ticketsGagnants[indexLot]);
            logVerbose("ticketsGagnants[0].numeroDuLot: " + ticketsGagnants[indexLot].numeroDuLot);
            logVerbose("ticketsGagnants[0].affichage: " + ticketsGagnants[indexLot].affichage);*/
            var btn = document.getElementById('tirageButton');
            btn.className = 'waves-effect waves-light btn red';
        } else {
            console.error('Erreur lors de la récupération des données', response);
        }

        // Remplir le champ select avec les lots disponibles dont l'affichage est autorisé
        const lotSelect = document.getElementById('lotSelect');
        let minIndex = 10000; // Pour garder une trace du dernier index ajouté
        ticketsGagnants.forEach((ticket, index) => {
            if(ticket.affichage) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = "Lot " + ticket.numeroDuLot + " : " + ticket.nomDuLot;
                lotSelect.prepend(option);
                if(index < minIndex){
                    minIndex = index; 
                }
            }
        });

        // Définir la valeur du select sur l'index du dernier lot ajouté
        if (minIndex !== 10000) {
            lotSelect.value = minIndex;
        }
        M.FormSelect.init(lotSelect);



    } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
    }
}



function SpinWheel(p_ticket) {
    var maxDisplayedDigits = 6;
    var winningNumber = p_ticket.numeroTicketGagnant;
    var commercant = p_ticket.commercant;
    var lotName = p_ticket.nomDuLot;
    var lotNumber = p_ticket.numeroDuLot;
    var duree = p_ticket.duree*1000;
    var referenceSpeed = 10*1000;
    var referenceIntervalIncreaseFactor = [1, 1.2, 1.4, 1.6, 1.8, 2];
    var referenceRandomBeforeStopNumbers = [8, 12 , 14, 16, 18, 22];
    
    // Calcul pour ajuster l'intervalle de manière fluide
    var iteration = 0;
    var intervalInitial = 10;
    var interval = intervalInitial;
    var accumulatedTime = 0;
    var accumulatedSlowingTime = 0;
    var startSlowing = false;
    var slowingPercentageOfTotalDuration = 0.3;

    var slowingFactor = CalculateSlowingFactor(50, referenceIntervalIncreaseFactor, referenceRandomBeforeStopNumbers, max.toString().length, maxDisplayedDigits,maxDisplayedDigits - max.toString().length, duree*slowingPercentageOfTotalDuration);

    var maskData = {
        nbDigits: max.toString().length,
        maxDigit: maxDisplayedDigits,
        minDigit: maxDisplayedDigits - max.toString().length,
        currentNumber: InitRandomCurrentNumber(max), // Initialize directly
        winningNumberInDigits: DecomposeWinningNumberInDigits(winningNumber), // Initialize directly
        refreshingMask: [0, 0, 0, 0, 0, 0],
        //finishedMask: InitializeFinishedMask([1, 1, 1, 1, 1, 1],max.toString().length),
        finishedMask: [1, 1, 1, 1, 1, 1],
        slowingMask: [1, 1, 1, 1, 1, 1],
        slowingSelectMask: [1, 0, 0, 0, 0, 0],
        slowingIterationCount: [0, 0, 0, 0, 0, 0],
        slowingCycleCount: [0, 0, 0, 0, 0, 0],
        intervalIncreaseFactor: AdaptSlowingSpeed(referenceIntervalIncreaseFactor,slowingFactor),
        randomBeforeStopNumbers: AdaptSlowingSpeed(referenceRandomBeforeStopNumbers,slowingFactor)
    };

    //var estimatedSlowingTime = CalculateEstimatedSlowingTime(maskData);
    
    /*logVerbose("slowingFactor: " + slowingFactor);   
    logVerbose("intervalIncreaseFactor: " + maskData.intervalIncreaseFactor);    
    logVerbose("randomBeforeStopNumbers: " + maskData.randomBeforeStopNumbers); 
    logVerbose("winningNumberInDigits: " + maskData.winningNumberInDigits);   
    logVerbose("nbDigits: " + maskData.nbDigits); 
    logVerbose("maxDigit: " + maskData.maxDigit);   
    logVerbose("minDigit: " + maskData.minDigit); 
    logVerbose("estimatedSlowingTime: " + estimatedSlowingTime);    
    logVerbose("intervalIncreaseFactor: " + maskData.intervalIncreaseFactor);    
    logVerbose("intervalIncreaseFactor: " + maskData.intervalIncreaseFactor);    
    logVerbose("intervalIncreaseFactor: " + maskData.intervalIncreaseFactor);  */     



    function InitializeFinishedMask(p_finishedMask, p_size) {
        var adaptedParam = [];

        for (var i = 0; i < p_finishedMask.length; i++) {
          if( i < (p_finishedMask.length - p_size)) {
            adaptedParam[i] = 0;
          } else {
            adaptedParam[i] = 1;
          }
        } 
        //logVerbose("adaptedParam: " + adaptedParam);

        return adaptedParam;

    }

    function CalculateSlowingFactor(p_precision, p_referenceIntervalIncreaseFactor, p_referenceRandomBeforeStopNumbers, p_nbDigits, p_maxDigit, p_minDigit, p_duree) {
        var p_estimatedSlowingFactor = 0.1;
        var precisionRange = p_duree * 0.05; // 1% of p_duree as the precision range

        for (var iteration = 0; iteration < p_precision; iteration++) {
            var p_estimatedSlowingTime = 0;

            for (var i = p_minDigit; i < p_maxDigit; i++) {
              p_estimatedSlowingTime += Math.max(p_referenceIntervalIncreaseFactor[i]*p_estimatedSlowingFactor, 1) * p_nbDigits * intervalInitial * (p_referenceRandomBeforeStopNumbers[i]*p_estimatedSlowingFactor + 5);
            }
            
            //logVerbose("p_estimatedSlowingTime: " + p_estimatedSlowingTime); 
            //logVerbose("p_estimatedSlowingFactor: " + p_estimatedSlowingFactor);   

            var difference = p_duree - p_estimatedSlowingTime;
            
            if(difference<0) {
              p_estimatedSlowingFactor= 0.1;
              return p_estimatedSlowingFactor;
            }
            if (Math.abs(difference) <= precisionRange) {
                break; // Acceptable difference reached
            }

            // Adjust slowing factor based on the difference, scaled by reference speed
            p_estimatedSlowingFactor += difference/p_duree*0.1;
        }

        return p_estimatedSlowingFactor;
    }

    function AdaptSlowingSpeed(p_param, p_slowingFactor) {
        var adaptedParam = [];

        for (var i = 0; i < p_param.length; i++) {
            adaptedParam[i] = p_param[i] * p_slowingFactor;
        } 
        //logVerbose("adaptedParam: " + adaptedParam);

        return adaptedParam;
    }

    function InitRandomCurrentNumber(p_maxvalue) {
        var length = p_maxvalue.toString().length;
        var lowerBound = Math.pow(10, length - 1);
        var upperBound = Math.pow(10, length) - 1;

        var randomNumber = Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
        var numberStr = randomNumber.toString().padStart(6, '0'); // Pad to ensure at least 6 digits

        return numberStr.split('').map(digit => parseInt(digit, 10)); // Convert each character to a number
    }

    function DecomposeWinningNumberInDigits(p_winningNumber) {
        var numberStr = p_winningNumber.toString().padStart(6, '0'); // Pad to ensure at least 6 digits

        return numberStr.split('').map(digit => parseInt(digit, 10)); // Convert each character to a number
    }

    function DisplayCurrentNumber(p_maskData) {
      for(var i=p_maskData.minDigit ; i<p_maskData.maxDigit ; i++){
        document.getElementById("ticketNumberDigit"+i).textContent = p_maskData.currentNumber[i];
      }
      return p_maskData;
    }

    function CalculateNewCurrentNumber (p_maskData){1
      
      /*logVerbose("---IN CalculateNewCurrentNumber ---"); 
      logVerbose("currentNumber: " + p_maskData.currentNumber); 
      logVerbose("finishedMask: " + p_maskData.finishedMask); 
      logVerbose("slowingMask: " + p_maskData.slowingMask);   
      logVerbose("refreshingMask: " + p_maskData.refreshingMask);*/
      for(var i=p_maskData.minDigit ; i<p_maskData.maxDigit ; i++) {
        if (p_maskData.refreshingMask[i] && p_maskData.finishedMask[i] && p_maskData.slowingMask[i]){
          p_maskData.currentNumber[i]=(p_maskData.currentNumber[i]+1)%10;
        }
      } 
      //logVerbose("NewNumber: " + p_maskData.currentNumber); 
      return p_maskData.currentNumber;
    }

    function CalculateRefreshingMask(p_maskData, p_iteration) {
      var newMask = [0,0,0,0,0,0]; // Défini plus tard
      var maskiteration = p_iteration%p_maskData.nbDigits+p_maskData.minDigit;
      newMask[maskiteration] = 1; 
      //logVerbose("maskiteration: " + maskiteration);
      //logVerbose("newMask: " + newMask);       
      return newMask;
    }

    function CalculateSlowingMask(p_maskData, p_iteration) {   
        for(var i=p_maskData.minDigit ; i<p_maskData.maxDigit ; i++) {
            // Process only if this digit is not finished yet
            if (p_maskData.finishedMask[i]) {
              if (p_maskData.refreshingMask[i]) {
                var maskIterations = Math.floor(p_maskData.slowingIterationCount[i]%p_maskData.intervalIncreaseFactor[i]);    
                /*logVerbose("maskIterations: " + maskIterations);       
                logVerbose("p_maskData.intervalIncreaseFactor[i]: " + p_maskData.intervalIncreaseFactor[i]);       
                logVerbose(" p_maskData.slowingIterationCount[i]: " +  p_maskData.slowingIterationCount[i]);   */
                p_maskData.slowingIterationCount[i]++;
        
                if(maskIterations == 0){
                  p_maskData.slowingMask[i] = 1;
                  p_maskData.slowingCycleCount[i]++;
                  //logVerbose("p_maskData.slowingCycleCount[i]: " + p_maskData.slowingCycleCount[i]);
                } else {
                  p_maskData.slowingMask[i] = 0;
                }
              }
              return p_maskData;
            }
        }
        return p_maskData;
    }

    function CalculateFinishedMask(p_maskData) {
        for(var i=p_maskData.minDigit ; i<p_maskData.maxDigit ; i++) {
          //logVerbose("------------ i :"+i);
            if (p_maskData.finishedMask[i]) {
                var digitWinningNumber = p_maskData.winningNumberInDigits[i];
                var digitCurrentNumber = p_maskData.currentNumber[i];
                //logVerbose("digitWinningNumber:"+digitWinningNumber);
                //logVerbose("digitCurrentNumber:"+digitCurrentNumber);
                //logVerbose("slowingCycleCount:"+p_maskData.slowingCycleCount[i]);
                if (p_maskData.slowingCycleCount[i] >= p_maskData.randomBeforeStopNumbers[i] && Number(digitCurrentNumber) == Number(digitWinningNumber)) {
                        p_maskData.finishedMask[i] = 0;
                        p_maskData.slowingMask[i] = 0;
                        return p_maskData;
                    }
                }
            }                       
        return p_maskData;
    }

    function ActivateDrawButton() {
        var btn = document.getElementById('tirageButton');
        btn.className = 'waves-effect waves-light btn red';
        document.getElementById('lotSelectContainer').style.display = ''; // Show the select container if hidden
    
        // Additional logic if needed to handle lotSelect state
    }
    
    function updateLotSelectOptions() {
        const lotSelect = document.getElementById('lotSelect');
        // Save the current selection index
        const prevSelectedIndex = lotSelect.selectedIndex;
    
        // Clear existing options
        lotSelect.innerHTML = '<option value="" disabled selected>Choisissez le lot à tirer</option>';
        
        // Logic to add new options based on updated criteria
        ticketsGagnants.forEach((ticket, index) => {
            if(ticket.affichage) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = "Lot " + ticket.numeroDuLot + " : " + ticket.nomDuLot;
                lotSelect.prepend(option);
            }
        });
    
        // Reinitialize Materialize select to apply styling to new options
        M.FormSelect.init(document.querySelectorAll('select'));
    
        // Adjust the selection based on the previous state
        if (prevSelectedIndex > 0 && prevSelectedIndex < lotSelect.options.length) {
            // Attempt to decrement the selection, if possible
            lotSelect.selectedIndex = Math.min(prevSelectedIndex, lotSelect.options.length - 1);
        } else {
            // If there was no previous selection or it's not applicable, default to the first option
            lotSelect.selectedIndex = 0;
        }
    
        // Reinitialize Materialize select again to reflect the new selection
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    

    

    function UpdateNumbers(p_maskData) {
        //logVerbose("currentNumber: " + p_maskData.currentNumber);
        //logVerbose("winningNumberInDigits: " + p_maskData.winningNumberInDigits);
        //logVerbose("refreshingMask: " + p_maskData.refreshingMask);

        if (accumulatedTime>duree*(1-slowingPercentageOfTotalDuration)){
          startSlowing = true;
        }
        //logVerbose("accumulatedTime: "+accumulatedTime);
        //logVerbose("duree: "+duree);
        //logVerbose("startSlowing: "+startSlowing);

        p_maskData.refreshingMask = CalculateRefreshingMask(p_maskData, iteration);
        if (startSlowing) {
            p_maskData = CalculateFinishedMask(p_maskData);
            p_maskData = CalculateSlowingMask(p_maskData, iteration);
            accumulatedSlowingTime+=interval;
           // logVerbose("accumulatedSlowingTime: "+accumulatedSlowingTime);
        }
        
        p_maskData.currentNumber = CalculateNewCurrentNumber(p_maskData);        
        p_maskData = DisplayCurrentNumber(p_maskData);
        accumulatedTime += interval;
        iteration++;
        
        if (startSlowing && p_maskData.finishedMask[p_maskData.maxDigit-1] == 0) {
            logVerbose("Spin completed");
            document.getElementById("commercant").textContent = commercant;
            ActivateDrawButton();
            updateLotSelectOptions();
            return; // Spin completed
        }

        setTimeout(() => UpdateNumbers(p_maskData), interval);
    }

    document.getElementById("lotNumber").textContent = titlePrefix+lotNumber;
    document.getElementById("lotName").textContent = lotName;
    
    // Vérifier si winningNumber n'est pas un entier
    if (!Number.isInteger(winningNumber) || duree == 0 ) {
        document.getElementById("ticketNumberDigit0").textContent = winningNumber;
        if (Number.isInteger(winningNumber)){
          document.getElementById("commercant").textContent = commercant;
        }
        logVerbose("Winning number is not an integer or time set to 0 ");
        logVerbose("winningNumber: " + winningNumber);
        logVerbose("commercant: " + commercant);
        ActivateDrawButton();
        updateLotSelectOptions();
        return; // Sortir de la fonction
    }

    UpdateNumbers(maskData);
}

function effectuerTirage() {
    const selectedLotIndex = parseInt(document.getElementById('lotSelect').value, 10);

    // Vérification et ajustement basé sur la valeur sélectionnée
    if (isNaN(selectedLotIndex)) {
        alert("Tirage terminé tout les lots ont été tirés");
        return;
    }

    // Utiliser directement l'index pour accéder au lot correspondant
    const selectedLot = ticketsGagnants[selectedLotIndex];
    if (!selectedLot) {
        console.error('Lot sélectionné non trouvé.');
        return;
    }
    document.getElementById('lotSelectContainer').style.display = 'none';

    // Logique de tirage en utilisant le lot sélectionné
    logVerbose("EffectuerTirage called. Selected lot: " + selectedLot.numeroDuLot);
    var btn = document.getElementById('tirageButton');
    btn.className = 'waves-effect waves-light btn red disabled';

    clearDisplayFields();
    SpinWheel(selectedLot);
}


function clearDisplayFields() {
    document.getElementById("commercant").textContent = "";
    document.getElementById("lotName").textContent = "";
    document.getElementById("lotNumber").textContent = "";
    document.getElementById("ticketNumberDigit5").textContent = "";
    document.getElementById("ticketNumberDigit4").textContent = "";
    document.getElementById("ticketNumberDigit3").textContent = "";
    document.getElementById("ticketNumberDigit2").textContent = "";
    document.getElementById("ticketNumberDigit1").textContent = "";
    document.getElementById("ticketNumberDigit0").textContent = "";
}

function showError(error) {
    console.error("Erreur lors du tirage : ", error);
    alert("Une erreur est survenue : " + error.message);
    logVerbose("Error in drawing: " + error.message);
}


document.addEventListener('DOMContentLoaded', init);



document.addEventListener('DOMContentLoaded', function() {
    var body = document.body;
    var logoContainers = document.querySelectorAll('.logo-container');

    body.addEventListener('dragover', function(e) {
        if (e.target === body) {
            e.preventDefault();
        }
    });

    body.addEventListener('drop', function(e) {
        if (e.target === body) {
            e.preventDefault();
            handleDrop(e, body);
        }
    });

    logoContainers.forEach(function(container) {
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        container.addEventListener('drop', function(e) {
            e.preventDefault();
            handleDrop(e, container);
        });
    });

    function handleDrop(e, targetElement) {
        var file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            var reader = new FileReader();

            reader.onload = function(e) {
                targetElement.style.backgroundImage = 'url(' + e.target.result + ')';
                targetElement.style.backgroundSize = 'cover';
                targetElement.style.backgroundPosition = 'center';
                if (targetElement.classList.contains('logo-container')) {
                    targetElement.style.border = 'none'; // Enlever la bordure pour les logo-container
                }
            };

            reader.readAsDataURL(file);
        } else {
            alert("Veuillez déposer une image valide.");
        }
    }
});
