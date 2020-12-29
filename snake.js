const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scale = 20; //tile size
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let xSpeed = 1;
let ySpeed = 0;
let buffer = false;

document.addEventListener("keydown", function(e) {
    if (e.keyCode == 37 && xSpeed == 0 && buffer == false) { // Player holding left
        xSpeed = -1;
        ySpeed = 0;
        buffer = true;
	}
    else if (e.keyCode == 38 && ySpeed == 0 && buffer == false) { // Player holding up
		xSpeed = 0;
        ySpeed = -1;
        buffer = true;
    }
	else if (e.keyCode == 39 && xSpeed == 0 && buffer == false) { // Player holding right
		xSpeed = 1;
        ySpeed = 0;
        buffer = true;
	}
	else if (e.keyCode == 40 && ySpeed == 0 && buffer == false) { // Player holding down
		xSpeed = 0;
        ySpeed = 1;
        buffer = true;
    }
});


let snake = [];
let apple = [];
let initialLength = 5;
let nextPos = [];


function relocateApple(){
    let grid = [];
    let i;
    let j;
    for (i = 0; i < columns; i++){
        for (j = 0; j < rows; j++){
            grid.push([i, j]);
        }
    }
    for (i = 0; i < snake.length; i++){
        for (j = 0; j < grid.length; j++){
            if (JSON.stringify(grid[j]) === JSON.stringify(snake[i])) {
                grid.splice(j, 1);
            }
        }
    }
    apple = grid[Math.floor(Math.random() * grid.length)];
}

function reset() {
    snake = [];
    let i;
    for (i = 0; i < initialLength; i++) {
        snake.push([Math.floor(columns/2) - i, Math.floor(rows/2)]);
    }
    xSpeed = 1;
    ySpeed = 0;
    nextPos = [(snake[0][0] + xSpeed), (snake[0][1] + ySpeed)];
    relocateApple();
}

function update() {
    nextPos = [(snake[0][0] + xSpeed), (snake[0][1] + ySpeed)];
    if (nextPos[0] == 20 || nextPos[0] < 0) {reset();}
    if (nextPos[1] == 20 || nextPos[1] < 0) {reset();}

    if (nextPos[0] == apple[0] && nextPos[1] == apple[1]){
        snake.push([-1, -1]);   
        let bodyNumber;
        for (bodyNumber = snake.length - 1; bodyNumber > 0; bodyNumber--) {
            snake[bodyNumber] = snake[bodyNumber - 1];
            if (nextPos[0] == snake[bodyNumber][0] && nextPos[1] == snake[bodyNumber][1]){ //js: only equals when they reference the same object >:(
                reset();
                return;
            } 
        }
        relocateApple();
    }
    else {
        let bodyNumber;
        for (bodyNumber = snake.length - 1; bodyNumber > 0; bodyNumber--) {
            snake[bodyNumber] = snake[bodyNumber - 1];
            if (nextPos[0] == snake[bodyNumber][0] && nextPos[1] == snake[bodyNumber][1]){ //js: only equals when they reference the same object >:(
                reset();
                return;
            } 
        }
    }

    snake[0] = [nextPos[0], nextPos[1]];

}

function draw() {
    ctx.fillStyle = "#56a381"; //snake green
    let body;
    for (body of snake) {
        ctx.fillRect(body[0] * scale, body[1] * scale, scale, scale);
    }
    ctx.fillStyle = "#fc6272"; //apple red
    ctx.fillRect(apple[0]*scale, apple[1]*scale, scale, scale);
}

reset();

network = new Network([4, 3, 3, 3]);
for (a in network.weights) {
    console.log(network.weights[a]);
}

let game = setInterval(() => {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    buffer = false; //allow input
}, 100);

//smoother snake movement