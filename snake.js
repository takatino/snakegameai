const canvas = document.getElementById("snakegame");
const ctx = canvas.getContext("2d");

const scale = 10; //tile size
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let loopspeed = 0;
let xSpeed = 1;
let ySpeed = 0;
let direction = "right"; //right, up, left, down
let buffer = false;

let snake = [];
let apple = [];
let initialLength = 5;
let nextPos = [];
let score = 0;
let secretscore = 1;
let myNumber = -1;
let running = 0;
let generation = 0;
let generationFitness = [];
let generationBest = [];
let textdata = "";

let distance = 0;
let nextdistance = 0;

function setup() {
    network = new Network([30, 16, 16, 8, 3]); //network size
    scene = new Array(30).fill([0]);

    populate(100);
    reset();
}

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
    saturation = 200;
    nextPos = [(snake[0][0] + xSpeed), (snake[0][1] + ySpeed)];
    relocateApple();

    secretscore += score;
    if (myNumber >= 0) {
        if (secretscore > 1) {
            population[myNumber][0] = secretscore;
        }
        else {
            population[myNumber][0] = 1;
        }

    }

    if (myNumber == population.length - 1) { //end of generation
        myNumber = -1;
        generation += 1;
        //console.log(population);
        naturalSelection(0.05);
    }


    myNumber += 1;
    score = 0;
    secretscore = 1;
    network.load(population[myNumber][1], population[myNumber][2]);

}


function update() {
    nextPos = [(snake[0][0] + xSpeed), (snake[0][1] + ySpeed)];
    if (nextPos[0] == 20 || nextPos[0] < 0) {reset();}
    if (nextPos[1] == 20 || nextPos[1] < 0) {reset();}

    distance = Math.sqrt((apple[0] - snake[0][0])**2 + (apple[1] - snake[0][1])**2);
    nextdistance = Math.sqrt((apple[0] - nextPos[0])**2 + (apple[1] - nextPos[1])**2);
    
    
    if (nextdistance <= distance) {
        secretscore += 1;
    }
    else {
        secretscore -= -1.5;
    }
    

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
        saturation += 100;
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

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "10px Arial";
    textdata = "gen: " + generation + ", id: " + myNumber + ", score: " + score;
    ctx.fillText(textdata, 10, 20);
}

function compileScene() {
    scene.fill([0]); 
    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] + i && apple[1] == snake[0][1]) {
            scene[0] = [Math.exp(1 - i)];
        }

        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] + i && snake[j][1] == snake[0][1]) {
                scene[8] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][0] + i == 20) {
            scene[16] = [Math.exp(1 - i)];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] && apple[1] == snake[0][1] - i) {
            scene[1] = [Math.exp(1 - i)];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] && snake[j][1] == snake[0][1] - i) {
                scene[9] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][1] - i == -1) {
            scene[17] = [Math.exp(1 - i)];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] - i && apple[1] == snake[0][1]) {
            scene[2] = [Math.exp(1 - i)];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] - i && snake[j][1] == snake[0][1]) {
                scene[10] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][0] - i == -1) {
            scene[18] = [Math.exp(1 - i)];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] && apple[1] == snake[0][1] + i) {
            scene[3] = [Math.exp(1 - i)];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] && snake[j][1] == snake[0][1] + i) {
                scene[11] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][1] + i == 20) {
            scene[19] = [Math.exp(1 - i)];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] + i && apple[1] == snake[0][1] - i) {
            scene[4] = [Math.exp(1 - i)];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] + i && snake[j][1] == snake[0][1] - i) {
                scene[12] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][0] + i == 20 || snake[0][1] - i == -1) {
            scene[20] = [Math.exp(1 - i)];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] - i && apple[1] == snake[0][1] - i) {
            scene[5] = [Math.exp(1 - i)];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] - i && snake[j][1] == snake[0][1] - i) {
                scene[13] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][0] - i == -1 || snake[0][1] - i == -1) {
            scene[21] = [Math.exp(1 - i)];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] - i && apple[1] == snake[0][1] + i) {
            scene[6] = [Math.exp(1 - i)];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] - i && snake[j][1] == snake[0][1] + i) {
                scene[14] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][0] - i == -1 || snake[0][1] + i == 20) {
            scene[22] = [Math.exp(1 - i)];
            break;
        }
    }

    for (let i = 1; i < 20; i ++ ) {
        if (apple[0] == snake[0][0] + i && apple[1] == snake[0][1] + i) {
            scene[7] = [Math.exp(1 - i)];
        }
        
        for (let j = 0; j < snake.length; j++) {
            if (snake[j][0] == snake[0][0] + i && snake[j][1] == snake[0][1] + i) {
                scene[15] = [Math.exp(1 - i)];
            }
        }

        if (snake[0][0] + i == 20 || snake[0][1] + i == 20) {
            scene[23] = [Math.exp(1 - i)];
            break;
        }
    }

    
    if (direction == "right" && apple[0] >= snake[0][0]) {
        if ((apple[0] - snake[0][0])/(apple[1] - snake[0][1]) >= 0) {
            scene[24] = [(Math.atan((apple[0] - snake[0][0])/(apple[1] - snake[0][1])))/Math.PI];
        }
        else {
            scene[24] = [(Math.PI + (Math.atan((apple[0] - snake[0][0])/(apple[1] - snake[0][1]))))/Math.PI]
        }
    }
    else if (direction == "up" && apple[1] <= snake[0][1]) {
        if (-(apple[1] - snake[0][1])/(apple[0] - snake[0][0]) >= 0) {
            scene[24] = [(Math.atan(-(apple[1] - snake[0][1])/(apple[0] - snake[0][0])))/Math.PI];
        }
        else {
            scene[24] = [(Math.PI + (Math.atan(-(apple[1] - snake[0][1])/(apple[0] - snake[0][0]))))/Math.PI];
        }
    }
    else if (direction == "left" && apple[0] <= snake[0][0]) {
        if ((apple[0] - snake[0][0])/(apple[1] - snake[0][1]) >= 0) {
            scene[24] = [(Math.atan((apple[0] - snake[0][0])/(apple[1] - snake[0][1])))/Math.PI];
        }
        else {
            scene[24] = [(Math.PI + (Math.atan((apple[0] - snake[0][0])/(apple[1] - snake[0][1]))))/Math.PI];
        }
    }
    else if (direction == "down" && apple[1] >= snake[0][1]) {
        if (-(apple[1] - snake[0][1])/(apple[0] - snake[0][0]) >= 0) {
            scene[24] = [(Math.atan(-(apple[1] - snake[0][1])/(apple[0] - snake[0][0])))/Math.PI];
        }
        else {
            scene[24] = [(Math.PI + (Math.atan(-(apple[1] - snake[0][1])/(apple[0] - snake[0][0]))))/Math.PI];
        }
    } 
    
    switch (direction) {
        case "right":
            scene[25] = [1];
            break;
        case "up":
            scene[26] = [1];
            break;
        case "left":
            scene[27] = [1];
            break;
        case "down":
            scene[28] = [1];
            break;               
    } 


    scene[29] = [Math.sqrt((apple[0] - snake[0][0])**2 + (apple[1] - snake[0][1])**2)/(20 * Math.sqrt(2))];
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

setup();

let main = setInterval(() => {
    update();
    think();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    //buffer = false; //allow input

    saturation -= 1;
    if (saturation <= 0) {
        reset();
    }

}, loopspeed);  


//smoother snake movement

