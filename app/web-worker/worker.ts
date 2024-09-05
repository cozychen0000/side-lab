// worker.ts
self.onmessage = function (e) {
    const { data } = e;
    const result = expensiveComputation(data);
    self.postMessage(result);
};

function expensiveComputation(data: number) {
    let sum = 0;
    for (let i = 0; i < data; i++) {
        sum += i;
    }
    return sum;
}

export {};