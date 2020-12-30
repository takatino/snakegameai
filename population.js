function populate(){
    population = new Array(50).fill([]);
    for (let i = 0; i < 50; i++) {
        network.randomize();
        population[i] = [0, JSON.parse(JSON.stringify(network.weights)), JSON.parse(JSON.stringify(network.biases))];
    }
}

function naturalSelection(){
    
}