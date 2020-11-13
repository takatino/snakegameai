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
    console.log(grid.length);
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
    relocateApple();
}

function update() {
    let nextPos = [(snake[0][0] + xSpeed) % columns, (snake[0][1] + ySpeed) % rows];
    if (nextPos[0] == -1) {nextPos[0] = columns - 1}
    if (nextPos[1] == -1) {nextPos[1] = rows - 1}

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

function render() {
    ctx.fillStyle = "#56a381"; //snake green
    let body;
    for (body of snake) {
        ctx.fillRect(body[0] * scale, body[1] * scale, scale, scale);
    }
    ctx.fillStyle = "#fc6272";
    ctx.fillRect(apple[0]*scale, apple[1]*scale, scale, scale);
}

reset();

let game = setInterval(() => {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    buffer = false;
}, 100);

//smoother snake movement