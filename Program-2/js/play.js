var playState= {
	
	 preload: function() {  
	 this.jumpSound = game.add.audio('jump');
	 this.coinSound = game.add.audio('coin');
	 this.deadSound = game.add.audio('dead');
	 },

create: function() { 
        //game.stage.backgroundColor = '#3498db';
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        //game.renderer.renderSession.roundPixels = true;
		
	 
		//this.music = game.add.audio('music'); // Add the music
        //this.music.loop = true; // Make it loop
        //this.music.play(); // Start the music

        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.createWorld();
		// Create the 'right' animation by looping the frames 1 and 2
        this.player.animations.add('right', [1, 2], 8, true);
       // Create the 'left' animation by looping the frames 3 and 4
        this.player.animations.add('left', [3, 4], 8, true);
        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '18px Arial', fill: '#ffffff' });
		game.global.score = 0;
		
		//it is a variable which counts deaths of the player.
		//we are incrementing it when player collides with enemy or player exits the world.
		this.deathCounter = game.add.text(395, 300, 'deaths: 0', { font: '18px Arial', fill: '#ffffff' });
        this.deaths = 0;
		
		//its a varible which is set to 120 seconds and decrements by 1, every second.
		this.timerCount = game.add.text(390, 30, 'timer: 120', { font: '18px Arial', fill: '#ffffff' });
        this.timer = 120;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
		
		//this looped event calls udateCounter method every second[1]
		game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		
		// Create the emitter with 15 particles. We don't need to set the x y
       // Since we don't know where to do the explosion yet
      this.emitter = game.add.emitter(0, 0, 15);

      // Set the 'pixel' image for the particles
      this.emitter.makeParticles('pixel');

      // Set the x and y speed of the particles between -150 and 150
      // Speed will be randomly picked between -150 and 150 for each particle
      this.emitter.setYSpeed(-150, 150);
      this.emitter.setXSpeed(-150, 150);

      // Scale the particles from 2 time their size to 0 in 800ms
      // Parameters are: startX, endX, startY, endY, duration
      this.emitter.setScale(2, 0, 2, 0, 800);

      // Use no gravity
      this.emitter.gravity = 0;
    },
	
	//here we decrement the timer by 1,every second.
	//when the timer is 0, the game restarts.
	//also displays the timer.
	updateCounter: function(){
		this.timer -= 1;
		if(this.timer == 0){
			game.state.start('main');
		}		
		this.timerCount.text = 'timer: ' + this.timer;		
	},

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

        this.movePlayer(); 

        if (!this.player.inWorld) {
            this.playerDie();
        }
    },	
	
    movePlayer: function() {
         if (this.cursor.left.isDown) {
        this.player.body.velocity.x = -200;
        this.player.animations.play('left'); // Left animation
    }
    else if (this.cursor.right.isDown) {
        this.player.body.velocity.x = 200;
        this.player.animations.play('right'); // Right animation
    }
    else {
        this.player.body.velocity.x = 0;
        this.player.animations.stop(); // Stop animations
        this.player.frame = 0; // Change frame (stand still)
    }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
			this.jumpSound.play();
            this.player.body.velocity.y = -320;
			// Add this inside the 'movePlayer' function, in the 'if(player jumps)'
	        
        }      
    },

    takeCoin: function(player, coin) {
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100).yoyo(true).start();
		
		// Put this in the 'takeCoin' function
        this.coinSound.play();
		// Scale the coin to 0 to make it invisible
        this.coin.scale.setTo(0, 0);
        // Grow the coin back to its original scale in 300ms
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
        game.global.score += 5;
        // Use the new score variable
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.updateCoinPosition();
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
        this.walls = game.add.group();
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

        this.walls.setAll('body.immovable', true);
    },
	
	//this method is to count deaths of the player.
	//here we respawn the player in random 6 positions after a death.
    playerDie: function() {
		//this.music.stop();
		// And this in the 'playerDie' function
        this.deadSound.play();
        //game.state.start('main');
		
		//game.state.start('menu');
		
		// Set the position of the emitter on top of the player
       this.emitter.x = this.player.x;
       this.emitter.y = this.player.y;
       // Start the emitter by exploding 15 particles that will live 800ms
       this.emitter.start(true, 800, null, 15);
       // Flash the color white for 300ms
       game.camera.flash(0xffffff, 10);
	   game.camera.shake(0.02,100);
       this.player.kill();
      

      // Call the 'startMenu' function in 1000ms
      game.time.events.add(1000, this.startMenu, this);
    },
	
	startMenu: function() {
    game.state.start('menu');
}
};

//var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
//game.state.add('main', mainState);
//game.state.start('main');