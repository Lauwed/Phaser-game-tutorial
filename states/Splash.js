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

        // Display the progress bars at the right place
        inputPower.style.top = game.height - 50 + 'px';
        inputPower.style.left = game.height/2 + 'px';

        inputAngle.style.top = game.height/2 + 'px';
        inputAngle.style.left = '-125px';

        // Form
        startForm.style.top = game.height/2 + 25 + 'px';
        startForm.style.left = game.width/2 + 'px';
        // prevent submit
        startForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
        // Ball image input
        ballInput.addEventListener('input', function(e) {
            var imageType = /^image\//;
            var file = ballInput.files[0];
            if (!imageType.test(file.type)) {
                hintValidation.innerHTML = 'Only images with .png or .jp(e)g extensions are accepted.';
            }
            else {
                ballInputLabel.innerHTML = '';
                var img = document.createElement("img");
                img.id = 'preview';
                ballInputLabel.appendChild(img); 
                ballInputLabel.innerHTML += ' ' + file.name;
                
                img.src = window.URL.createObjectURL(file);
                img.onload = function () {
                    // If it's not a square
                    if(this.height !== this.width) {
                        hintValidation.innerHTML = 'The image has to be a square';
                    }

                    window.URL.revokeObjectURL(this.src);
                };
            }
        });
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