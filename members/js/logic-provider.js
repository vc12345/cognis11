const LogicProvider = {
    modules: {
        
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
