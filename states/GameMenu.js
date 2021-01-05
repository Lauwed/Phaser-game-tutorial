var GameMenu = function() {};

GameMenu.prototype = {
    init: function () {
        this.titleText = game.make.text(game.world.centerX, 100, "Catapult game", {
          font: 'bold 60pt PixelLife',
          fill: '#FFFFFF',
          align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
    },

    preload: function () {
        nameInput.addEventListener('input', function() {
            if(nameInput.value.length != 0) {
                nameInput.className = "";
            }
            else {
                nameInput.className = "danger";
            }
        });
    },
  
    create: function () {
        game.add.sprite(0, 0, 'sky');
        game.add.existing(this.titleText);
        game.stage.disableVisibilityChange = true; // Prevent pausing game while swith focus
                                                   // Will persist to all states

        // looks like we have to create a style for or menu option
        var optionStyle = { font: '60pt PixelLife', fill: 'white', align: 'left' };
        // the text for start
        var txt = game.add.text(game.width/2, game.height - 50, 'Play', optionStyle);
        txt.anchor.setTo(0.5);
        txt.setShadow(3, 3, 'rgba(0,0,0,0.2)', 5);
        // so how do we make it clickable?  We have to use .inputEnabled!
        txt.inputEnabled = true;
        // Now every time we click on it, it says "You did it!" in the console!
        txt.events.onInputUp.add(function () { 
            // Form validation
            if(nameInput.value.length === 0) {
                nameInput.className = "danger";
                hintValidation.innerHTML = 'The name is mandatory.';
            }
            else if(ballInput.files.length > 0) {
                if(ballInput.files[0].type == 'image/jpeg' && ballInput.files[0].type == 'image/png') {
                    nameInput.className = "danger";
                    hintValidation.innerHTML = 'The ball image has to be .png or .jpeg.';
                }
            }
            else {
                this.newBallTexture = startForm.querySelector('#preview') ? startForm.querySelector('#preview').src : '';
                game.state.start('Game');
            }
        });
        // Hover event
        txt.events.onInputOver.add(function (target) {
            target.fill = "#FEFFD5";
            target.setShadow(3, 3, 'rgba(0,0,0,0.7)', 5);
        });
        txt.events.onInputOut.add(function (target) {
            target.fill = "white";
            target.setShadow(3, 3, 'rgba(0,0,0,0.2)', 5);
        });

        // Show form
        startForm.style.display = 'block';
    }
}