/**
 * Cognis11 LogicProvider
 * The centralized engine for generating Type 2 Schema logic.
 */

const LogicProvider = {
    modules: {

        // Module 14: Interval Logic
        14: {
            name: "Interval Logic",
            generate: (length, gap) => {
                const l = parseInt(length) || 10;
                const g = parseInt(gap) || 2;
                
                const gapsCount = Math.floor(l / g);
                const correctPosts = gapsCount + 1;

                return {
                    inputs: { length: l, gap: g },
                    answers: {
                        gaps: gapsCount,
                        correct: correctPosts,
                        traps: {
                            simpleDivision: gapsCount, // Forgot the starting post
                            offByTwo: gapsCount + 2,   // Over-corrected
                            perimeter: gapsCount       // Confused a line with a circle
                        }
                    }
                };
            }
        },

        // Module 1: Unitary Method
        1: {
            name: "Unitary Method",
            generate: (quantity, totalCost, targetQuantity) => {
                const q1 = parseInt(quantity) || 1;
                const c1 = parseFloat(totalCost) || 1;
                const q2 = parseInt(targetQuantity) || 1;
                
                const unitPrice = c1 / q1;
                const finalPrice = unitPrice * q2;

                return {
                    inputs: { quantity: q1, totalCost: c1, targetQuantity: q2 },
                    answers: {
                        unit: unitPrice.toFixed(2),
                        correct: finalPrice.toFixed(2),
                        traps: {
                            upscaleOnly: (c1 * q2).toFixed(2),
                            inverse: ((q1 / c1) * q2).toFixed(2)
                        }
                    }
                };
            }
        },
        
        // Module 16: The More Than Trap
        16: {
            name: "The More Than Trap",
            generate: (total, difference) => {
                let t = parseInt(total);
                let d = parseInt(difference);
                if ((t - d) % 2 !== 0) t++; 

                const smaller = (t - d) / 2;
                const larger = smaller + d;

                return {
                    inputs: { total: t, difference: d },
                    answers: {
                        correct: smaller,
                        traps: {
                            snap: t - d,
                            lazyHalf: t / 2,
                            wrongItem: larger
                        }
                    }
                };
            }
        },

        // Module 4: Inverse Proportion
        4: {
            name: "Inverse Proportion",
            generate: (workers, days, newWorkers) => {
                const w1 = parseInt(workers) || 1;
                const d1 = parseInt(days) || 1;
                const w2 = parseInt(newWorkers) || 1;
                
                const totalWorkUnits = w1 * d1;
                const correctDays = totalWorkUnits / w2;

                return {
                    inputs: { workers: w1, days: d1, newWorkers: w2, totalWorkUnits },
                    answers: {
                        correct: parseFloat(correctDays.toFixed(1)),
                        traps: {
                            linearMore: parseFloat(((d1 / w1) * w2).toFixed(1)),
                            subtraction: Math.max(0, d1 - (w2 - w1))
                        }
                    }
                };
            }
        },

        // Module 11: Shared Ratios
        11: {
            name: "Shared Ratios",
            generate: (ratioA, ratioB, total) => {
                const rA = parseInt(ratioA) || 1;
                const rB = parseInt(ratioB) || 1;
                const tRaw = parseInt(total) || 1;

                const totalParts = rA + rB;
                // Snap total to a multiple of totalParts
                const adjTotal = Math.round(tRaw / totalParts) * totalParts;
                const onePartValue = adjTotal / totalParts;

                return {
                    inputs: { ratioA: rA, ratioB: rB, total: adjTotal, totalParts: totalParts },
                    answers: {
                        partA: onePartValue * rA,
                        partB: onePartValue * rB,
                        onePart: onePartValue,
                        traps: {
                            divByA: Math.round(adjTotal / rA),
                            simpleSplit: adjTotal / 2
                        }
                    }
                };
            }
        },
    },

    getModule: function(id) {
        return this.modules[id] || null;
    }
};

if (typeof module !== 'undefined') {
    module.exports = LogicProvider;
}
