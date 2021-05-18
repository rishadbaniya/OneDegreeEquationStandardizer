// Use "deno run test.js" to run the test


import makeItStandard from './release/oneDegreeEquationStandardizer.min.js';
// Won't throw error 
console.log(makeItStandard("2x+3y+20=20"))

// WIll throw error
console.log(makeItStandard("2x+3y+20+=20"))
