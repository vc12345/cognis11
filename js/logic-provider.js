/**
 * Cognis11 LogicProvider
 * The centralized engine for generating Type 2 Schema logic.
 */

const LogicProvider = {
    modules: {
        // Module 16: The More Than Trap (Sum & Difference)
        16: {
            name: "The More Than Trap",
            generate: (total, difference) => {
                // Constraint: (Total - Difference) must be even for whole numbers
                let adjTotal = total;
                if ((total - difference) % 2 !== 0) {
                    adjTotal = total + 1;
                }
                const smaller = (adjTotal - difference) / 2;
                const larger = smaller + difference;

                return {
                    inputs: { total: adjTotal, difference },
                    answers: {
                        correct: smaller,
                        traps: {
                            snap: adjTotal - difference, // Forgot to divide by 2
                            lazyHalf: adjTotal / 2,      // Ignored the difference
                            wrongItem: larger            // Solved for the larger item
                        }
                    }
                };
            }
        },

        // Module 1: Unitary Method (Basics)
        1: {
            name: "Unitary Method",
            generate: (quantity, totalCost, targetQuantity) => {
                const unitPrice = totalCost / quantity;
                return {
                    inputs: { quantity, totalCost, targetQuantity },
                    answers: {
                        unit: unitPrice,
                        correct: unitPrice * targetQuantity,
                        traps: {
                            upscaleOnly: totalCost * targetQuantity, // Forgot to divide first
                            inverse: (quantity / totalCost) * targetQuantity // Divided wrong way
                        }
                    }
                };
            }
        },

        // Module 14: Interval Logic (Fence Posts)
        14: {
            name: "Interval Logic",
            generate: (length, gap) => {
                const gapsCount = Math.floor(length / gap);
                return {
                    inputs: { length, gap },
                    answers: {
                        correct: gapsCount + 1,
                        traps: {
                            simpleDivision: gapsCount, // Forgot the starting post
                            offByTwo: gapsCount + 2,    // Over-corrected
                            perimeter: (length / gap)   // Circular logic (no +1)
                        }
                    }
                };
            }
        },

        // Module 4: Inverse Proportion (Work/Rate)
        4: {
            name: "Invariance (Work/Rate)",
            generate: (workers, days, targetWorkers) => {
                const totalWorkUnits = workers * days;
                const targetDays = totalWorkUnits / targetWorkers;

                return {
                    inputs: { workers, days, targetWorkers },
                    answers: {
                        correct: targetDays,
                        traps: {
                            linearMore: (days / workers) * targetWorkers, // Thought more workers = more days
                            linearLess: (workers / targetWorkers) * days  // Direct proportion error
                        }
                    }
                };
            }
        },

        // Module 11: Shared Ratios (Total Known)
        11: {
            name: "Shared Ratios",
            generate: (ratioA, ratioB, total) => {
                const totalParts = ratioA + ratioB;
                // Adjust total to be divisible by totalParts
                const adjTotal = total + (totalParts - (total % totalParts)) % totalParts;
                const onePart = adjTotal / totalParts;

                return {
                    inputs: { ratioA, ratioB, total: adjTotal },
                    answers: {
                        partA: onePart * ratioA,
                        partB: onePart * ratioB,
                        correct: onePart * ratioB, // Usually asks for larger/smaller
                        traps: {
                            divByOneSide: adjTotal / ratioA, // Divided by part, not sum
                            forgotOnePart: onePart           // Stopped at the value of 1 part
                        }
                    }
                };
            }
        }
    },

    // Helper to fetch a specific module's logic
    getModule: function(id) {
        return this.modules[id] || null;
    }
};

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = LogicProvider;
}
