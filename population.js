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
    let selectedpopulation = [];
    let newpopulation = [];

    population.sort(function(a, b) {
        return b[0] - a[0];
    });

    console.log(JSON.parse(JSON.stringify(population)));

    for (let i = 0; i < population.length; i++) {
        totalFitness += population[i][0];
    }
    
    let averageFitness = totalFitness / population.length;
    generationFitness.push(averageFitness);
    generationBest.push(population[0][0]);

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

    for (let i = 0; i < population.length / 2; i++) {
        selectedpopulation.push(population[i]);
    }

    totalFitness = 0;
    accumFitness = 0;
    for (let i = 0; i < selectedpopulation.length; i++) {
        totalFitness += selectedpopulation[i][0];
    }

    for (let i = 0; i < selectedpopulation.length; i++) {
        selectedpopulation[i][0] /= totalFitness;
    }

    for (let i = selectedpopulation.length - 1; i > 0; i--) {
        accumFitness = 0;
        for (let j = 0; j < i; j++) {
            accumFitness += JSON.parse(JSON.stringify(selectedpopulation[j][0]));
        }
        selectedpopulation[i][0] += accumFitness;
    }
    

    let selector = 0;
    let parentA = [];
    let parentB = [];
    let baby = [];

    for (let i = 0; i < selectedpopulation.length; i++) {
        newpopulation.push(selectedpopulation[i]);
    }

    for (let i = 0; i < population.length; i++) {
        selector = math.random();

        if (selector <= selectedpopulation[0][0]) {
            parentA = selectedpopulation[0];
        }
        else if (selector > selectedpopulation[selectedpopulation.length - 2][0]) {
            parentA = selectedpopulation[selectedpopulation.length - 1];
        }
        else {
            for (let j = 1; j < selectedpopulation.length; j++) {
                if (selectedpopulation[j][0] > selector && selectedpopulation[j-1][0] <= selector) {
                    parentA = selectedpopulation[j-1];
                }

            }
        }


        selector = math.random();
        if (selector <= selectedpopulation[0][0]) {
            parentB = selectedpopulation[0];
        }
        else if (selector > selectedpopulation[selectedpopulation.length - 2][0]) {
            parentB = selectedpopulation[selectedpopulation.length - 1];
        }

        else {
            for (let j = 1; j < selectedpopulation.length; j++) {
                if (selectedpopulation[j][0] > selector && selectedpopulation[j-1][0] <= selector) {
                    parentB = selectedpopulation[j-1];
                }
            }
        }

        baby = [0, JSON.parse(JSON.stringify(parentA[1])), JSON.parse(JSON.stringify(parentA[2]))];

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
                        baby[1][j][k][l] = randomG() * 4 - 2;
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
                    baby[2][j] = [randomG() * 4 - 2];
                }
            }
        }

        baby[0] = 1; //score
        newpopulation.push(baby);
        if (newpopulation.length == population.length) {
            break;
        }
    }

    population = JSON.parse(JSON.stringify(newpopulation));

}
