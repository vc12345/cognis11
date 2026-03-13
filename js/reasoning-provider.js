/**
 * Cognis11 Reasoning Provider
 * Handles multi-step logic for Pillar 2
 */

const ReasoningProvider = {
    modules: {
        // Module 1: The "Change" Problem (Multi-step Money)
        1: {
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
        // Module 2: Inverse Operations (Reverse Thinking)
        2: {
            name: "Reverse Thinking",
            generate: (target, ops) => {
                // Example ops: [{type: 'add', val: 5}, {type: 'mult', val: 2}]
                let current = target;
                const breakdown = [];
                
                // Work backwards
                ops.slice().reverse().forEach(op => {
                    const oldVal = current;
                    if (op.type === 'add') {
                        current -= op.val;
                        breakdown.push(`Inverse of +${op.val} is -${op.val}: ${oldVal} - ${op.val} = ${current}`);
                    } else if (op.type === 'mult') {
                        current /= op.val;
                        breakdown.push(`Inverse of ×${op.val} is ÷${op.val}: ${oldVal} ÷ ${op.val} = ${current}`);
                    }
                });
                
                return {
                    inputs: { target, ops },
                    breakdown: breakdown,
                    finalInput: current
                };
            }
        }
    },

    // Helper to get module logic safely
    getModule: function(id) {
        return this.modules[id] || null;
    }
};
