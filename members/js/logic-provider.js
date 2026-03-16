const LogicProvider = {
    modules: {

        timeConv = {
            calculate: (h, m, addM) => {
                const hStart = parseInt(h) || 0;
                const mStart = parseInt(m) || 0;
                const duration = parseInt(addM) || 0;
        
                const totalMins = (hStart * 60) + mStart + duration;
                const finalH = Math.floor(totalMins / 60);
                const finalM = totalMins % 60;
                
                const overflowed = (mStart + duration) >= 60;
                const hoursCarried = Math.floor((mStart + duration) / 60);
        
                return {
                    totalMins,
                    finalH: finalH % 24, // 24-hour clock
                    finalM,
                    overflowed,
                    hoursCarried,
                    steps: [
                        `Step 1: Focus on the Minutes column first. ${mStart}m + ${duration}m = ${mStart + duration}m.`,
                        overflowed ? `Step 2: OVERFLOW! ${mStart + duration}m is more than 60. Divide by 60 to find 'Carried Hours'.` : `Step 2: No overflow. Total minutes stay in the minutes column.`,
                        overflowed ? `Step 3: ${mStart + duration} ÷ 60 = ${hoursCarried} hour(s) to carry, with ${finalM}m remaining.` : `Step 3: Final check of the Hours column.`,
                        `Result: ${finalH % 24}:${finalM.toString().padStart(2, '0')}`
                    ]
                };
            }
        },

        intervalLogic = {
            calculate: (numObjects, totalValue) => {
                const n = parseInt(numObjects) || 0;
                const total = parseFloat(totalValue) || 0;
        
                // The Rule: Gaps = Objects - 1
                const gaps = Math.max(0, n - 1);
                const intervalSize = gaps > 0 ? total / gaps : 0;
        
                return {
                    gaps: gaps,
                    interval: intervalSize.toFixed(2),
                    steps: [
                        `Step 1: Identify the "Items". You have ${n} objects.`,
                        `Step 2: Apply the Interval Rule. Gaps = Items - 1.`,
                        `${n} items - 1 = ${gaps} gaps.`,
                        `Step 3: Calculate the size of 1 gap. ${total} ÷ ${gaps} = ${intervalSize.toFixed(2)}.`,
                        `Result: Every interval is ${intervalSize.toFixed(2)} units long.`
                    ]
                };
            }
        },

        trainTunnel = {
            calculate: (trainLen, tunnelLen, speedKmh) => {
                const L1 = parseFloat(trainLen) || 0;
                const L2 = parseFloat(tunnelLen) || 0;
                const speedKmhNum = parseFloat(speedKmh) || 1;
        
                const totalDistMetres = L1 + L2;
                const speedMs = speedKmhNum / 3.6; // Convert km/h to m/s
                const timeSeconds = totalDistMetres / speedMs;
        
                return {
                    totalDist: totalDistMetres,
                    speedMs: speedMs.toFixed(2),
                    timeSeconds: timeSeconds.toFixed(1),
                    steps: [
                        `Step 1: Calculate 'Distance to Clear'. Total = Train (${L1}m) + Tunnel (${L2}m).`,
                        `Total Distance = ${totalDistMetres}m.`,
                        `Step 2: Convert Speed. ${speedKmhNum} km/h ÷ 3.6 = ${speedMs.toFixed(2)} m/s.`,
                        `Step 3: Apply Time = Distance ÷ Speed (${totalDistMetres} ÷ ${speedMs.toFixed(2)}).`,
                        `Result: The train clears the tunnel in ${timeSeconds.toFixed(1)} seconds.`
                    ]
                };
            }
        },

        balancingEquations = {
            calculate: (a, b, c) => {
                const coef = parseInt(a) || 1;
                const constLeft = parseInt(b) || 0;
                const constRight = parseInt(c) || 0;

                if (coef === 0) return { error: "Coefficient of X cannot be zero.", steps: [] };

                const step1Right = constRight - constLeft;
                const finalX = step1Right / coef;

                return {
                    coef: coef,
                    constLeft: constLeft,
                    constRight: constRight,
                    step1Right: step1Right,
                    finalX: finalX,
                    steps: [
                        `Original Equation: ${coef}x + ${constLeft} = ${constRight}`,
                        `Step 1: Isolate the X term. Subtract ${constLeft} from BOTH sides.`,
                        `${coef}x = ${constRight} - ${constLeft}  →  ${coef}x = ${step1Right}`,
                        `Step 2: Solve for 1x. Divide both sides by ${coef}.`,
                        `x = ${step1Right} ÷ ${coef}  →  x = ${finalX.toFixed(2)}`
                    ]
                };
            }
        },

        relativeSpeed = {
            calculate: (s1, s2, dist) => {
                const speed1 = parseFloat(s1) || 0;
                const speed2 = parseFloat(s2) || 0;
                const d = parseFloat(dist) || 0;
                
                if (speed1 + speed2 === 0) return { rate: 0, timeH: 0, meetPtPct: 50, steps: ["Speeds cannot be zero."] };

                const relativeRate = speed1 + speed2;
                const timeToMeet = d / relativeRate;
                const timeMinutes = timeToMeet * 60;
                
                // Where do they meet on the track? (Percentage from Object A's start)
                const distA = speed1 * timeToMeet;
                const meetPtPct = (distA / d) * 100;

                return {
                    rate: relativeRate.toFixed(2),
                    timeH: timeToMeet.toFixed(2),
                    timeM: timeMinutes.toFixed(0),
                    meetPtPct: meetPtPct,
                    distA: distA.toFixed(1),
                    steps: [
                        `Step 1: Calculate Combined Speed. They are helping each other close the gap. ${speed1} + ${speed2} = ${relativeRate} km/h.`,
                        `Step 2: Use Time = Distance ÷ Speed.`,
                        `Step 3: ${d} km ÷ ${relativeRate} km/h = ${timeToMeet.toFixed(2)} hours.`,
                        `Result: They meet in ${timeToMeet.toFixed(2)} hours (${timeMinutes.toFixed(0)} mins).`,
                        `Bonus: Object A travelled ${distA.toFixed(1)} km before meeting.`
                    ]
                };
            }
        },

        averageSpeed: {
            calculate: (d1, t1, d2, t2) => {
                const totalDist = parseFloat(d1) + parseFloat(d2);
                const totalTime = parseFloat(t1) + parseFloat(t2);
                const avgSpeed = totalDist / totalTime;

                return {
                    totalDist: totalDist.toFixed(2),
                    totalTime: totalTime.toFixed(2),
                    avgSpeed: avgSpeed.toFixed(2),
                    steps: [
                        `Step 1: Find Total Distance. ${d1} + ${d2} = ${totalDist.toFixed(2)} km.`,
                        `Step 2: Find Total Time. ${t1} + ${t2} = ${totalTime.toFixed(2)} hours.`,
                        `Step 3: Apply the Golden Rule. Divide Total Distance by Total Time (${totalDist.toFixed(2)} ÷ ${totalTime.toFixed(2)}).`,
                        `Result: The Average Speed is ${avgSpeed.toFixed(2)} km/h.`
                    ]
                };
            }
        },

        constantSpeed: {
            calculate: (d, s, t, solvingFor) => {
                let dist = parseFloat(d);
                let speed = parseFloat(s);
                let time = parseFloat(t);
                let result = 0;
                let steps = [];

                if (solvingFor === 'd') {
                    result = speed * time;
                    steps = [`Step 1: Identify Speed (${speed}) and Time (${time}).`, `Step 2: Multiply them ($S \times T$).`, `Result: Distance is ${result.toFixed(2)} km.`];
                } else if (solvingFor === 's') {
                    result = dist / time;
                    steps = [`Step 1: Identify Distance (${dist}) and Time (${time}).`, `Step 2: Divide Distance by Time ($D \div T$).`, `Result: Speed is ${result.toFixed(2)} km/h.`];
                } else {
                    result = dist / speed;
                    steps = [`Step 1: Identify Distance (${dist}) and Speed (${speed}).`, `Step 2: Divide Distance by Speed ($D \div S$).`, `Result: Time is ${result.toFixed(2)} hours.`];
                }

                return { result: result.toFixed(2), steps };
            }
        },

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
