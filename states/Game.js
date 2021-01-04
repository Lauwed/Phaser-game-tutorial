let currentSpeed = 0;
let friction = 0.9;

let isUp = true;

var Game = function() {};

Game.prototype = {
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
        this.ballRock = this.game.add.sprite(55, this.game.world.height - 130, 'ball');
        this.ballRock.anchor.setTo(0.5, 0.5); // Set the pivot point to the center of the ballRock
        this.ballRock.angle = -45;

        // Create an object pool of balls
        this.ballPool = this.game.add.group();
        // Create each ball and add it to the group.
        this.ball = this.game.add.sprite(0, 0, 'ball');

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


        // Show inputs
        inputAngle.style.display = 'block';
        inputPower.style.display = 'block';
        // The variation of the angle
        this.angleVariation = window.setInterval(function() {
            console.log(inputAngle.value)
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

        this.cursors = game.input.keyboard.createCursorKeys();
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
        clearInterval(this.angleVariation);
    
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
                console.log('gameover');
            }
            else if(this.game.physics.arcade.collide(this.ball, this.ground)) {
                if(this.ball.body.speed < this.BULLET_SPEED*0.2) { // If speed if less than 20%
                    console.log('20');
                    this.ball.body.velocity.y = 0;

                    friction = 6;

                    if(this.ball.body.velocity.x <= 0) {
                        console.log('win');
                        this.game.state.start('LeaderBoard')
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
                //console.log(this.angleVariation)
                clearInterval(this.forceVariation);
    
                this.catapult.animations.play('run', 15, false);
                this.shootball();
            }
            else {
                clearInterval(this.angleVariation);
    
                clearInterval(this.forceVariation);
                // The variation of the force
                this.forceVariation = window.setInterval(() => {
                    if(inputPower.value >= MINFORCE && inputPower.value < MAXFORCE && ascendingRange) {
                    inputPower.value = parseInt(inputPower.value) + 1;
                    if(inputPower.value == MAXFORCE) ascendingRange = false;
                    }
                    else {
                    inputPower.value = parseInt(inputPower.value) - 1;
                    if(inputPower.value == MINFORCE) ascendingRange = true;
                    }
                    force = inputPower.value*10;
                    //console.log(force)
                }, SPEEDRANGE);
    
                isAngle = true;
            }
        }
        if(this.spaceKey.isUp) {
            if(isAngle) {
                isShoot = true;
            }
        }
    }
}