const ReasoningProvider = {
    modules: {

        // Module 32: Data Interpretation (Tables)
        32: {
            name: "Data Table Logic",
            generate: (rows) => {
                // Generates a comparison between two items in a table
                const data = [
                    { name: "Product A", price: 12, sales: 50 },
                    { name: "Product B", price: 15, sales: 30 },
                    { name: "Product C", price: 10, sales: 80 }
                ];
                return {
                    table: data,
                    questions: {
                        totalSales: data.reduce((sum, item) => sum + item.sales, 0),
                        diffPrice: Math.abs(data[0].price - data[1].price)
                    }
                };
            }
        },
        
        // Module 33: Logical Deduction
        33: {
            name: "Elimination Logic",
            generate: () => {
                return {
                    clues: [
                        "The circle is not red.",
                        "The blue shape is not a square.",
                        "The red shape is a triangle."
                    ],
                    solution: "Red Triangle, Blue Circle, Green Square"
                };
            }
        },
            
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
