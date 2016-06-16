var playState = {

    create: function() { 
	//mobile inputs.
	   if (!game.device.desktop) {
       this.addMobileInputs();
        }
		
     if (!game.device.dekstop) {
    // Call 'orientationChange' when the device is rotated
    game.scale.onOrientationChange.add(this.orientationChange, this);

    // Create an empty label to write the error message if needed
    this.rotateLabel = game.add.text(game.width/2, game.height/2, '',
     { font: '30px Arial', fill: '#fff', backgroundColor: '#000' });
      this.rotateLabel.anchor.setTo(0.5, 0.5);
    // Call the function at least once
    this.orientationChange();
    }
		
        this.cursor = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);

        this.createWorld();

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'score: 0', 
            { font: '18px Arial', fill: '#ffffff' });
        game.global.score = 0; 

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        this.nextEnemy = 0;

        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead'); 

        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setScale(2, 0, 2, 0, 800);
        this.emitter.gravity = 0;
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        if (!this.player.alive) {
            return;
        }
		
		 if((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.onFloor()) {
           this.jumpSound.play();
          this.player.body.velocity.y = -360;
        }
        
        this.movePlayer(); 

        if (!this.player.inWorld) {
            this.playerDie();
        }

        if (this.nextEnemy < game.time.now) {
            var start = 4000, end = 1000, score = 100;
            var delay = Math.max(start - (start - end) * game.global.score / score, end);
            
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
    },

    movePlayer: function() {
    // If 0 finger are touching the screen
        if (game.input.totalActivePointers == 0) {
    // Make sure the player is not moving
        this.moveLeft = false;
        this.moveRight = false;
         }
		
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        }
        else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        }
        else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop(); 
            this.player.frame = 0; 
        }
        
        if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.touching.down){
            this.jumpSound.play();
            this.player.body.velocity.y = -320;
			this.jumpPlayer();
        }
    },

    takeCoin: function(player, coin) {
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        
        this.updateCoinPosition();

        this.coinSound.play();
        this.coin.scale.setTo(0, 0);
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
        game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100).yoyo(true).start();
    },

    updateCoinPosition: function() {
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, 
            {x: 60, y: 140}, {x: 440, y: 140}, 
            {x: 130, y: 300}, {x: 370, y: 300} 
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(coinPosition);
        this.coin.reset(newPosition.x, newPosition.y);
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();

        if (!enemy) {
            return;
        }

        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },

    createWorld: function() {
        /* this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls); 
        game.add.sprite(480, 0, 'wallV', 0, this.walls); 
        game.add.sprite(0, 0, 'wallH', 0, this.walls); 
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls); 
        game.add.sprite(300, 320, 'wallH', 0, this.walls); 
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); 
        game.add.sprite(400, 160, 'wallH', 0, this.walls); 
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true); */
		
		// Create the tilemap
      this.map = game.add.tilemap('map');

    // Add the tileset to the map
      this.map.addTilesetImage('tileset');

    // Create the layer by specifying the name of the Tiled layer
      this.layer = this.map.createLayer('Tile Layer 1');

    // Set the world size to match the size of the layer
      this.layer.resizeWorld();

    // Enable collisions for the first tilset element (the blue wall)
      this.map.setCollision(1);
		
    },

	 addMobileInputs: function() {
         // Add the jump button
        var jumpButton = game.add.sprite(401, 272, 'jumpButton');
        jumpButton.inputEnabled = true;
        jumpButton.alpha = 0.5;
		jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        
		// Call 'jumpPlayer' when the 'jumpButton' is pressed
        jumpButton.events.onInputDown.add(this.jumpPlayer, this);

		// Movement variables
        this.moveLeft = false;
        this.moveRight = false;
		
		
    // Add the move left button
         var leftButton = game.add.sprite(50, 272, 'leftButton');
        leftButton.inputEnabled = true;
        leftButton.alpha = 0.5;
		leftButton.events.onInputOver.add(this.setLeftTrue, this);
        leftButton.events.onInputOut.add(this.setLeftFalse, this);
        leftButton.events.onInputDown.add(this.setLeftTrue, this);
        leftButton.events.onInputUp.add(this.setLeftFalse, this);

    // Add the move right button
        var rightButton = game.add.sprite(130, 272, 'rightButton');
        rightButton.inputEnabled = true;
        rightButton.alpha = 0.5;
		rightButton.events.onInputOver.add(this.setRightTrue, this);
        rightButton.events.onInputOut.add(this.setRightFalse, this);
        rightButton.events.onInputDown.add(this.setRightTrue, this);
        rightButton.events.onInputUp.add(this.setRightFalse, this);
    },
	
	// Basic functions that are used in our callbacks

    setLeftTrue: function() {
        this.moveLeft = true;
    },
    setLeftFalse: function() {
        this.moveLeft = false;
    },
    setRightTrue: function() {
        this.moveRight = true;
    },
    setRightFalse: function() {
        this.moveRight = false;
    },
	
	
	jumpPlayer: function() {
    // If the player is touching the ground
       if (this.player.body.onFloor()) {
        // Jump with sound
        this.player.body.velocity.y = -320;
        this.jumpSound.play();
       }
    },
	
	
    playerDie: function() {
        this.player.kill();
        
        this.deadSound.play();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 800, null, 15);
        game.time.events.add(1000, this.startMenu, this);
        game.camera.shake(0.02, 300);
    },
	
	orientationChange: function() {
    // If the game is in portrait (wrong orientation)
       if (game.scale.isPortrait) {
        // Pause the game and add a text explanation
        game.paused = true;
        this.rotateLabel.text = 'rotate your device in landscape';
    }
    // If the game is in landscape (good orientation)
      else {
        // Resume the game and remove the text
        game.paused = false;
        this.rotateLabel.text = '';
      }
    },
	

    startMenu: function() {
        game.state.start('menu');
    },
};
