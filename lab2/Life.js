var msBetweenSteps = 50;
var tileSideLength = 15;
var gameAreaSize = 900;
var ctxLineWidth = 1.5;
var ctxStrokeStyle = "#000000";
var filledTileColor = "#000000";
var emptyTileColor = "#FFFFFF";
var emptyActionName = "empty";
var fillActionName = "fill";
var gameRunning = false;
var tiles = [];

document.addEventListener("DOMContentLoaded", function(event) { 
	var gameArea = document.getElementById("lifeGame");
	
	gameArea.width = gameAreaSize;
	gameArea.height = gameAreaSize;
	
	var gameAreaContext = gameArea.getContext('2d');
	gameAreaContext.lineWidth = ctxLineWidth;
	gameAreaContext.strokeStyle = ctxStrokeStyle;
	
	var draw = function() {
		for(var x = 0; x < gameAreaSize*2; x+=tileSideLength) {
			tiles[Math.floor(x/tileSideLength)] = [];
			for(var y = 0; y < gameAreaSize*2; y+=tileSideLength) {
				gameAreaContext.fillStyle = emptyTileColor; 
				gameAreaContext.fillRect(x, y, tileSideLength, tileSideLength);
				gameAreaContext.strokeRect(x,y,tileSideLength,tileSideLength);
				tiles[Math.floor(x/tileSideLength)][Math.floor(y/tileSideLength)] = false;
			}
		}
	};	
	
	draw();
	
	var getTileState = function(x, y) {
		x = Math.floor(x/tileSideLength);
		y = Math.floor(y/tileSideLength);
		return tiles[x][y];
	}
	
	var performTileAction = function(x, y, actionName) {
		x = Math.floor(x/tileSideLength);
		y = Math.floor(y/tileSideLength);
		tiles[x][y] = actionName === fillActionName;
		gameAreaContext.fillStyle = actionName === fillActionName ? filledTileColor : emptyTileColor; 
		gameAreaContext.fillRect(x*tileSideLength, y*tileSideLength, tileSideLength, tileSideLength);
		if(actionName === emptyActionName)
			gameAreaContext.strokeRect(x*tileSideLength, y*tileSideLength, tileSideLength, tileSideLength);
	}
	
	gameArea.onclick = function(event) {
		if(!gameRunning) {
			if(!getTileState(event.offsetX, event.offsetY)) {
				performTileAction(event.offsetX, event.offsetY, fillActionName);
			} else {
				performTileAction(event.offsetX, event.offsetY, emptyActionName);
			}
		} else {
			console.log("game is running, you cannot do anything");
		}
	}
	
	var checkNeighbours = function(x,y) {
		if(tiles[x][y]) {
			var filledNeighboursCount = 0;
			var offsets = [-1, 0, 1];
			for(var i = 0; i < offsets.length; i++) {
				for(var j = 0; j < offsets.length; j++) {
					var isNotSelfTile = !(i===1 && j===1);
					var isNotOffRightBorder = !(x === 0 && i === 0);
					var isNotOffLeftBorder = !(x === tiles.length-1 && i === offsets.length-1);
					var isNotOffTopBorder = !(y === 0 && j === 0);
					var isNotOffBottomBorder = !(y === tiles[x].length-1 && j === offsets.length-1);
					if(isNotSelfTile && isNotOffRightBorder && isNotOffLeftBorder && isNotOffTopBorder && isNotOffBottomBorder && tiles[x+offsets[i]][y+offsets[j]]) {
						filledNeighboursCount++;
					}
				}
			}
			if(filledNeighboursCount > 3 || filledNeighboursCount < 2) {
				return { "x": x*tileSideLength, "y": y*tileSideLength, actionName: emptyActionName};
			}
		} else {
			var filledNeighboursCount = 0;
			var offsets = [-1, 0, 1];
			for(var i = 0; i < offsets.length; i++) {
				for(var j = 0; j < offsets.length; j++) {
					var isNotSelfTile = !(i===1 && j===1);
					var isNotOffRightBorder = !(x === 0 && i === 0);
					var isNotOffLeftBorder = !(x === tiles.length-1 && i === offsets.length-1);
					var isNotOffTopBorder = !(y === 0 && j === 0);
					var isNotOffBottomBorder = !(y === tiles[x].length-1 && j === offsets.length-1);
					if(isNotSelfTile && isNotOffRightBorder && isNotOffLeftBorder && isNotOffTopBorder && isNotOffBottomBorder && tiles[x+offsets[i]][y+offsets[j]]) {
						filledNeighboursCount++;
					}
				}
			}
			if(filledNeighboursCount === 3) {	
				return { "x": x*tileSideLength, "y": y*tileSideLength, actionName: fillActionName };
			}
		}
	}
	
	var performNextStep = function() {
		var tileActions = [];
		for(var x = 0; x < tiles.length; x++) {
			for(var y = 0; y < tiles[x].length; y++) {
				var tileAction = checkNeighbours(x, y);
				if(tileAction) {
					tileActions.push(tileAction);
				}
			}
		}
		for(var i = 0; i < tileActions.length; i++) {
			var tileAction = tileActions[i];
			performTileAction(tileAction.x, tileAction.y, tileAction.actionName);
		}
		tileActions = [];
		if(gameRunning)
			var timer = setTimeout(performNextStep, msBetweenSteps);
	}
	
	document.getElementById("runButton").onclick = function() {
		gameRunning = true;
		performNextStep();
	};
	
	document.getElementById("runOneStepButton").onclick = performNextStep;
	
	document.getElementById("stopButton").onclick = function() {
		gameRunning = false;
	};
	
	document.getElementById("clearButton").onclick = function() {
		gameRunning = false;
		draw();
	}
	
});

