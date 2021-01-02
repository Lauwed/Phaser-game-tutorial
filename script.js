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
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
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
    this.add.image(400, 300, 'sky');
    
    // This creates a new Static Physics Group and assigns it to the local variable platforms
    // Static Body simply has a position and a size. It isn't touched by gravity
    // This is q stqtic group ; it's a way to group them bc similar objects and control
    // them all as one single unit, can also check for collision between Groups and other game objects.
    platforms = this.physics.add.staticGroup();

    // The call to refreshBody() is required because we have scaled a static physics body, 
    // so we have to tell the physics world about the changes we made
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player
    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true); // It will stop the player from being able to run off the edges of the screen or jump through the top

    // There are 9 frames in total, 4 for running left, 1 for facing the camera and 4 for running right. 
    // Note: Phaser supports flipping sprites to save on animation frames, but for the sake of this tutorial we'll keep it old school.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1 // Tell the animation to loop
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1 // Tell the animation to loop
    });

    // Collisions
    // In order to allow the player to collide with the platforms we can create a Collider object. 
    // This object monitors two physics objects (which can include Groups) and checks for collisions or overlap between them. 
    // If that occurs it can then optionally invoke your own callback, 
    // but for the sake of just colliding with platforms we don't require that:
    this.physics.add.collider(player, platforms);

    // Built-in Keyboard manager
    cursors = this.input.keyboard.createCursorKeys();

    // Stars
    stars = this.physics.add.group({
        key: 'star', // default texture
        repeat: 11, // 12 stars in total
        setXY: {
            x: 12,
            y: 0,
            stepX: 70 // spacing out the stars with a argin of 70 on the x axis
        }
    });

    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this); // trigger the function collectStar if the player overlap a star

    // Score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // Bombs
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}
function update() {
    if(cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if(cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
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