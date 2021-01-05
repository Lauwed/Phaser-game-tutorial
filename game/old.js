var ange = 90;

var config = {
    // Property can be either Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO. 
    // This is the rendering context that you want to use for your game. 
    // The recommended value is Phaser.AUTO which automatically tries to use WebGL
    // but if the browser or device doesn't support it it'll fall back to Canvas. 
    // The canvas element that Phaser creates will be simply be appended to the 
    // document at the point the script was called, but you can also specify a 
    // parent container in the game config should you wish.
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // using the Arcade Physics system
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }, // Y bc the gravity is from the top to the bottom
            debug: false
        }
    },
    // Property of the configuration object will be covered in more detail further on in this tutorial.
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Start the procress of bringing Phaser to life
var game = new Phaser.Game(config);

var score = 0;
var scoreText;

// Here we load all the assets
function preload() {
    this.load.image('sky', 'assets/sky/sky.png');
    this.load.image('mountains', 'assets/sky/glacial_mountains.png')
    this.load.image('clouds', 'assets/sky/clouds_mg_2.png')
    this.load.image('ground', 'assets/platform.png');
    this.load.image('ball', 'assets/tennisball.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('catapult', 
        'assets/catapult.png',
        { frameWidth: 515, frameHeight: 520 }
    );
}

// Display the assets
// Create the player
// Set the animation
// Create the colliders
// Add stars
// Display score
// Add bombs
function create() {
    // Add the sky
    this.add.image(400, 300, 'sky').setScale(3);
    this.add.image(400, 300, 'mountains').setScale(2.5);
    this.add.image(400, 300, 'clouds').setScale(2.5);
    
    // This creates a new Static Physics Group and assigns it to the local variable platforms
    // Static Body simply has a position and a size. It isn't touched by gravity
    // This is q stqtic group ; it's a way to group them bc similar objects and control
    // them all as one single unit, can also check for collision between Groups and other game objects.
    platforms = this.physics.add.staticGroup();

    // The call to refreshBody() is required because we have scaled a static physics body, 
    // so we have to tell the physics world about the changes we made
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // The player
    player = this.physics.add.sprite(100, 450, 'catapult').setScale(0.40);
    player.setCollideWorldBounds(true); // It will stop the player from being able to run off the edges of the screen or jump through the top

    // The ball
    ball = this.physics.add.sprite(100, 450, 'ball');

    // Setup a canvas to draw the trajectory on the screen
    graphics = this.add.graphics();
    path = new Phaser.Curves.Path(50, 500);
    path.lineTo(150, 200);
    // cubicBezierTo: function (x, y, control1X, control1Y, control2X, control2Y)
    path.cubicBezierTo(400, 500, 200, 100, 400, 100);

    // There are 9 frames in total, 4 for running left, 1 for facing the camera and 4 for running right. 
    // Note: Phaser supports flipping sprites to save on animation frames, but for the sake of this tutorial we'll keep it old school.
    this.anims.create({
        key: 'throw',
        frames: this.anims.generateFrameNumbers('catapult', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });
    this.anims.create({
        key: 'return',
        frames: this.anims.generateFrameNumbers('catapult', { start: 3, end: 0 }),
        frameRate: 10,
        repeat: 0
    });

    // Collisions
    // In order to allow the player to collide with the platforms we can create a Collider object. 
    // This object monitors two physics objects (which can include Groups) and checks for collisions or overlap between them. 
    // If that occurs it can then optionally invoke your own callback, 
    // but for the sake of just colliding with platforms we don't require that:
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(ball, platforms);

    // Built-in Keyboard manager
    cursors = this.input.keyboard.createCursorKeys();
}
function update() {
    graphics.clear();
    graphics.lineStyle(2, 0xffffff, 1);

    path.draw(graphics);

    drawTrajectory(this.timeOffset, angle);

    if(cursors.space.isDown) {
        player.anims.play('throw', false);

        console.log('yay');
    }
}

// HELPER FUNCTIONS
function collectStar (player, star) {
    star.disableBody(true, true);

    // Update score
    score += 10;
    scoreText.setText('Score: ' + score);

    // If there is no more star
    if (stars.countActive(true) === 0)
    {
        // display again the stars
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        // A random player for the bomb to appear
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}
function hitBomb (player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play('turn');

    gameOver = true;
}

function drawTrajectory(timeOffset, angle, gravity, speed, ballX, ballY) {
    // Clear the bitmap
    graphics.clear();

    // Set fill style to white
    graphics.lineStyle(2, 0xffffff, 1);

    // Calculate a time offset. This offset is used to alter the starting
    // time of the draw loop so that the dots are offset a little bit each
    // frame. It gives the trajectory a "marching ants" style animation.
    var MARCH_SPEED = 40; // Smaller is faster
    timeOffset = timeOffset + 1 || 0;
    timeOffset = timeOffset % MARCH_SPEED;

    // Just a variable to make the trajectory match the actual track a little better.
    // The mismatch is probably due to rounding or the physics engine making approximations.
    var correctionFactor = 0.99;

    // Draw the trajectory
    // http://en.wikipedia.org/wiki/Trajectory_of_a_projectile#Angle_required_to_hit_coordinate_.28x.2Cy.29
    var theta = -angle;
    var x = 0, y = 0;
    for(var t = 0 + timeOffset/(1000*MARCH_SPEED/60); t < 3; t += 0.03) {
        x = speed * t * Math.cos(theta) * correctionFactor;
        y = speed * t * Math.sin(theta) * correctionFactor - 0.5 * gravity * t * t;
        this.bitmap.context.fillRect(x + ballX, ballY - y, 3, 3);
        if (y < -15) break;
    }

    this.bitmap.dirty = true;
}