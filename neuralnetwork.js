class Network {
    constructor(sizes) { //number of neurons for each layer ie "[4, 3, 3, 3]"
        this.numberOfLayers = sizes.length;
        this.sizes = sizes;
        this.biases = [];
        this.weights = [];


        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            this.biases[i] = [randomG()];
        }

        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            this.weights[i] = [new Array(this.sizes[i+1])];
            for (let j = 0; j < this.sizes[i+1]; j++) {
                this.weights[i][j] = new Array(this.sizes[i]);
                for (let k = 0; k < this.sizes[i]; k++) {
                    this.weights[i][j][k] = randomG();
                }
            }
        }
    }

    feedforward(input) {
        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            input = sigmoid(math.add(math.multiply(this.weights[i], input), this.biases[i][0]));
        }
        return input;
    }

    randomize(){
        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            this.biases[i] = [randomG()];
        }

        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            this.weights[i] = [new Array(this.sizes[i+1])];
            for (let j = 0; j < this.sizes[i+1]; j++) {
                this.weights[i][j] = new Array(this.sizes[i]);
                for (let k = 0; k < this.sizes[i]; k++) {
                    this.weights[i][j][k] = randomG();
                }
            }
        }

        return;
    }

    load(w, b) {
        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            this.biases[i] = JSON.parse(JSON.stringify(b[i]));
        }

        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            for (let j = 0; j < this.sizes[i+1]; j++) {
                for (let k = 0; k < this.sizes[i]; k++) {
                    this.weights[i][j][k] = JSON.parse(JSON.stringify(w[i][j][k]));
                }
            }
        }
    }

}

function sigmoid(z) {
    return z.map(function(value) {
        return 1/(1 + math.exp(-value));
    })
}

function randomG(){ 
    let r = 0;
    for(let i = 3; i > 0; i--){
        r += math.random();
    }
    return (r / 3);
}
