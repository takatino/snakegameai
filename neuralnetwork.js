class Network {
    constructor(sizes) { //number of neurons for each layer ie "[4, 3, 3, 3]"
        this.numberOfLayers = sizes.length;
        this.sizes = sizes;
        this.biases = [];
        this.weights = [];
        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            this.biases[i] = [Math.random()];
        }
        for (let i = 0; i < this.numberOfLayers - 1; i++) {
            this.weights[i] = [new Array(sizes[i+1])];
            for (let j = 0; j < sizes[i+1]; j++) {
                this.weights[i][j] = new Array(sizes[i]);
                for (let k = 0; k < sizes[i]; k++) {
                    this.weights[i][j][k] = Math.random();
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


}

function sigmoid(z) {
    return z.map(function(value) {
        return 1/(1 + math.exp(-value));
    })
}