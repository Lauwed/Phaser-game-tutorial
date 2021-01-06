let currentSpeed = 0;
let friction = 0.9;

let isUp = true;

var Game = function() {};

Game.prototype = {
    preload: function() {
        // Load the custom texture if the player uploaded one
        if(startForm.querySelector('#preview')) {
            this.game.load.image('ball', startForm.querySelector('#preview').src);
        }
    },
    create: function() {
        //  Make the world larger than the actual canvas
        this.game.world.setBounds(0, 0, 1000000, 2000);
        this.game.camera.setPosition(0, this.game.world.height);

        // Add the sky
        //this.sky = this.game.add.image(480, 250, 'sky').anchor.setTo(0.5, 0.5);
        this.game.stage.backgroundColor = '479cde';

        // Add the ground
        this.ground = this.game.add.sprite(480, this.game.world.height, 'ground');
        this.ground.anchor.setTo(0.5, 1);
        this.ground.scale.setTo(1000000, 2);

        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);

        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        // Define constants
        this.SHOT_DELAY = 300; // milliseconds (10 balls/3 seconds)
        this.BULLET_SPEED = force; // pixels/second
        this.NUMBER_OF_BULLETS = 20;
        this.GRAVITY = 980; // pixels/second/second

        // Catapult
        this.catapult = this.game.add.sprite(150, this.game.world.height - 125, 'catapult');
        this.catapult.anchor.setTo(0.5, 0.5);
        this.catapult.scale.setTo(0.5, 0.5);

        this.catapult.animations.add('run');

        // Create an object representing our ballRock
        this.ballRock = this.game.add.sprite(55, this.game.world.height - 130, 'ball')
        this.ballRock.width = 40;
        this.ballRock.height = 40;
        this.ballRock.anchor.setTo(0.5, 0.5); // Set the pivot point to the center of the ballRock
        this.ballRock.angle = -45;

        // Create an object pool of balls
        this.ballPool = this.game.add.group();
        // Create each ball and add it to the group.
        this.ball = this.game.add.sprite(0, 0, 'ball');
        this.ball.width = 40;
        this.ball.height = 40;

        // Set its pivot point to the center of the ball
        this.ball.anchor.setTo(0.5, 0.5);

        // Enable physics on the ball
        this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        this.ball.kill();

        // Turn on gravity
        game.physics.arcade.gravity.y = this.GRAVITY;


        // Setup a canvas to draw the trajectory on the screen
        this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        this.game.add.image(0, (game.world.height - game.height), this.bitmap);

        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        this.game.input.activePointer.x = this.game.width/2;
        this.game.input.activePointer.y = this.game.height/2 - 100;


        // Hide form
        startForm.style.display = 'none';
        // Show inputs
        inputAngle.style.display = 'block';
        inputPower.style.display = 'block';

        // Show score
        var optionStyle = { font: '60pt PixelLife', fill: 'white', align: 'left' };
        this.score = game.add.text(game.width/2, this.game.world.height - this.game.height + 100, 'Score: 0', optionStyle);
        this.score.anchor.setTo(0.5);

        // Show FPS
        this.game.time.advancedTiming = true;
        this.fpsText = this.game.add.text(
            20, this.game.world.height - this.game.height + 20, '', { font: '16px Arial', fill: '#ffffff' }
        );

        //  Register the keys.
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //  Stop the following keys from propagating up to the browser
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

        // Show the how to play box
        this.howToPlayBox();
    },
    update: function() {
        if (this.game.time.fps !== 0) {
            this.fpsText.setText(this.game.time.fps + ' FPS');
        }

        // Update the score with the x position of the ball
        this.score.setText('Score: ' + parseInt((this.ball.x - this.ballRock.x)/100) + 'm');
        this.score.position.setTo(this.game.camera.x + this.game.width/2, this.game.camera.y + 100);
    
        //this.game.physics.arcade.collide(this.ball, this.ground);

        //console.log(this.ball.body.speed)
        // Stock current speed
        if(this.ball.speed > 0 && typeof this.ball.speed !== 'undefined') currentSpeed = this.ball.speed;

        // Rotation ball during flight
        this.ball.rotation = Math.atan2(this.ball.body.velocity.y, this.ball.body.velocity.x);

        // bounces
        if(isThrown) {
            let velocity = this.ball.body.velocity;

            this.ball.body.velocity.x -= friction;
            this.ball.body.velocity.y -= friction;

            // Game over
            if(this.ball.y <= 0) {
                game.state.start('GameOver');
            }
            else if(this.game.physics.arcade.collide(this.ball, this.ground)) {
                if(this.ball.body.speed < this.BULLET_SPEED*0.2) { // If speed if less than 20%
                    console.log('20');
                    this.ball.body.velocity.y = 0;

                    // Win game
                    if(this.ball.body.velocity.x <= 0) {
                        score = parseInt((this.ball.x - this.ballRock.x)/100);
                        this.game.state.start('LeaderBoard');
                    }
                }
                else if(this.ball.body.speed < this.BULLET_SPEED*0.6) { // If speed less than 60%
                    console.log('60', this.ball.body.angle);
                    friction = 0.5;

                    this.ball.rotation -= 90 + this.ball.rotation*0.1;

                    this.ball.body.velocity.y = Math.sin(this.ball.rotation) * this.ball.body.speed;
                }
                else {
                    console.log(this.ball.body.speed, force, velocity.angle(this.ground, true));
                    this.ball.rotation -= 90;

                    this.ball.body.velocity.y = Math.sin(this.ball.rotation) * this.ball.body.speed;
                }
            }
        }
    
        // Update the force
        this.BULLET_SPEED = force; // pixels/second
        // Rotate all living balls to match their trajectory
        this.ballPool.forEachAlive(function(ball) {
            ball.rotation = Math.atan2(ball.body.velocity.y, ball.body.velocity.x);
        }, this);
    
        // Shoot a ball
        if (this.spaceKey.isDown) {
            if(isShoot) {
                if(inputPower.value < 30) game.state.start('GameOver');
                clearInterval(game.forceVariation);
    
                this.catapult.animations.play('run', 15, false);
                this.shootball();
            }
            else {
                if(inputAngle.value - 90 > 85) game.state.start('GameOver');

                clearInterval(game.angleVariation);
                console.log(inputAngle.value - 90);
    
                clearInterval(game.forceVariation);
                // The variation of the force
                game.forceVariation = window.setInterval(() => {
                    if(inputPower.value >= MINFORCE && inputPower.value < MAXFORCE && ascendingRange) {
                        inputPower.value = parseInt(inputPower.value) + 1;
                        if(inputPower.value == MAXFORCE) ascendingRange = false;
                    }
                    else {
                        inputPower.value = parseInt(inputPower.value) - 1;
                        if(inputPower.value == MINFORCE) ascendingRange = true;
                    }
                    force = inputPower.value*20;
                }, SPEEDRANGE);
    
                isAngle = true;
            }
        }
        if(this.spaceKey.isUp) {
            if(isAngle) {
                isShoot = true;
            }
        }
    },
    shootball: function() {
        // Hidden inputs
        inputAngle.style.display = 'none';
        inputPower.style.display = 'none';

        // Enforce a short delay between shots by recording
        // the time that each ball is shot and testing if
        // the amount of time since the last shot is more than
        // the required delay.
        if (this.lastballShotAt === undefined) this.lastballShotAt = 0;
        if (this.game.time.now - this.lastballShotAt < this.SHOT_DELAY) return;
        this.lastballShotAt = this.game.time.now;
    
        this.ballRock.visible = false;
        clearInterval(game.angleVariation);
    
        // If there aren't any balls available then don't shoot
        if (this.ball === null || this.ball === undefined) return;
    
        // Revive the ball
        // This makes the ball "alive"
        this.ball.revive();
    
        // balls should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the ball if
        // its x,y coordinates are outside of the world.
        this.ball.checkWorldBounds = true;
        this.ball.outOfBoundsKill = true;
    
        // Set the ball position to the ballRock position.
        this.ball.reset(this.ballRock.x, this.ballRock.y);
        this.ball.rotation = this.ballRock.rotation;
    
        this.game.camera.follow(this.ball);
        isThrown = true;
    
        // Shoot it in the right direction
        this.ball.body.velocity.x = Math.cos(this.ball.rotation) * this.BULLET_SPEED;
        this.ball.body.velocity.y = Math.sin(this.ball.rotation) * this.BULLET_SPEED;
    },
    howToPlayBox: function() {
        //call this line of code when you want to show the message box
        //message, width and height
        this.showMessageBox('How to play', 
                            "The rules are simple - The vertical gauge is for the angle and the second for the power. Press SPACEBAR once to set the angle, then a second time to set the power. Try to throw the ball as far as possible ! Good luck !",
                            game.width*3/4, game.height*3/4);
    },
    showMessageBox: function(titleText, text, w = 300, h = 300) {
        //just in case the message box already exists
        //destroy it
        if (this.msgBox) {
            this.hideBox();
        }
        //make a group to hold all the elements
        this.msgBox = game.add.group();
        //make the back of the message box
        var back = game.add.sprite(0, 0, "boxBack"); // Position must 0,0 because position is relative to msgBox
        // The title
        var title = game.add.text(0, 0, titleText, { font: '30pt PixelLife', fill: 'black', align: 'left' });
        //make a text field
        var instructions = game.add.text(0, 0, text, { font: '20pt PixelLife', fill: 'black', align: 'left' });
        //set the textfeild to wrap if the text is too long
        instructions.wordWrap = true;
        //make the width of the wrap 90% of the width 
        //of the message box
        instructions.wordWrapWidth = w * .9;

        //set the width and height passed
        //in the parameters
        back.width = w;
        back.height = h;

        //add the elements to the group
        this.msgBox.add(back);
        this.msgBox.add(title);
        this.msgBox.add(instructions);
        this.msgBox.add(this.createOkButton(back));


        //set the message box in the center of the screen
        this.msgBox.x = game.width / 2 - this.msgBox.width / 2;
        this.msgBox.y = game.world.height - game.height / 2 - this.msgBox.height / 2;

        //set the title
        title.x = back.width / 2 - title.width / 2;
        title.y = 50 - title.height / 2;
        //set the text in the middle of the message box
        instructions.x = back.width / 2 - instructions.width / 2;
        instructions.y = back.height / 2 - instructions.height / 2;
        //make a state reference to the messsage box
        //this.msgBox = msgBox;
    },
    createOkButton: function(back) {
        // Create OK buttons and events
        var okButton = game.add.text(back.width / 2, back.height - 50, 'Roger !', { font: '40pt PixelLife', fill: 'white', align: 'left' });
        okButton.anchor.setTo(0.5);
        okButton.setShadow(3, 3, 'rgba(0,0,0,0.2)', 5);
        okButton.inputEnabled = true;
        okButton.events.onInputUp.add(function () { 
            // Hide the box
            this.hideBox();

            // Start time record
            // Stock actual time
            this.startTime = Date.now();
            // Record time every 0.5 seconds
            game.timeRecords = window.setInterval(function() {
                // Get time elapsed
                let timeElapsed = Math.floor(Date.now() - this.startTime / 1000);
                console.log(timeElapsed, Date.now(), this.startTime);

                // API Call
                // TODO
            }.bind(this), 500);

            // Start interval
            // The variation of the angle
            game.angleVariation = window.setInterval(function() {
                if(inputAngle.value >= MINANGLE && inputAngle.value < MAXANGLE && ascendingRange) {
                inputAngle.value = parseInt(inputAngle.value) + 1;
                if(inputAngle.value == MAXANGLE) ascendingRange = false;
                }
                else {
                inputAngle.value = parseInt(inputAngle.value) - 1;
                if(inputAngle.value == MINANGLE) ascendingRange = true;
                }
                this.ballRock.angle = inputAngle.value - 90;
            }.bind(this), SPEEDRANGE);
        }.bind(this));
        // Hover event
        okButton.events.onInputOver.add(function (target) {
            target.setShadow(3, 3, 'rgba(0,0,0,0.7)', 5);
        });
        okButton.events.onInputOut.add(function (target) {
            target.setShadow(3, 3, 'rgba(0,0,0,0.2)', 5);
        });

        return okButton;
    },
    hideBox: function() {
        //destroy the box when the button is pressed
        this.msgBox.destroy();
    }
}