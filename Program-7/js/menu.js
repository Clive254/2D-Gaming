var menuState = {
	
    create: function() {
		//game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();
		//game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
		// If 'bestScore' is not defined
      // It means that this is the first time the game is played
       //if (!localStorage.getItem('bestScore')) {
     // Then set the best score to 0
       //localStorage.setItem('bestScore', 0);
         // }
        // Add a background image
        game.add.image(0, 0, 'background');
        // Display the name of the game
        var nameLabel = game.add.text(game.width/2, 80, 'Super Coin Box', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);
        // Show the score at the center of the screen
        var scoreLabel = game.add.text(game.width/2, game.height/2,
            'score: ' + game.global.score,
            { font: '25px Arial', fill: '#ffffff' });
			
        //scoreLabel.anchor.setTo(0.5, 0.5);
		//var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
        //var scoreLabel = game.add.text(game.width/2, game.height/2, text, { font: '25px Arial', fill: '#ffffff', align: 'center' });
		
        // Explain how to start the game
        var startLabel = game.add.text(game.width/2, game.height-80,
            'press the up arrow key to start',
            { font: '25px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
		game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();
        // Create a new Phaser keyboard variable: the up arrow key
        // When pressed, call the 'start' function once
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.start, this);
    },
    start: function() {
        // Start the actual game
        game.state.start('play');
    }	  
};