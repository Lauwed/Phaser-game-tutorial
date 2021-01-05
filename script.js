// // TODO : fix the trajectory
// // TODO : Find the trajectory's not working...

// // TODO : let ball roll during 0.5s at the end

// // TODO : Start screen : Nom joueur + select 2 lettres country => Mandatories
// // TODO : Start screen : upload own image of the projectile ; .png or .jpeg ; format is square ; default if no upload

// // TODO : Angle it's a VERTICAL bar => Simple progress bar ; every 0.25 seconds

// TODO : Win screen : leader bord top 5 ; button to return start screen
// // TODO : Game over screen ; outside screen ; angle -5deg or/and power -30%
// TODO : game over screen => Restart game beug

// TODO : Indicate where API calls has to be made

// // TODO : Add a lightbox How 2 play
// // TODO : Add a favicon
// TODO : Rename the vars
// TODO : Add comments
// TODO : Record time : Call API every 0.5sec

// TODO : in Vue app ?

// TODO : Step by step method to create for day j


// Handle the input range
let inputPower = document.querySelector('#power');
let inputAngle = document.querySelector('#angle');
let ascendingRange = true;
let isShoot = false; // When the force and angle has been choosen
let isAngle = false; // When the force has been choosen
let isThrown = false;

// Form on start menu
var nameInput = document.querySelector('#name');
var countryInput = document.querySelector('#country');
var ballInput = document.querySelector('#sprite');
var ballInputLabel = document.querySelector('#labelSprite');
var startForm = document.querySelector('#form');
var hintValidation = document.querySelector('#hint');

// Leader board
var leaderBoard = document.querySelector('#leaderBoard');

// Final score
var score = 0;

var angle = 180;
var force = inputPower.value;
const MINFORCE = 0,
    MAXFORCE = 100,
    MINANGLE = 0,
    MAXANGLE = 180,
    SPEEDRANGE = 10;
var ascending = false;

var gameWidth = 960;
var gameHeight = 500;

// A GAME MECHANIC EXPLORER DEMO
// http://gamemechanicexplorer.com/#bullets-5

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'game');

var GameState = function() {};

// Load images and sounds
GameState.prototype.preload = function() {
    // Splash screen
    game.load.image('loading', 'assets/loading.png');
    game.load.image('brand', 'assets/logo.png');

    // Game assets
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('mountains', 'assets/sky/glacial_mountains.png')
    this.game.load.image('clouds', 'assets/sky/clouds_mg_2.png')
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('ball', 'assets/tennisball.png');
    this.game.load.spritesheet('catapult', 
        'assets/catapult.png',
        515, 520
    );
    // Light box how to play
    game.load.image("boxBack", "assets/box-bg.jpg");

    // Scripts
    this.game.load.script('utils',   'lib/utils.js');
    this.game.load.script('Splash',  'states/Splash.js');

    // Populate the coutry input
    fetch('https://restcountries.eu/rest/v2/all')
    .then(function(response) {
        return response.json();
    }).then(function(json) {
        json.forEach(function(country) {
            countryInput.innerHTML += `<option value="${country.alpha2Code}">${country.alpha2Code}</option>`;
        })
    });
};

// Setup the example
GameState.prototype.create = function() {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
};


game.state.add('GameState', GameState);
game.state.start('GameState');
window.focus();