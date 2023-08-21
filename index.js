/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import games from './games.js';
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/
// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // Get the container where game cards will be appended
    const gamesContainer = document.getElementById('games-container');

    // Loop over each game in the provided array
    for (const game of games) {
        // Create a new div element for the game card
        const gameCard = document.createElement('div');
        
        // Add the class "game-card" to the game card element
        gameCard.classList.add('game-card');

        // Set the inner HTML using a template literal to display game information
        gameCard.innerHTML = `
            <img class = "game-img" src="${game.img}" alt="${game.name}" />
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <p>Pledged: ${game.pledged.toLocaleString()}</p>
            <p>Backers: ${game.backers.toLocaleString()}</p>
        `;

        // Append the game card to the games container
        gamesContainer.appendChild(gameCard);
    }
}
addGamesToPage(GAMES_JSON)

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/
// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalIndividualContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
 }, 0);

// Update the contributionsCard to display the result
contributionsCard.textContent = totalIndividualContributions;

// set the inner HTML using a template literal and toLocaleString to get a number with commas
const formattedTotalContributions = totalIndividualContributions.toLocaleString();
contributionsCard.innerHTML = `<div>${formattedTotalContributions}</div>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalAmount = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
},0);
raisedCard.textContent = totalAmount
// set inner HTML using template literal
const format = totalAmount.toLocaleString("en-US",{
    style: "currency",
    currency: "USD"
});
raisedCard.innerHTML = `<div>${format}</div>`;


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const numGames = GAMES_JSON.length;

const gameFormat = numGames.toLocaleString();
gamesCard.innerHTML = `<div>${gameFormat}</div>`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    // use filter() to get a list of games that have not yet met their goal
    const unfundedgames = GAMES_JSON.filter(game => game.pledged < game.goal);
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedgames);
} 

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}
// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}   
showAllGames();

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", () => {
    filterUnfundedOnly();
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    console.log(`Number of Unfunded games: ${unfundedGames.length}`);
});
fundedBtn.addEventListener("click", () => {
    filterFundedOnly();
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    console.log(`Number of funded games: ${fundedGames.length}`);
});
allBtn.addEventListener("click", () => {
    showAllGames();
    console.log(`Number of all games: ${GAMES_JSON.length}`);
});

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/
// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
const unfundCount = unfundedGames.length;
const funded = GAMES_JSON.filter((game) => game.pledged >= game.goal);
//20152const fundedCount = funded.length;
const gameLength = GAMES_JSON.length;
//const amountPledged = funded.reduce((total, game) => total + game.pledged, 0);
const total = GAMES_JSON.reduce((total,game) => total + game.pledged, 0);
// create a string that explains the number of unfunded games using the ternary operator

const displayStr = `<p> A total of ${total.toLocaleString("en-US")} has been raised for ${gameLength} games.
Currently, ${unfundCount} ${unfundCount === 0 ? "games are funded" : "games are unfunded"}. 
We need your help to fund these amazing games ! </p>`;
// create a new DOM element containing the template string and append it to the description container
const newElement = document.createElement("div");
newElement.innerHTML = displayStr;
deleteChildElements(descriptionContainer);

// Append the new element to the description container
descriptionContainer.appendChild(newElement);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games

// create a new element to hold the name of the top pledge game, then append it to the correct element

// do the same for the runner up item
const [firstGame, secondGame, ...remainingGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement = document.createElement("p");
firstGameElement.textContent = `${firstGame.name}`;
firstGameContainer.appendChild(firstGameElement);

// create a new element to hold the name of the runner-up game, then append it to the correct element
const secondGameElement = document.createElement("p");
secondGameElement.textContent = `${secondGame.name}`;
secondGameContainer.appendChild(secondGameElement);