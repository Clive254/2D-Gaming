// Initialize Phaser
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
// Define our global variable
game.global = {
    score: 0
};
// Add all the states
game.state.add('boot', bootState);
//game.state.add('load', loadState);
game.state.add('load', loadState);
//game.state.add('menu', menuState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('play1', playState1);
// Start the 'boot' state
game.state.start('boot');