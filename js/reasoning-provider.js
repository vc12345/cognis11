const ReasoningProvider = {
    modules: {
        // Module 29: The "Change" Problem (Multi-step Money)
        29: {
            name: "Multi-Step Money",
            generate: (itemPrice, qty, payment) => {
                const p = parseFloat(itemPrice);
                const q = parseInt(qty);
                const pay = parseFloat(payment);
                const totalCost = p * q;
                const change = pay - totalCost;
                return {
                    inputs: { itemPrice: p, qty: q, payment: pay },
                    steps: {
                        step1: `Total Cost: ${q} × £${p.toFixed(2)} = £${totalCost.toFixed(2)}`,
                        step2: `Change: £${pay.toFixed(2)} - £${totalCost.toFixed(2)} = £${change.toFixed(2)}`
                    },
                    answers: { change: change.toFixed(2) }
                };
            }
        },
        // Module 30: Inverse Operations (Reverse Thinking)
        30: {
            name: "Reverse Thinking",
            generate: (target) => {
                // Hardcoded logic for the interactive demo
                const step2 = target / 2;
                const step1 = step2 - 5;
                return {
                    target: target,
                    steps: [
                        { op: "÷ 2", res: step2 },
                        { op: "- 5", res: step1 }
                    ]
                };
            }
        },
        // Module 31: Number Sequences
        31: {
            name: "Sequence Logic",
            generate: (start, jump, length) => {
                let seq = [];
                for(let i=0; i<length; i++) {
                    seq.push(parseInt(start) + (i * parseInt(jump)));
                }
                return { sequence: seq, rule: `Add ${jump}` };
            }
        }
    },
    getModule: function(id) { return this.modules[id] || null; }
};
