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
            name: "Inverse Proportion",
            generate: (workers, days, newWorkers) => {
                const w1 = parseInt(workers);
                const d1 = parseInt(days);
                const w2 = parseInt(newWorkers);
                
                // The "Total Work" is the invariant
                const totalWorkUnits = w1 * d1;
                const correctDays = totalWorkUnits / w2;

                return {
                    inputs: { workers: w1, days: d1, newWorkers: w2, totalWorkUnits },
                    answers: {
                        correct: parseFloat(correctDays.toFixed(1)),
                        traps: {
                            linearMore: parseFloat(((d1 / w1) * w2).toFixed(1)), // Double workers = double days
                            subtraction: d1 - (w2 - w1) // Just subtracted the difference in workers
                        }
                    }
                };
            }
        },

        // Module 11: Shared Ratios (Total Known)
        11: {
            name: "Shared Ratios",
            generate: (ratioA, ratioB, total) => {
                const totalParts = parseInt(ratioA) + parseInt(ratioB);
                // Snap total to the nearest multiple of totalParts so it's always "clean"
                const adjTotal = Math.round(total / totalParts) * totalParts;
                const onePartValue = adjTotal / totalParts;

                return {
                    inputs: { ratioA, ratioB, total: adjTotal, totalParts },
                    answers: {
                        partA: onePartValue * ratioA,
                        partB: onePartValue * ratioB,
                        onePart: onePartValue,
                        traps: {
                            divByA: Math.round(adjTotal / ratioA), // Divided by only one side
                            simpleSplit: adjTotal / 2,            // Ignored the ratio entirely
                            totalAsPart: adjTotal                  // Used total as a single part
                        }
                    }
                };
            }
        },
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
