var GameOver = function() {};

GameOver.prototype = {
    preload: function() {
        // Hide inputs
        inputAngle.style.display = 'none';
        inputPower.style.display = 'none';
    },
    create: function() {
        // Clear time record
        clearInterval(game.timeRecords);

        this.game.stage.backgroundColor = '#000000';

        // looks like we have to create a style for or menu option
        var optionStyle = { font: '60pt PixelLife', fill: 'white', align: 'left' };
        // the text for Game over
        var txt = game.add.text(game.width/2, game.height/2, 'Game Over', optionStyle);
        txt.anchor.setTo(0.5);

        // the text for restart
        var restart = game.add.text(game.width/2, game.height - 100, 'Restart', { font: '30pt PixelLife', fill: 'white', align: 'left' });
        restart.anchor.setTo(0.5);
        restart.inputEnabled = true;
        restart.events.onInputUp.add(function () { 
            this.resetGame();
            game.state.start('GameMenu');
        }.bind(this));
        // Hover event
        restart.events.onInputOver.add(function (target) {
            target.fill = "green";
            target.setShadow(3, 3, 'rgba(0,0,0,0.7)', 5);
        });
        restart.events.onInputOut.add(function (target) {
            target.fill = "white";
            target.setShadow(3, 3, 'rgba(0,0,0,0.2)', 5);
        });
    },
    resetGame: function() {
        score = 0;
        ascendingRange = true;
        isShoot = false; // When the force and angle has been choosen
        isAngle = false; // When the force has been choosen
        isThrown = false;
        angle = 180;
        force = 0;
        ascending = false;
        currentSpeed = 0;
        isUp = true;

        console.log(game)

        clearInterval(game.angleVariation);
        clearInterval(game.forceVariation);

        inputPower.value = force;
        inputAngle.value = angle;
    }
}