const LogicProvider = {
    modules: {
        
        reverseMean: {
            calculate: (count, currentMean, targetMean) => {
                const n = parseInt(count);
                const m1 = parseFloat(currentMean);
                const m2 = parseFloat(targetMean);

                const currentTotal = n * m1;
                const targetTotal = (n + 1) * m2;
                const needed = targetTotal - currentTotal;

                return {
                    currentTotal: currentTotal.toFixed(1),
                    targetTotal: targetTotal.toFixed(1),
                    needed: needed.toFixed(1),
                    steps: [
                        `Step 1: Find the current total sum (${n} items × ${m1}) = ${currentTotal.toFixed(1)}`,
                        `Step 2: Find the required total for ${n + 1} items (${n + 1} × ${m2}) = ${targetTotal.toFixed(1)}`,
                        `Step 3: Subtract the current from the target to find the missing piece.`,
                        `Result: You need a score of ${needed.toFixed(1)}`
                    ]
                };
            }
        },
        
        rounding: {
            calculate: (num, place) => {
                const n = parseFloat(num);
                const p = parseFloat(place); // 10, 100, 0.1, etc.
                const rounded = Math.round(n / p) * p;
                const lower = Math.floor(n / p) * p;
                const upper = lower + p;
                const midpoint = lower + (p / 2);
                
                return {
                    original: n,
                    rounded: p < 1 ? rounded.toFixed(1) : rounded,
                    lower: lower,
                    upper: upper,
                    midpoint: midpoint,
                    isUp: n >= midpoint,
                    steps: [
                        `Target: Nearest ${p}`,
                        `Boundaries: ${lower} ↔ ${upper}`,
                        `Midpoint: ${midpoint}`,
                        `Decision: ${n} is ${n >= midpoint ? 'at or above' : 'below'} the midpoint.`,
                        `Result: ${p < 1 ? rounded.toFixed(1) : rounded}`
                    ]
                };
            }
        },
        
        unitary: {
            calculate: (knownQty, knownValue, targetQty) => {
                const unitValue = knownValue / knownQty;
                const finalValue = unitValue * targetQty;
 
                return {
                    // These are what module-1.html reads
                    answers: {
                        unit: unitValue.toFixed(2),
                        correct: finalValue.toFixed(2)
                    },
                    // Structural steps kept for future use
                    steps: [
                        { label: "The Known",  text: `We know ${knownQty} units = £${knownValue}` },
                        { label: "The Bridge", text: `1 unit = £${knownValue} ÷ ${knownQty} = £${unitValue.toFixed(2)}` },
                        { label: "The Scale",  text: `${targetQty} units = £${unitValue.toFixed(2)} × ${targetQty}` },
                        { label: "The Target", text: `Total for ${targetQty} units = £${finalValue.toFixed(2)}` }
                    ]
                };
            }
        }
    }
};
