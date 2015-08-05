function Game() {

	var deck = Array(52);

	var cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
	var cardNumbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "В", "Д", "К", "А"];
	var cardSuits = ["черви", "буба", "пики", "треф"];

	var playersTotalScore = 0;
	var dealersTotalScore = 0;
	var stopGiveCards = false;
	var iterator = 3; /*Итератор карт игрока*/


	/*Цикл формирования колоды*/
	var cardInDeck = 0;
	for (var i = 0; i < cardNumbers.length; i++){
		for (var j = 0; j < cardSuits.length; j++){
			deck[cardInDeck] = [cardNumbers[i], cardValues[i], cardSuits[j]];
			cardInDeck++;		
		}

	}

	/*Перемешивание*/
	for ( var i = deck.length; i-->0; ) {
	    var temp = deck[i], 
	        j = Math.floor(i*Math.random()); 
	    deck[i] = deck[j]; 
	    deck[j] = temp; 
	}
	
	/*Ждем загрузку странички иначе не получает элементы*/
	window.onload = function () {	
		// Вклчение кнопок при новой игре		
		disabledButton(false);
		// Добавление 2 карт игрока		
		for (var i = 1; i < 3; i++) {
			var colorCode = findCardColor(deck[0][2]);
			var payersCard = document.getElementById("payersCard"+i);
			payersCard.innerHTML = deck[0][0] + "<p style='margin-left: 40%;margin-top: 45%'>"+ colorCode + "</p>";	
			playersTotalScore += deck[0][1];
			deck.shift(); /*Удаление превого элемента масива*/
		}		

		document.getElementById("playersScore").innerHTML = "Количество очков игрока: " + playersTotalScore;

		var moreButton = document.getElementById("moreCardButton");
		var stopButton = document.getElementById("stopWorkButton");

		moreButton.onclick =  function() {
			disabledButton(true);
			addCardBack("players");
			var timer=setTimeout(function() {
			    giveNewCard("players");  
			}, 500); 
		}

		stopButton.onclick =  function() {
			/*Блокировка кнопок, чтобы пользователь не мешал играть диллеру*/
			disabledButton(true);

			for (var i =1 ; i < 3; i++) {
				document.getElementById("dealersCardWithBack"+i).remove();
				createNewCard("dealers");
				dealersTotalScore += deck[0][1];
				document.getElementById("dealersScore").innerHTML = "Количество очков дилера: " + dealersTotalScore;	
				deck.shift(); 
			}

			if (dealersTotalScore > playersTotalScore) {
				msgAboutEndTheGame("Победил диллер!");
			}
			else {
				var timerId = setInterval(function() {
					var result = whoWin();	
					if (stopGiveCards) { 							
			    			msgAboutEndTheGame (result);
			    			clearInterval(timerId); 
			    	}
			    	else{
			    		addCardBack("dealers");
				  		setTimeout(function() {
				    		giveNewCard("dealers");			    		
							}, 500); 
			    	}
				}, 1000);
			}
		}
	}

	/*Опередляем масть и отправляем код*/
	function findCardColor(colorCode) {	
		switch (colorCode) {
		  case "черви":
		    return "\u2665"	
		  case "буба":
		    return "\u2666"
		  case "пики":
		    return "\u2660"
		  case "треф":
		    return "\u2663"
		}
	}	

	function addCardBack(whosePlay){
		var newCardBack = document.createElement('div');
		newCardBack.className='cardWithBack';
		newCardBack.id = whosePlay + "CardBack";
		var divPlayersCard = document.getElementById(whosePlay + "Card") ;
		divPlayersCard.appendChild(newCardBack);
	}

	/*Принимает, кто сейчас играет от чего зависит логиrа добавления карт и прочего */
	function giveNewCard(whosePlay){
		document.getElementById(whosePlay+ "CardBack").remove();
		createNewCard(whosePlay);	

		if (whosePlay == "players"){
			playersTotalScore += deck[0][1];
			document.getElementById("playersScore").innerHTML="Количество очков игрока: " + playersTotalScore;					
			if(playersTotalScore>21){				
				msgAboutEndTheGame("У вас перебор.");			
			}	
			else{
				/*Включение кнопок */
				disabledButton(false);
			}
		}	 	
		else{
			// Местечко для счета диллера		
			dealersTotalScore += deck[0][1];
			document.getElementById("dealersScore").innerHTML="Количество очков дилера: " + dealersTotalScore;
		}
		deck.shift(); /*Удаление превого элемента масива*/	
	}



	function createNewCard(whosePlay){
		var newCard = document.createElement('div');
		newCard.className='cardWithoutBack';
		newCard.id = whosePlay + "Card" + iterator;
		iterator++;
		var colorCode = findCardColor(deck[0][2]);
		newCard.innerHTML=deck[0][0] + "<p style='margin-left: 40%;margin-top: 45%'>" + colorCode + "</p>";
		var divPlayersCard = document.getElementById(whosePlay + "Card") ;
		divPlayersCard.appendChild(newCard);
	}

	function whoWin(){
		if (dealersTotalScore > 21) {		
			stopGiveCards = true;
			return "У диллера перебор! Победил игрок!";
		}
		else if ((dealersTotalScore > playersTotalScore) && (dealersTotalScore <= 21)) {
			stopGiveCards = true;
			return "Победил диллер!";
		}
		else if ((dealersTotalScore < playersTotalScore) && (dealersTotalScore >= 17) && (dealersTotalScore <= 21)) {
			stopGiveCardsT = true;
			return "Победил игрок!";
		}
		else if ((dealersTotalScore == playersTotalScore) && (dealersTotalScore >= 17) && (dealersTotalScore <= 21)) {
			stopGiveCards = true;
			return "Ничья!";
		}
	}

	function msgAboutEndTheGame (text){
		if (confirm(text + " Начать новую игру?")) { 
			location.reload(true);
		}
		else {
			disabledButton(true);
		}
	}

	function disabledButton(flag){
		document.getElementById('moreCardButton').disabled = flag;
		document.getElementById('stopWorkButton').disabled = flag;
	}

}

Game.getInstance = function () {
    if (!this.instance) {
        this.instance = new this();
    }
    return this.instance;
};
 
Game.getInstance();