'use client'
import React, { useState } from 'react';

const ExpensiveComputationComponent: React.FC = () => {
    const [result, setResult] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);

    const handleClick = () => {
        setIsCalculating(true);

        // 动态导入 Web Worker
        const worker = new Worker(new URL('./worker.ts', import.meta.url));

        worker.onmessage = function (e) {
            setResult(e.data);
            setIsCalculating(false);
            worker.terminate(); // 完成后终止 Worker
        };

        worker.postMessage(1000000000); // 向 Worker 发送数据
    };

    return (
        <div>
            <button onClick={handleClick} disabled={isCalculating}>
                {isCalculating ? 'Calculating...' : 'Start Expensive Computation'}
            </button>
            {result !== null && <p>Result: {result}</p>}
        </div>
    );
};

export default ExpensiveComputationComponent;
