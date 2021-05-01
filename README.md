# OneDegreeEquationStandardizer

🤐 Beware - Its all about math
```
Convert 
2x + 3y + 10z - 20 + x = 10 
into 
3x + 3y + 10z = 30 (ax + By + Cz = D) form
```
Equation Standardizer is made with sole purpose of making any user input equation of one degree, into standard form.

Eg.

Lets consider an equation :

```let rawEquation : string = "2x + 3y + 20 + 10y + 20z + 30 = 10y";```

In your deno program, download the **oneDegreeEqStandardizer.ts** file from this repo and import the function as

```import {makeItStandard} from "./oneDegreeEqStandardizer.ts";```

Pass the raw equation into the "makeItStandard" function

```let standardEq = makeItStandard(rawEquation);```

This will return output as :
```
{
  latexArray: [
    "2\text{x}+3\text{y}+20+10\text{y}+20\text{z}+30=10\text{y}",
    "2\text{x}+3\text{y}+10\text{y}+20\text{z}-10\text{y}=-20-30",
    "2\text{x}+3\text{y}+20\text{z}=-50"
  ],
  leftVars: [ "2x", "+3y", "+20z" ],
  rightConstant: [ "-50" ]
}
```
**latexArray :** 

It contains the three steps of resolving into standard form ✅

Step 1 : It gives the latex of the question 

Step 2 : It gives the latex of taking constants, like variables to right and left respectively

Step 3: It gives the latex after computing the like variables and constants taken to left and right.

**leftVars , rightConstant  :** 

It gives us the array of standard form variables and constants that were resolved ✅
