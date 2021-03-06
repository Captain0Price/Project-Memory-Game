/*
 * Create a list that holds all of your cards
 */

let toggledCards = []; 
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8;
resetCards();

const deck = document.querySelector('.deck');

//A function that shuffles the deck with the help of the provided shuffle function
function shuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const shuffledCards = shuffle(cardsToShuffle);
	for (card of shuffledCards){
		deck.appendChild(card);
	}
}
shuffleDeck();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
//Event Listener for click on the cards and other actions to be intiated on a click
deck.addEventListener('click',event =>{
	const clickTarget = event.target;
	if (isClickValid(clickTarget)){
		if (clockOff) {
			startClock();
			clockOff = false;
		}
		toggleCard (clickTarget);
		addToggleCards(clickTarget);
		if (toggledCards.length === 2){
			checkForMatch (clickTarget);
			addMove();
			checkScore();
		}
	}
	
})

function toggleCard (clickTarget) {
	clickTarget.classList.toggle('open');
	clickTarget.classList.toggle('show');
}

function addToggleCards(clickTarget){
	toggledCards.push(clickTarget);
	console.log(toggledCards);
}

//A function that checks for matching pair of cards and initiates gameOver function on successfully completing the game
function checkForMatch () {
	if (
		toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className
		) {
			toggledCards[0].classList.toggle('match');
			toggledCards[1].classList.toggle('match');
			toggledCards = [];
			matched++;
			if (matched === TOTAL_PAIRS) {
			gameOver();
			}
	}
	else {
		setTimeout(() => {
			console.log('Not a Match!');
			toggleCard(toggledCards[0]);
			toggleCard(toggledCards[1]);
			toggledCards = [];
	},1000);
	}
}

//This function is used in the above Event Listener
function isClickValid (clickTarget) {
	return (
		clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)
		);
}

function addMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

function checkScore() {
	if (moves === 12 || moves === 24) {
		hideStar();
	}
}

function hideStar() {
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
}

function startClock(){
	clockId = setInterval(() => {
		time++;
		console.log(time);
		displayTime();
	},1000);	
}

function displayTime() {
	const clock = document.querySelector('.clock');
	
	const minutes = Math.floor(time/60);
	const seconds = time % 60;
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
	console.log(clock);
}

function stopClock() {
	clearInterval(clockId);
}

//Function to show the game over Modal
function toggleModal() {
	const modal = document.querySelector('.modal_background');
	if(modal.classList.contains('hide')) {
		modal.classList.remove('hide');
	} else {
		modal.classList.add('hide');
	}
}

//Function to display the Game Statistics of the player
function writeModalStats() {
	const timeStat = document.querySelector('.modal_time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.modal_moves');
	const starsStat = document.querySelector('.modal_stars');
	const stars = getStars();


	timeStat.innerHTML = `Time = ${clockTime}`;
	movesStat.innerHTML = `Moves = ${moves}`;
	starsStat.innerHTML = `Stars = ${stars}`;
}

//Function to calculate the stars recieved by the player
function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	console.log(starCount);
	return starCount;
}

//Close button will close the modal on a click
document.querySelector('.modal_cancel').addEventListener('click', () => {
	toggleModal();
});

//Replay button will reset the game on a click
document.querySelector('.modal_replay').addEventListener('click', () => {
	replayGame();
});

//Restart button will restart the game on a click
document.querySelector('.restart').addEventListener('click', resetGame);


function resetGame() {
	resetClockAndTime();
	resetMoves();
	resetStars();
	shuffleDeck();
	resetCards();
}

function resetClockAndTime() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
	stars = 0;
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		star.style.display = 'inline';
	}
}

function replayGame() {
	resetGame();
	toggleModal();
	resetCards();
}

function resetCards(){
	const cards = document.querySelectorAll('.deck li');
	for(let card of cards) {
		card.className = 'card';
	}
}

function gameOver() {
	stopClock();
	toggleModal();
	writeModalStats();
}



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
