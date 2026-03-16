/**
 * Cognis11 LogicProvider
 * The centralized engine for generating Type 2 Schema logic.
 */

const LogicProvider = {
    modules: {

        unitary: {
            calculate: (knownQty, knownValue, targetQty) => {
                const unitValue = knownValue / knownQty;
                const finalValue = unitValue * targetQty;
                return {
                    unitValue: unitValue.toFixed(2),
                    finalValue: finalValue.toFixed(2),
                    steps: [
                        `Identify the known relationship: ${knownQty} units = ${knownValue}.`,
                        `The "Bridge to One": Divide the total value by the quantity (${knownValue} ÷ ${knownQty}) to find the value of a single unit.`,
                        `Single unit value = ${unitValue.toFixed(2)}.`,
                        `Scale to target: Multiply the single unit value by the target quantity (${unitValue.toFixed(2)} × ${targetQty}).`,
                        `Final Result: ${finalValue.toFixed(2)}`
                    ]
                };
            }
        },

        // Module 24: Translation
        24: {
            name: "Translation Logic",
            generate: (x, y, dx, dy) => {
                const startX = parseInt(x);
                const startY = parseInt(y);
                const moveX = parseInt(dx);
                const moveY = parseInt(dy);
                return {
                    inputs: { startX, startY, moveX, moveY },
                    answers: {
                        finalX: startX + moveX,
                        finalY: startY + moveY,
                        vector: `[${moveX}, ${moveY}]`
                    }
                };
            }
        },
        
        // Module 26: Rotational Symmetry
        26: {
            name: "Rotational Symmetry",
            generate: (shapeType) => {
                const library = {
                    'square': { order: 4, angle: 90 },
                    'rectangle': { order: 2, angle: 180 },
                    'equilateral-triangle': { order: 3, angle: 120 },
                    'parallelogram': { order: 2, angle: 180 }
                };
                return {
                    inputs: { shape: shapeType },
                    answers: library[shapeType]
                };
            }
        },
        
        // Module 27: Perimeter
        27: {
            name: "Perimeter Calculation",
            generate: (width, height, isTriangle) => {
                const w = parseFloat(width);
                const h = parseFloat(height);
                // For simplicity in the engine, we treat triangle as right-angled for hypotenuse calc
                const perimeter = isTriangle 
                    ? (w + h + Math.sqrt(w*w + h*h)).toFixed(1) 
                    : (2 * (w + h)).toFixed(1);
                return {
                    inputs: { w, h, isTriangle },
                    answers: { total: perimeter }
                };
            }
        },
        
        // Module 28: Area
        28: {
            name: "Area of Simple Shapes",
            generate: (base, height, type) => {
                const b = parseFloat(base);
                const h = parseFloat(height);
                const area = type === 'triangle' ? (0.5 * b * h) : (b * h);
                return {
                    inputs: { b, h, type },
                    answers: {
                        area: area.toFixed(1),
                        traps: {
                            noHalf: (b * h).toFixed(1) // Common triangle error
                        }
                    }
                };
            }
        },

        // Module 19: Mean (Averages)
        19: {
            name: "The Mean Average",
            generate: (listString) => {
                const nums = listString.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                const sum = nums.reduce((a, b) => a + b, 0);
                const mean = sum / nums.length;
                return {
                    inputs: { list: nums, count: nums.length, sum: sum },
                    answers: {
                        mean: mean.toFixed(2),
                        traps: {
                            median: "Middle value (if sorted)",
                            range: Math.max(...nums) - Math.min(...nums)
                        }
                    }
                };
            }
        },
       
        // Module 20: Range & Spread
        20: {
            name: "Range & Spread",
            generate: (listString) => {
                const nums = listString.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                const max = Math.max(...nums);
                const min = Math.min(...nums);
                return {
                    inputs: { max, min },
                    answers: {
                        range: max - min,
                        traps: {
                            sum: max + min,
                            onlyMax: max
                        }
                    }
                };
            }
        },
       
        // Module 21: Pie Charts (Angles)
        21: {
            name: "Pie Chart Angles",
            generate: (value, total) => {
                const v = parseFloat(value);
                const t = parseFloat(total);
                // Angle = (Value / Total) * 360
                const angle = (v / t) * 360;
                return {
                    inputs: { value: v, total: t },
                    answers: {
                        angle: angle.toFixed(1),
                        multiplier: (360 / t).toFixed(2)
                    }
                };
            }
        },
       
        // Module 23: Co-ordinates (4 Quadrants)
        23: {
            name: "Coordinate Translation",
            generate: (x, y, moveX, moveY) => {
                const newX = parseInt(x) + parseInt(moveX);
                const newY = parseInt(y) + parseInt(moveY);
                return {
                    inputs: { x, y, moveX, moveY },
                    answers: {
                        newPoint: `(${newX}, ${newY})`,
                        traps: {
                            swapped: `(${newY}, ${newX})`,
                            signError: `(${parseInt(x) - parseInt(moveX)}, ${parseInt(y) - parseInt(moveY)})`
                        }
                    }
                };
            }
        },
       
        // Module 25: Reflection
        25: {
            name: "Reflection Logic",
            generate: (x, y, axis) => {
                // Reflect over x-axis: (x, -y) | Reflect over y-axis: (-x, y)
                const refX = axis === 'x' ? x : -x;
                const refY = axis === 'x' ? -y : y;
                return {
                    inputs: { x, y, axis },
                    answers: {
                        reflected: `(${refX}, ${refY})`
                    }
                };
            }
        },

        // Module 2: Rounding & Estimation
        2: {
            name: "Rounding & Estimation",
            generate: (num, place) => {
                const n = parseFloat(num);
                const p = parseInt(place); // 10, 100, or 0.1
                const correct = Math.round(n / p) * p;
                return {
                    inputs: { val: n, place: p },
                    answers: {
                        correct: correct.toFixed(p < 1 ? 1 : 0),
                        traps: {
                            roundDown: (Math.floor(n / p) * p).toFixed(p < 1 ? 1 : 0),
                            wrongPlace: Math.round(n / (p * 10)) * (p * 10)
                        }
                    }
                };
            }
        },
        
        // Module 6: Fractions of Amounts
        6: {
            name: "Fractions of Amounts",
            generate: (num, den, total) => {
                const n = parseInt(num);
                const d = parseInt(den);
                const t = parseInt(total);
                const onePart = t / d;
                const result = onePart * n;
                return {
                    inputs: { num: n, den: d, total: t },
                    answers: {
                        onePart: onePart,
                        result: result,
                        traps: {
                            flipped: (t / n) * d,
                            justDiv: t / d
                        }
                    }
                };
            }
        },
        
        // Module 8: FDP Equivalents
        8: {
            name: "FDP Equivalents",
            generate: (decimal) => {
                const d = parseFloat(decimal);
                return {
                    inputs: { decimal: d },
                    answers: {
                        percent: (d * 100).toFixed(0) + "%",
                        fraction: (d * 100) + "/100",
                        traps: {
                            placeValueError: (d * 10).toFixed(0) + "%",
                            zeroError: (d * 1000).toFixed(0) + "%"
                        }
                    }
                };
            }
        },
       
        // Module 10: Scaling Ratios
        10: {
            name: "Scaling Ratios",
            generate: (valA, valB, targetA) => {
                const a = parseInt(valA);
                const b = parseInt(valB);
                const tA = parseInt(targetA);
                const factor = tA / a;
                const resultB = b * factor;
                return {
                    inputs: { a, b, tA },
                    answers: {
                        factor: factor,
                        resultB: resultB,
                        traps: {
                            additive: b + (tA - a),
                            inverted: b / factor
                        }
                    }
                };
            }
        },
        
        // Module 17: Time Durations
        17: {
            name: "Time Durations",
            generate: (h, m, duration) => {
                const startMins = (parseInt(h) * 60) + parseInt(m);
                const endMins = startMins + parseInt(duration);
                const endH = Math.floor(endMins / 60) % 24;
                const endM = endMins % 60;
                return {
                    inputs: { h, m, duration },
                    answers: {
                        endTime: `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`,
                        traps: {
                            decimalTime: (startMins + parseInt(duration)) / 100, // Thinking 60 mins = 100
                            hourOnly: (parseInt(h) + Math.floor(duration/60)) + ":" + m
                        }
                    }
                };
            }
        },

        // Module 16v2: The More Than Trap
        16v2: {
            name: "More Than Trap v2",
            generate: (total, difference) => {
                const t = parseInt(total);
                const d = parseInt(difference);
                const smaller = (t - d) / 2;
                const larger = smaller + d;
                return {
                    inputs: { total: t, difference: d },
                    answers: {
                        smaller: smaller,
                        larger: larger,
                        traps: {
                            simpleHalf: t / 2,
                            halfAndAdd: (t / 2) + d
                        }
                    }
                };
            }
        },

        // Module 13: Ratio Sharing
        13: {
            name: "Ratio Sharing",
            generate: (a, b, total) => {
                const rA = parseInt(a);
                const rB = parseInt(b);
                const val = parseInt(total);
                const onePart = val / (rA + rB);
                return {
                    inputs: { a: rA, b: rB, total: val },
                    answers: {
                        partA: (rA * onePart).toFixed(2),
                        partB: (rB * onePart).toFixed(2),
                        onePart: onePart.toFixed(2),
                        traps: {
                            divideByOne: (val / rA).toFixed(2),
                            multiplyDirect: (val * rA)
                        }
                    }
                };
            }
        },
        
        // Module 15: Venn Diagram Overlap
        15: {
            name: "Venn Overlap",
            generate: (a, b, total) => {
                const gA = parseInt(a);
                const gB = parseInt(b);
                const t = parseInt(total);
                const overlap = (gA + gB) - t;
                return {
                    inputs: { groupA: gA, groupB: gB, total: t },
                    answers: {
                        both: overlap,
                        onlyA: gA - overlap,
                        onlyB: gB - overlap,
                        traps: { sum: gA + gB, diff: Math.abs(gA - gB) }
                    }
                };
            }
        },
        
        // Module 7: Area vs Perimeter
        7: {
            name: "Area vs Perimeter",
            generate: (length, width) => {
                const l = parseInt(length);
                const w = parseInt(width);
                return {
                    inputs: { length: l, width: w },
                    answers: {
                        area: l * w,
                        perimeter: 2 * (l + w),
                        traps: {
                            confused: l + w,
                            areaPerimSwap: "Check formula"
                        }
                    }
                };
            }
        },
        
        // Module 18: Probability (The "Not" Principle)
        18: {
            name: "Probability Not",
            generate: (numerator, denominator) => {
                const n = parseInt(numerator);
                const d = parseInt(denominator);
                return {
                    inputs: { win: n, total: d },
                    answers: {
                        probNot: (d - n) + "/" + d,
                        decimal: ((d - n) / d).toFixed(2),
                        traps: {
                            justNumerator: n,
                            inverted: d + "/" + n
                        }
                    }
                };
            }
        },

        // Module 5: Percentage Increase/Decrease
        5: {
            name: "Percentage Change",
            generate: (original, percent) => {
                const o = parseInt(original);
                const p = parseInt(percent);
                const change = (o * p) / 100;
                return {
                    inputs: { original: o, percent: p },
                    answers: {
                        increase: o + change,
                        decrease: o - change,
                        change: change,
                        traps: {
                            justAdd: o + p, // Added the percent as a whole number
                            lazyChange: p   // Thought the answer was just the percentage
                        }
                    }
                };
            }
        },
        
        // Module 9: Average Speed (The DST Triangle)
        9: {
            name: "Average Speed",
            generate: (distance, time) => {
                const d = parseInt(distance);
                const t = parseInt(time);
                const speed = d / t;
                return {
                    inputs: { distance: d, time: t },
                    answers: {
                        speed: speed.toFixed(1),
                        traps: {
                            inverse: (t / d).toFixed(2), // Time divided by distance
                            multiplied: d * t            // Thought speed was D x T
                        }
                    }
                };
            }
        },
        
        // Module 12: Reverse Percentages (The "Back to 100" Trap)
        12: {
            name: "Reverse Percentages",
            generate: (finalValue, percentChange) => {
                const f = parseInt(finalValue);
                const p = parseInt(percentChange);
                const original = f / (1 + (p / 100));
                return {
                    inputs: { finalValue: f, percentChange: p },
                    answers: {
                        correct: Math.round(original),
                        traps: {
                            forwardApply: f - (f * (p / 100)), // Tried to take % off the NEW price
                            justSub: f - p                    // Just subtracted the number
                        }
                    }
                };
            }
        },
        
        // Module 22: Missing Lengths (Compound Shapes)
        22: {
            name: "Missing Lengths",
            generate: (totalLength, partialLength) => {
                const t = parseInt(totalLength);
                const p = parseInt(partialLength);
                return {
                    inputs: { total: t, part: p },
                    answers: {
                        missing: t - p,
                        traps: {
                            totalRepeat: t,
                            added: t + p
                        }
                    }
                };
            }
        },
        
        // Module 3: Mean Average (The Reverse Mean)
        3: {
            name: "Reverse Mean",
            generate: (count, currentMean, newMean) => {
                const n = parseInt(count);
                const m1 = parseInt(currentMean);
                const m2 = parseInt(newMean);
                const currentTotal = n * m1;
                const targetTotal = (n + 1) * m2;
                return {
                    inputs: { count: n, currentMean: m1, targetMean: m2 },
                    answers: {
                        needed: targetTotal - currentTotal,
                        traps: {
                            meanDiff: m2 - m1,
                            justTarget: m2
                        }
                    }
                };
            }
        },

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
