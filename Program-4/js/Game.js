var SpaceHipster = SpaceHipster || {};

//title screen
SpaceHipster.Game = function(){};

SpaceHipster.Game.prototype = {
  create: function() {
  	//set world dimensions
    this.game.world.setBounds(0, 0, 1920, 1920);

    //background
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

    //create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
    this.player.scale.setTo(3);
    this.player.anchor.setTo(0.5, 0.5);
    
    //player initial score of zero
    this.playerScore = 0;
	  
	
    //enable player physics
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.playerSpeed = 120;
    this.player.body.drag.set(100);
    this.player.body.collideWorldBounds = true;
	
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //generate game elements
    this.generateCollectables();
    this.generateAsteriods();

    //show score
    this.showLabels();

    //sounds
    this.explosionSound = this.game.add.audio('explosion');
    console.log(this.explosionSound);
    this.collectSound = this.game.add.audio('collect');
    this.asteroidexplosion = this.game.add.audio('asteriodexplosion');
    this.fire = this.game.add.audio('fire');
	 
  	var bullets;
    var bulletTime;
	
    this.bulletTime = 0;
	 
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
	
	this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },
  
 
	
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      
      //move on the direction of the input
    this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
    this.player.angularVelocity = this.game.physics.arcade.angleToPointer(this.player);
    this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);	
    }
	
      //collision between player and asteroids
      this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);
      this.game.physics.arcade.collide(this.asteroids);
	  
      //collision between asteroids and bullets
	    this.game.physics.arcade.collide(this.bullet, this.asteroids, this.expoldeAsteroid, null, this);
      
      //overlapping between player and collectables
      this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
	   
      this.cursors = this.game.input.keyboard.createCursorKeys();
       this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
       if (this.cursors.up.isDown)
    {
        this.game.physics.arcade.accelerationFromRotation(this.player.body.rotation, 200,this.player.body.acceleration);
        //this.game.physics.arcade.velocityFromRotation(this.player.rotation, 200, this.player.body.velocity);
    }
    else
    {
        this.player.body.acceleration.set(0);
    }

    if (this.cursors.left.isDown)
    {
        this.player.body.angularVelocity = -300;
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.angularVelocity = 300;
    }
    else
    {
        this.player.body.angularVelocity = 0;
    }

	    if (this.fireButton.isDown){
		    this.fireBullet();
	    }
	  
  },
  	  
  generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numCollectables = this.game.rnd.integerInRange(100, 150)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      this.collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      this.collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      this.collectable.animations.play('fly');
    }

  },
  generateAsteriods: function() {
    var MinAsteroid,MaxAsteroid;  
    this.asteroids = this.game.add.group();
    this.asteroids = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        
    if (this.game.global.skillLevel == 'easy') {
      MinAsteroid = 20;
      MaxAsteroid = 40;
    }

    if (this.game.global.skillLevel == 'medium') {
      MinAsteroid = 50;
      MaxAsteroid = 100;
    }

    if (this.game.global.skillLevel == 'hard') {
      MinAsteroid = 150;
      MaxAsteroid = 200;
    }
    //enable physics in them
    this.asteroids.enableBody = true;

    //phaser's random number generator
    var numAsteroids = this.game.rnd.integerInRange(MinAsteroid, MaxAsteroid)
    var asteriod;
    
    for (var i = 0; i < numAsteroids; i++) {
      //add sprite
      this.generateAsteriod();
    }
  },
    generateAsteriod: function() {  
      var size =   [1,4,6,8,10,12,14];
      var asteroidSize =this.game.rnd.weightedPick(size);
      
        this.asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
       this.asteriod.scale.setTo(asteroidSize /4);

       this.asteriod.body.velocity.x = this.game.rnd.integerInRange(-200, 200) / asteroidSize ;
       this.asteriod.body.velocity.y = this.game.rnd.integerInRange(-200, 200) / asteroidSize ;
       this.asteriod.body.immovable = false;
       this.asteriod.body.collideWorldBounds = true;
       this.asteriod.body.bounce.x = 1;
       this.asteriod.body.bounce.y = 1;
    
  },
  hitAsteroid: function(player, asteroid) {
    //play explosion sound
    this.explosionSound.play();

    //make the player explode
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.player.kill();

    this.game.time.events.add(800, this.gameOver, this);
  },
  gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;

    //remove sprite
    collectable.destroy();
  },
  showLabels: function() {
    //score text
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  },
  
  fireBullet: function() {
	if (this.game.time.now > this.bulletTime)
   	{
       	this.bullet = this.bullets.getFirstExists(false);
       	if (this.bullet)
       	{
           	//  And fire it
			
           	this.bullet.reset(this.player.x+0.5, this.player.y+0.5 );
            this.bullet.lifespan = 2000;
           	this.bullet.rotation = this.player.rotation;
            this.game.physics.arcade.velocityFromRotation(this.player.rotation, 400, this.bullet.body.velocity)
           	this.bulletTime = this.game.time.now + 200;
       	}
         this.fire.play();
   	}
	
  },

  resetBullet: function (bullet) {

   	//  Called if the bullet goes out of the screen
   	this.bullet.kill();

  },
  expoldeAsteroid: function(bullet, asteriod) {
	this.bullet.kill();
	this.asteroidexplosion.play();
  	asteriod.kill();
  },
};

/*
TODO
-audio
-asteriod bounch
*/
