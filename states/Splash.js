var Splash = function() {};

Splash.prototype = {

    loadScripts: function () {
        game.load.script('WebFont', 'lib/webfontloader.js');

        game.load.script('Game', 'states/Game.js');
        game.load.script('GameMenu', 'states/GameMenu.js');
        game.load.script('GameOver', 'states/GameOver.js');
        game.load.script('LeaderBoard', 'states/LeaderBoard.js');
    },
  
    loadFonts: function () {
        WebFontConfig = {
            custom: {
              families: ['PixelLife'],
              urls: ['assets/style/font.css']
            }
          }
    },

    addGameStates: function () {
        game.state.add("Game", Game);
        game.state.add("GameMenu", GameMenu);
        game.state.add("GameOver", GameOver);
        game.state.add("LeaderBoard", LeaderBoard);
    },
  
    init: function() {
        this.loadingBar = game.make.sprite(this.game.width/2, this.game.height - 150, "loading");
        this.logo       = game.make.sprite(this.game.width/2, this.game.height/2, 'brand');
        this.status     = game.make.text(this.game.width/2, this.game.height - 100, 'Loading...', {fill: 'white'});
        utils.centerGameObjects([this.logo, this.status, this.loadingBar]);
    },

    // The preload function then will call all of the previously defined functions:
    preload: function () {
        game.add.existing(this.logo).scale.setTo(0.25);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        this.loadScripts();
        this.loadFonts();
    },

    create: function() {
        this.status.setText('Ready!');
        this.addGameStates();

        setTimeout(function () {
            // We will load the main menu here
            game.state.start("GameMenu");
          }, 500);
    }
}