function populate(popsize){
    population = new Array(popsize).fill([]);
    for (let i = 0; i < popsize; i++) {
        network.randomize();
        population[i] = [0, JSON.parse(JSON.stringify(network.weights)), JSON.parse(JSON.stringify(network.biases))];
    }
}

function naturalSelection(mutationRate){
    let accumFitness = 0;
    let totalFitness = 0;

    population.sort(function(a, b) {
        return b[0] - a[0];
    });

    console.log(JSON.parse(JSON.stringify(population)));

    for (let i = 0; i < population.length; i++) {
        totalFitness += population[i][0];
    }
    
    let averageFitness = totalFitness / population.length;
    generationFitness.push(averageFitness);

    console.log("^ Generation " + generation);
    console.log("^ Average Fitness " + averageFitness);

    for (let i = 0; i < population.length; i++) {
        population[i][0] /= totalFitness;
    }

    for (let i = population.length - 1; i > 0; i--) {
        accumFitness = 0;
        for (let j = 0; j < i; j++) {
            accumFitness += JSON.parse(JSON.stringify(population[j][0]));
        }
        population[i][0] += accumFitness;
    }


    let selector = 0;
    let parentA = [];
    let parentB = [];
    let newpopulation = [];

    for (let i = 0; i < population.length / 2; i++) {
        population[i + (population.length / 2)] = JSON.parse(JSON.stringify(population[i]));
    }

    for (let i = 0; i < population.length; i++) {
        selector = math.random();

        if (selector <= population[0][0]) {
            parentA = population[0];
        }
        else if (selector > population[population.length - 2][0]) {
            parentA = population[population.length - 1];
        }
        else {
            for (let j = 1; j < population.length; j++) {
                if (population[j][0] > selector && population[j-1][0] <= selector) {
                    parentA = population[j-1];
                }

            }
        }


        selector = math.random();
        if (selector <= population[0][0]) {
            parentB = population[0];
        }
        else if (selector > population[population.length - 2][0]) {
            parentB = population[population.length - 1];
        }

        else {
            for (let j = 1; j < population.length; j++) {
                if (population[j][0] > selector && population[j-1][0] <= selector) {
                    parentB = population[j-1];
                }
            }
        }

        let baby = [0, JSON.parse(JSON.stringify(parentA[1])), JSON.parse(JSON.stringify(parentA[2]))];

        for (let j = 0; j < parentA[1].length; j++) {
            for (let k = 0; k < parentA[1][j].length; k++) {
                for (let l = 0; l < parentA[1][j][k].length; l++) {
                    if (Math.random() < 0.5) {
                        baby[1][j][k][l] = JSON.parse(JSON.stringify(parentA[1][j][k][l]));
                    }
                    else {
                        baby[1][j][k][l] = JSON.parse(JSON.stringify(parentB[1][j][k][l]));
                    }

                    if (Math.random() < mutationRate) {
                        baby[1][j][k][l] = randomG() * 2 - 1;
                    }
                }
            }
        }
        
        for (let j = 0; j < parentA[2].length; j++) {
            for (let k = 0; k < parentA[2][j].length; k++) {
                if (Math.random() < 0.5) {
                    baby[2][j] = JSON.parse(JSON.stringify(parentA[2][j]));
                }
                else {
                    baby[2][j] = JSON.parse(JSON.stringify(parentB[2][j]));
                }

                if (Math.random() < mutationRate) {
                    baby[2][j] = [randomG() * 2 - 1];
                }
            }
        }

        baby[0] = 1; //score
        newpopulation.push(JSON.parse(JSON.stringify(baby)));
    }

    population = JSON.parse(JSON.stringify(newpopulation));

}
