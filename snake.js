const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scale = 20; //tile size
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let xSpeed = 1;
let ySpeed = 0;
let direction = "right"; //right, up, left, down
let buffer = false;

/*
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
*/

let snake = [];
let apple = [];
let initialLength = 5;
let nextPos = [];
let score = 1;
let myNumber = -1;
let running = 1;
let generation = 0;
let generationFitness = [];

function turn(d) {
    if (d == "left") {
        switch(direction) {
            case "right":
                xSpeed = 0;
                ySpeed = -1;
                direction = "up";
                break;
            case "up":
                xSpeed = -1;
                ySpeed = 0;
                direction = "left";
                break;
            case "left":
                xSpeed = 0;
                ySpeed = 1;
                direction = "down";
                break;
            case "down":
                xSpeed = 1;
                ySpeed = 0;
                direction = "right";
                break;
        }
    }

    else if (d == "right") {
        switch(direction) {
            case "right":
                xSpeed = 0;
                ySpeed = 1;
                direction = "down";
                break;
            case "up":
                xSpeed = 1;
                ySpeed = 0;
                direction = "right";
                break;
            case "left":
                xSpeed = 0;
                ySpeed = -1;
                direction = "up";
                break;
            case "down":
                xSpeed = -1;
                ySpeed = 0;
                direction = "left";
                break;
        }
    }
}

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
    for (let i = 0; i < initialLength; i++) {
        snake.push([Math.floor(columns/2) - i, Math.floor(rows/2)]);
    }
    xSpeed = 1;
    ySpeed = 0;
    direction = "right";
    saturation = 100;
    nextPos = [(snake[0][0] + xSpeed), (snake[0][1] + ySpeed)];
    relocateApple();

    if (myNumber >= 0) {
        population[myNumber][0] = score;
    }

    if (myNumber == population.length - 1) { //end of generation
        myNumber = -1;
        generation += 1;
        //console.log(population);
        naturalSelection(0.05);
    }


    myNumber += 1;
    score = 1;
    network.load(population[myNumber][1], population[myNumber][2]);

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
        score += 10;
        saturation += 50;
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

function compileScene() {
    scene = new Array(24).fill([0]); 
    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] + i && apple[1] == snake[0][1]) {
            scene[0] = [0.05 * i];
        }

        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] + i && snake[j][1] == snake[0][1]) {
                scene[8] = [0.05 * i];
            }
        }

        if (snake[0][0] + i == 20) {
            scene[16] = [0.05 * i];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] && apple[1] == snake[0][1] - i) {
            scene[1] = [0.05 * i];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] && snake[j][1] == snake[0][1] - i) {
                scene[9] = [0.05 * i];
            }
        }

        if (snake[0][1] - i == -1) {
            scene[17] = [0.05 * i];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] - i && apple[1] == snake[0][1]) {
            scene[2] = [0.05 * i];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] - i && snake[j][1] == snake[0][1]) {
                scene[10] = [0.05 * i];
            }
        }

        if (snake[0][0] - i == -1) {
            scene[18] = [0.05 * i];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] && apple[1] == snake[0][1] + i) {
            scene[3] = [0.05 * i];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] && snake[j][1] == snake[0][1] + i) {
                scene[11] = [0.05 * i];
            }
        }

        if (snake[0][1] + i == 20) {
            scene[19] = [0.05 * i];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] + i, apple[1] == snake[0][1] - i) {
            scene[4] = [0.05 * i];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] + i && snake[j][1] == snake[0][1] - i) {
                scene[12] = [0.05 * i];
            }
        }

        if (snake[0][0] + i == 20 || snake[0][1] - i == -1) {
            scene[20] = [0.05 * i];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] - i && apple[1] == snake[0][1] - i) {
            scene[5] = [0.05 * i];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] - i && snake[j][1] == snake[0][1] - i) {
                scene[13] = [0.05 * i];
            }
        }

        if (snake[0][0] - i == -1 || snake[0][1] - i == -1) {
            scene[21] = [0.05 * i];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] - i && apple[1] == snake[0][1] + i) {
            scene[6] = [0.05 * i];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] - i && snake[j][1] == snake[0][1] + i) {
                scene[14] = [0.05 * i];
            }
        }

        if (snake[0][0] - i == -1 || snake[0][1] + i == 20) {
            scene[22] = [0.05 * i];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] + i && apple[1] == snake[0][1] + i) {
            scene[7] = [0.05 * i];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] + i && snake[j][1] == snake[0][1] + i) {
                scene[15] = [0.05 * i];
            }
        }

        if (snake[0][0] + i == 20 || snake[0][1] + i == 20) {
            scene[23] = [0.08 * i];
            break;
        }
    }

}

function think() {
    compileScene();
    let output = network.feedforward(scene);

    let max = output[0];
    let maxIndex = 0;

    for (let i = 1; i < output.length; i++) {
        if (output[i] > max) {
            maxIndex = i;
            max = output[i];
        }
    }

    switch (maxIndex) {
        case 0:
            break;
        case 1:
            turn("right");
            break;
        case 2:
            turn("left");
            break;
    }
}


function main() {
    update();
    think();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    //buffer = false; //allow input

    saturation -= 1;
    if (saturation <= 0) {
        reset();
    }
    score += 1; // score for being alive

    requestAnimationFrame(main);
}

network = new Network([24, 16, 16, 3]); //network size

populate(200);
reset();
main();

/*
let main = setInterval(() => {
    update();
    think();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    //buffer = false; //allow input

    score += 1; // score for being alive
}, 100);
*/

//smoother snake movement