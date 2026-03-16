const LogicProvider = {
    modules: {

        sequentialFractions: {
            calculate: (total, n1, d1, n2, d2) => {
                const t = parseFloat(total);
                const amt1 = (parseInt(n1) / parseInt(d1)) * t;
                const remainder = t - amt1;
                const amt2 = (parseInt(n2) / parseInt(d2)) * remainder;
                const final = remainder - amt2;

                return {
                    amt1: amt1.toFixed(2),
                    remainder: remainder.toFixed(2),
                    amt2: amt2.toFixed(2),
                    final: final.toFixed(2),
                    steps: [
                        `Step 1: Calculate the first slice. $\\frac{${n1}}{${d1}}$ of ${t} = ${amt1.toFixed(2)}.`,
                        `Step 2: Find the REMAINDER. $ ${t} - ${amt1.toFixed(2)} = ${remainder.toFixed(2)} $.`,
                        `Step 3: Calculate the second slice from that remainder. $\\frac{${n2}}{${d2}}$ of ${remainder.toFixed(2)} = ${amt2.toFixed(2)}.`,
                        `Result: After both stages, ${final.toFixed(2)} remains.`
                    ]
                };
            }
        },

        fractionsOfAmounts: {
            calculate: (total, numerator, denominator) => {
                const t = parseFloat(total);
                const n = parseInt(numerator);
                const d = parseInt(denominator);

                const unitFraction = t / d;
                const result = unitFraction * n;

                return {
                    unitFraction: unitFraction.toFixed(2),
                    result: result.toFixed(2),
                    steps: [
                        `Step 1: Find the value of one 'slice' (1/${d}). Divide the total by the denominator: £${t} ÷ ${d} = £${unitFraction.toFixed(2)}.`,
                        `Step 2: Find the value of ${n} 'slices'. Multiply the unit value by the numerator: £${unitFraction.toFixed(2)} × ${n}.`,
                        `Result: ${n}/${d} of £${t} is £${result.toFixed(2)}.`
                    ]
                };
            }
        },

        reversePercentage: {
            calculate: (finalVal, percent, isIncrease) => {
                const f = parseFloat(finalVal);
                const p = parseFloat(percent);
                const multiplier = isIncrease ? (1 + p / 100) : (1 - p / 100);
                const original = f / multiplier;

                return {
                    multiplier: multiplier.toFixed(2),
                    original: original.toFixed(2),
                    steps: [
                        `Step 1: Identify the Multiplier. ${isIncrease ? 'Increase' : 'Decrease'} of ${p}% is a multiplier of ${multiplier.toFixed(2)}.`,
                        `Step 2: Understand the journey. Original × ${multiplier.toFixed(2)} = ${f}.`,
                        `Step 3: Reverse the journey. ${f} ÷ ${multiplier.toFixed(2)} = Original.`,
                        `Result: The original price was £${original.toFixed(2)}.`
                    ]
                };
            }
        },

        percentageChange: {
            calculate: (original, percent, isIncrease) => {
                const start = parseFloat(original);
                const p = parseFloat(percent);
                const multiplier = isIncrease ? (1 + p / 100) : (1 - p / 100);
                const result = start * multiplier;
                const change = Math.abs(result - start);

                return {
                    multiplier: multiplier.toFixed(2),
                    result: result.toFixed(2),
                    change: change.toFixed(2),
                    steps: [
                        `Step 1: Convert the ${isIncrease ? 'Increase' : 'Decrease'} to a Multiplier.`,
                        `Formula: 100% ${isIncrease ? '+' : '-'} ${p}% = ${(multiplier * 100).toFixed(0)}%.`,
                        `Step 2: Express as a decimal: ${multiplier.toFixed(2)}.`,
                        `Step 3: Multiply original by the decimal (${start} × ${multiplier.toFixed(2)}).`,
                        `Result: The new value is ${result.toFixed(2)}.`
                    ]
                };
            }
        },

        directProportion: {
            calculate: (origQty, origVal, targetQty) => {
                const q1 = parseFloat(origQty);
                const v1 = parseFloat(origVal);
                const q2 = parseFloat(targetQty);

                // Find the multiplier (Scale Factor)
                const multiplier = q2 / q1;
                const result = v1 * multiplier;

                return {
                    multiplier: multiplier.toFixed(2),
                    result: result.toFixed(2),
                    steps: [
                        `Step 1: Find the Scale Factor (Multiplier). Divide target by original (${q2} ÷ ${q1} = ${multiplier.toFixed(2)}).`,
                        `Step 2: Understand that in Direct Proportion, both sides must grow by the same multiplier.`,
                        `Step 3: Multiply the original value by the Scale Factor (${v1} × ${multiplier.toFixed(2)}).`,
                        `Result: The new value is ${result.toFixed(2)}.`
                    ]
                };
            }
        },
        
        inverseProportion: {
            calculate: (workers, time, newWorkers) => {
                const w1 = parseInt(workers) || 1;
                const t1 = parseFloat(time) || 1;
                const w2 = parseInt(newWorkers) || 1;

                // The Golden Rule of Inverse: X * Y = Constant
                const totalWork = w1 * t1; 
                const newTime = totalWork / w2;

                return {
                    totalWork: totalWork.toFixed(1),
                    newTime: newTime.toFixed(1),
                    steps: [
                        `Step 1: Find the "Constant" (Total Work). Multiply workers by time (${w1} × ${t1} = ${totalWork.toFixed(1)} units of work).`,
                        `Step 2: Understand that the Total Work never changes, no matter how many people are doing it.`,
                        `Step 3: Divide the Total Work by the NEW number of workers (${totalWork.toFixed(1)} ÷ ${w2}).`,
                        `Result: It will take ${w2} worker(s) ${newTime.toFixed(1)} units of time.`
                    ]
                };
            }
        },
        
        sharedRatiosDiff: {
            calculate: (diffAmount, partA, partB) => {
                const diff = parseFloat(diffAmount);
                const a = parseInt(partA);
                const b = parseInt(partB);
                
                // Prevent division by zero if ratios are equal
                if (a === b) return { error: "Ratios must be different to have a difference." };

                const diffParts = Math.abs(a - b);
                const valuePerPart = diff / diffParts;
                
                const valA = a * valuePerPart;
                const valB = b * valuePerPart;
                const total = valA + valB;

                return {
                    diffParts: diffParts,
                    valuePerPart: valuePerPart.toFixed(2),
                    valA: valA.toFixed(2),
                    valB: valB.toFixed(2),
                    total: total.toFixed(2),
                    largerIsA: a > b,
                    steps: [
                        `Step 1: Find the difference in parts between the shares (${Math.max(a, b)} - ${Math.min(a, b)} = ${diffParts} parts).`,
                        `Step 2: The difference in parts equals the difference in value. So, ${diffParts} parts = £${diff}.`,
                        `Step 3: Divide the value by the difference in parts to find ONE part (£${diff} ÷ ${diffParts} = £${valuePerPart.toFixed(2)}).`,
                        `Step 4: Multiply ONE part by each original ratio.`,
                        `Result: Part A is £${valA.toFixed(2)}, Part B is £${valB.toFixed(2)}. (Total: £${total.toFixed(2)})`
                    ]
                };
            }
        },
        
        sharedRatiosTotal: {
            calculate: (total, partA, partB) => {
                const t = parseFloat(total);
                const a = parseInt(partA);
                const b = parseInt(partB);
                const totalParts = a + b;
                const valuePerPart = t / totalParts;
                
                const valA = a * valuePerPart;
                const valB = b * valuePerPart;

                return {
                    totalParts: totalParts,
                    valuePerPart: valuePerPart.toFixed(2),
                    valA: valA.toFixed(2),
                    valB: valB.toFixed(2),
                    steps: [
                        `Step 1: Find the total number of parts (${a} + ${b} = ${totalParts} parts).`,
                        `Step 2: Divide the total (£${t}) by the total parts to find the value of ONE part (£${t} ÷ ${totalParts} = £${valuePerPart.toFixed(2)}).`,
                        `Step 3: Multiply the value of one part by the ratio shares.`,
                        `Result: Part A gets £${valA.toFixed(2)}, Part B gets £${valB.toFixed(2)}.`
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
