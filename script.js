// // TODO : fix the trajectory
// // TODO : Find the trajectory's not working...

// TODO : let ball roll during 0.5s at the end + defocus camera ?

// TODO : Start screen : Nom joueur + select 2 lettres country => Mandatories
// TODO : Start screen : upload own image of the projectile ; .png or .jpeg ; format is square ; default if no upload

// // TODO : Angle it's a VERTICAL bar => Simple progress bar ; every 0.25 seconds

// TODO : Win screen : leader bord top 5 ; button to return start screen
// TODO : Game over screen ; outside screen ; angle -5deg or/and power -30%

// TODO : Indicate where API calls has to be made


// Handle the input range
let inputPower = document.querySelector('#power');
let inputAngle = document.querySelector('#angle');
let ascendingRange = true;
let isShoot = false; // When the force and angle has been choosen
let isAngle = false; // When the force has been choosen
let isThrown = false;

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
    game.load.image('loading', 'assets/loading.png');
    game.load.image('brand', 'assets/logo.png');

    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('mountains', 'assets/sky/glacial_mountains.png')
    this.game.load.image('clouds', 'assets/sky/clouds_mg_2.png')
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('ball', 'assets/tennisball.png');
    this.game.load.spritesheet('catapult', 
        'assets/catapult.png',
        515, 520
    );

    this.game.load.script('utils',   'lib/utils.js');
    this.game.load.script('Splash',  'states/Splash.js');
};

// Setup the example
GameState.prototype.create = function() {
    game.state.add('Splash', Splash);
    game.state.start('Splash');

    // Display the progress bars at the right place
    inputPower.style.top = game.height - 50 + 'px';
    inputPower.style.left = game.height/2 + 'px';

    inputAngle.style.top = game.height/2 + 'px';
    inputAngle.style.left = '5px';
};


game.state.add('GameState', GameState);
game.state.start('GameState');
window.focus();