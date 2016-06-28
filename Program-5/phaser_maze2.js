// mods by Patrick OReilly
// twitter: @pato_reilly

var game = new Phaser.Game(900, 900, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('matching', 'assets/maps/Tileset.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/tiles/phaser_mz_tiles2.png', 27, 27, -1, 1, 1);	

    game.load.spritesheet('chick', 'assets/sprites/chick.png', 16, 18);
    game.load.spritesheet('cat', 'assets/sprites/baddie_cat_1.png', 16, 16);

    game.load.spritesheet('coin_spin', 'assets/sprites/coin.png', 32, 32);

    game.load.spritesheet('kaboom', 'assets/sprites/boom32wh12b.png', 32, 32);

    game.load.image('blue', 'assets/sprites/blue_ball.png', 17, 17);
    game.load.image('aqua', 'assets/sprites/aqua_ball.png', 17, 17);
    game.load.image('yellow', 'assets/sprites/yellow_ball.png', 17, 17);
    game.load.image('purple', 'assets/sprites/purple_ball.png', 17, 17);
    game.load.image('red', 'assets/sprites/red_ball.png', 17, 17);
    game.load.image('green', 'assets/sprites/green_ball.png', 17, 17);



}

var speed = 3;
var groove = 0;
var player;
var explosions;
var candies;
var baddies;





function create() {

    map = game.add.tilemap('matching');

    tileset = game.add.tileset('tiles');
    
    layer = game.add.tilemapLayer(0, 0, 900, 900, tileset, map, 0);

    // The maze dimensions can be changed here.
    // One maze cell corresponds to one phaser tile.
    // The X (horizontal) dimension can less than or equal to the Y (vertical), 
    // but not greater or a range error happens
	display(maze(30,30));

    
	player = game.add.sprite(14, 41, 'chick');
	player.anchor.setTo(0.5, 0.5);
  player.animations.add('walk');
  player.animations.play('walk', 10, true);
  player.body.immovable = true;

  

    
    baddies = game.add.group();
   
    for (var x = 0; x < 10; x++)
        {
          var cat = baddies.create(41+(x*54), 41+(x*54), 'cat');
          cat.anchor.setTo(0.5, 0.5);
    		  cat.animations.add('walk');
    		  cat.animations.play('walk', 10, true);
    		  cat.direction = "left"
        }

  candies = game.add.group();
   
  candies.create(41+(game.rnd.integerInRange(0,10)*54), 41+(game.rnd.integerInRange(0,10)*54), 'blue');
  candies.create(41+(game.rnd.integerInRange(0,10)*54), 41+(game.rnd.integerInRange(0,10)*54), 'aqua');
  candies.create(41+(game.rnd.integerInRange(0,10)*54), 41+(game.rnd.integerInRange(0,10)*54), 'green');
  candies.create(41+(game.rnd.integerInRange(0,10)*54), 41+(game.rnd.integerInRange(0,10)*54), 'red');
  candies.create(41+(game.rnd.integerInRange(0,10)*54), 41+(game.rnd.integerInRange(0,10)*54), 'yellow');
  candies.create(41+(game.rnd.integerInRange(0,10)*54), 41+(game.rnd.integerInRange(0,10)*54), 'purple');

  candies.setAll('anchor.x', 0.5 );
  candies.setAll('anchor.y', 0.5 );
  candies.setAll('scale.y', 0.75 );
    
  //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupExplosions, this);
        



	coin = game.add.sprite(41+(game.rnd.integerInRange(0,10)*54), 41+(game.rnd.integerInRange(0,10)*54), 'coin_spin');
  coin.anchor.setTo(0.5, 0.5);
  coin.animations.add('spin');
  coin.animations.play('spin', 10, true);
  coin.scale.setTo(.5,.5);


    cursors = game.input.keyboard.createCursorKeys();
}



function update() {

	movePlayer(player);

	baddies.forEach(moveBaddie, this);

  //  Run collision
  game.physics.collide(player, candies, hitCandy, null, this);
  game.physics.collide(player, baddies, hitBaddie, null, this);
	
		
	
}

function setupExplosions (explosion) {
  explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('kaboom');
}

function hitCandy (player, candy) {

  candy.kill();

  console.log("candy collision!")
  // create an explosion :)
    var explosion = explosions.getFirstDead();
    explosion.reset(candy.body.x, candy.body.y);
    explosion.play('kaboom', 10, false, true);

}

function hitBaddie (player, cat) {

  cat.kill();

  console.log("cat collsion!")
  // create an explosion :)
    var explosion = explosions.getFirstDead();
    explosion.reset(cat.body.x, cat.body.y);
    explosion.play('kaboom', 10, false, true);

}

function moveBaddie(cat) {

	var p;
	var q;
	var tileAbove;
	var tileLeft;
	var currentTile;
	
	
	

	p = layer.getTileX(cat.x);
	q = layer.getTileY(cat.y);

	tileAbove = map.getTile(p,q-1);
	//tileBelow = map.getTile(p,q+1);
	tileLeft = map.getTile(p-1,q);
	//tileRight = map.getTile(p+1,q);

	currentTile = map.getTile(p,q);

	
	switch(cat.direction)
	{
		case "up":

			if ( ((cat.y-14) % 27) == groove )
			{
				
				if (tileAbove == 2 || tileAbove == 4 || tileAbove == 1)
				{
   					// random - go left or right
   					switch(game.rnd.integerInRange(0,2))
   					{
   					case 0:
   						//cat.x -= 1;
   						cat.direction = "left"
   						break;
   					case 1:
   						//cat.x += 1;
   						cat.direction = "right"
   						break;

   			    }
   			}
   			else
   			{
   				// keep going up
   				cat.y -=1;
   			}
   		}
   		else
   		{
   			// keep going up
   			cat.y -=1;
   		}

   		break;
    		

		case "down":

			if ( ((cat.y-14) % 27) == groove )
			{
   			if (currentTile == 2 || currentTile == 4 || currentTile == 8)
				{
   					// random - go left or right
   					switch(game.rnd.integerInRange(0,2))
   					{
   					case 0:
   						//cat.x -= 1;
   						cat.direction = "left"
   						break;
   					case 1:
   						//cat.x += 1;
   						cat.direction = "right"
   						break;

   					}
   			}
   			else
   			{
   					// keep going down
   					cat.y +=1;
   			}
   		}
   		else
   		{
   				// keep going down
   				cat.y +=1;
   		}

   		break;
    		

		case "left":

			if ( ((cat.x-14) % 27) == groove )
			{
   				if (tileLeft == 3 || tileLeft == 4 || tileLeft == 1 || tileLeft == 6)
				{
   					// random - go up or down
   					switch(game.rnd.integerInRange(0,2))
   					{
   					case 0:
   						//cat.x -= 1;
   						cat.direction = "up"
   						break;
   					case 1:
   						//cat.x += 1;
   						cat.direction = "down"
   						break;

   					}
   				}
   				else
   				{
   					// keep going left
   					cat.x -=1;
   				}
   			}
   			else
   			{
   				// keep going left
   				cat.x -=1;
   			}

   			break;
    		

		case "right":

			if ( ((cat.x-14) % 27) == groove )
			{
   				if (currentTile == 3 || currentTile == 4 || currentTile == 8)
				{
   					// random - go up or down
   					switch(game.rnd.integerInRange(0,2))
   					{
   					case 0:
   						//cat.x -= 1;
   						cat.direction = "up"
   						break;
   					case 1:
   						//cat.x += 1;
   						cat.direction = "down"
   						break;

   					}
   				}
   				else
   				{
   					// keep going right
   					cat.x +=1;
   				}
   			}
   			else
   			{
   				// keep going right
   				cat.x +=1;
   			}

   			break;
	}

		

	

}

function movePlayer(chick) {

	var p;
	var q;
	var tileAbove;
	var tileLeft;
	var currentTile;

  //console.log("bodyX = "+chick.body.x);
  //console.log("X = "+chick.x);
  //console.log("bodyY = "+chick.body.y);
  //console.log("Y = "+chick.y);

  
  //chick.body.x = chick.x;
  //chick.body.y = chick.y;
	//chick.x = storedX;
	//chick.y = storedY;

	p = layer.getTileX(chick.x);
	q = layer.getTileY(chick.y);

	tileAbove = map.getTile(p,q-1);
	//tileBelow = map.getTile(p,q+1);
	tileLeft = map.getTile(p-1,q);
	//tileRight = map.getTile(p+1,q);

	currentTile = map.getTile(p,q);
		

   	if (cursors.up.isDown)
   	{
   		if ( ((chick.body.x-6) % 27) == groove )
   			if ( ((chick.body.y-5) % 27) > 0 && ((chick.body.y-5) % 27) <= 14 )
    		{
    			chick.body.y -=  speed;

    		}
    		else if (tileAbove != 2 && tileAbove !=4 && tileAbove != 1)
    		{
    			chick.body.y -=  speed;
    		}
	}

    if (cursors.down.isDown)
    {
    	if ( ((chick.body.x-6) % 27) == groove )
    		if (currentTile != 2 && currentTile != 4 && currentTile != 8 && currentTile != 6) 
    		{
				chick.body.y +=  speed;
			}
			else if ( ((chick.body.y-5) % 27) >= 13 && ((chick.body.y-5) % 27) <= 26 )
			{
				chick.body.y +=  speed;
			}
    }

    if (cursors.left.isDown)
    {
    	if ( ((chick.body.y-5) % 27) == groove )
    		if ( ((chick.body.x-6) % 27) > 0 && ((chick.body.x-6) % 27) <= 14 )
    		{
        		chick.body.x -=  speed;
    		}
    		else if (tileLeft != 3 && tileLeft !=4 && tileLeft != 1 && tileLeft != null)
    		{
    			chick.body.x -=  speed;
    		}
    }
    if (cursors.right.isDown)
    {
    	if ( ((chick.body.y-5) % 27) == groove )
    		if (currentTile != 3 && currentTile != 4 ) 
    		{
        		chick.body.x +=  speed;
    		}
    		else if ( ((chick.body.x-6) % 27) >= 13 && ((chick.body.x-6) % 27) <= 26)
			{
				chick.body.x +=  speed;
			}
    } 


}

function maze(x,y) {

	var n=x*y-1;
	if (n<0) {alert("illegal maze dimensions");return;}
	var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
	    verti =[]; for (var j= 0; j<y+1; j++) verti[j]= [],
	    here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
	    path = [here],
	    unvisited = [];
	for (var j = 0; j<x+2; j++) {
		unvisited[j] = [];
		for (var k= 0; k<y+1; k++)
			unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
	}
	while (0<n) {
		var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
		    [here[0]-1, here[1]], [here[0],here[1]-1]];
		var neighbors = [];
		for (var j = 0; j < 4; j++)
			if (unvisited[potential[j][0]+1][potential[j][1]+1])
				neighbors.push(potential[j]);
		if (neighbors.length) {
			n = n-1;
			next= neighbors[Math.floor(Math.random()*neighbors.length)];
			unvisited[next[0]+1][next[1]+1]= false;
			if (next[0] == here[0])
				horiz[next[0]][(next[1]+here[1]-1)/2]= true;
			else 
				verti[(next[0]+here[0]-1)/2][next[1]]= true;
			path.push(here = next);
		} else 
			here = path.pop();
	}
	return {x: x, y: y, horiz: horiz, verti: verti};
}
 
function display(m) {
	
	// debug stuff ------
	myString1 = m.x.toString();
	myString2 = m.y.toString();

	myString3 = m.horiz.length.toString();
	myString4 = m.verti.length.toString();

	console.log("horiz:");
	for (i=0; i<m.horiz.length; i++)
		{console.log(m.horiz[i])}

	console.log("verti:");
	for (i=0; i<m.verti.length; i++)
		{console.log(m.verti[i])}
	// -------------------


	// loop through horiz and verti arrays to find wall openings for each maze cell
	// for display, the walls are oriented on the bottom/right sides of the tile square
	for (var j= 0; j<m.x+1; j++) 
	{		
		for (var k=0; k<m.y+1; k++) 
		{			
			if ( !m.horiz[j][k] && m.verti[j][k] )
			{   
				// only verti is true, so place horizontal line tile
				map.putTile(2, j+1, k+1);
			}
			else if ( m.horiz[j][k] && !m.verti[j][k] )
			{
				// only horiz is true, so place vertical line tile
				map.putTile(3, j+1, k+1);
			}
			else if ( !m.horiz[j][k] && !m.verti[j][k] && (j<m.x && k<m.y) )
			{
				// both are false, so place horizontal/vertical line tile
				map.putTile(4, j+1, k+1);
			}
			else if ( !m.horiz[j][k] && !m.verti[j][k] )
			{
				// both are false outside the maze boundary
				map.putTile(1, j+1, k+1);
			}						
			else
			{
				// both are true, so place empty tile (with corner filled for looks)
				map.putTile(5, j+1, k+1);
			}			
		}
	}

	map.putTile(6, 0, 1);
	map.putTile(8, m.x, m.y);

	storedX = m.horiz;
	storedY = m.verti;	

}

function render() {

	//game.debug.renderText('# cellsX: ' + myString1, 630, 48, 'rgb(255,0,0)3wqw`1');
	//game.debug.renderText('# cellsY: ' + myString2, 630, 80, 'rgb(255,0,0)');

	//game.debug.renderText('Change dimensions', 620, 212, 'rgb(0,255,0)');
	//game.debug.renderText('at line 22:', 620, 226, 'rgb(0,255,0)');
	//game.debug.renderText('display(maze(X,Y))', 620, 240, 'rgb(0,255,0)');

	//game.debug.renderText('(reload for new maze)', 220, 14, 'rgb(255,255,255)');

	// game.debug.renderText('currentTile: ' + currentTile, 620, 300, 'rgb(255,0,0)');
	// game.debug.renderText('tileAbove: ' + tileAbove, 620, 332, 'rgb(255,0,0)');
	// game.debug.renderText('tileBelow: ' + tileBelow, 620, 364, 'rgb(255,0,0)');	
	// game.debug.renderText('tileLeft: ' + tileLeft, 620, 396, 'rgb(255,0,0)');	
	// game.debug.renderText('tileRight: ' + tileRight, 620, 428, 'rgb(255,0,0)');	

	//game.debug.renderText('(sX-14) % 27: ' + (storedX-14) % 27, 620, 460, 'rgb(255,0,0)');	
	//game.debug.renderText('(sY-14) % 27: ' + (storedY-14) % 27, 620, 492, 'rgb(255,0,0)');

}
