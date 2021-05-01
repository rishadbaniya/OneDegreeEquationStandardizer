// It takes equation with about 3 variables and resolves it properly
// Eg 2x + 10x + 3 + 2 + 10y = 20z + 2 into 12x + 10y - 20z = -3
// It will return latex of 3 steps
// Step 1 => Its the latex building of just showing the user question
// Step 2 => Its the latex building of separating the like variables and the constants in left and right respectively
// Step 3 => Its the latex building of adding and subtracting the like variables and the constants

export const makeItStandard = (rawEquation: string) => {
  let step1: ThreeVariableEquation = new ThreeVariableEquation(rawEquation);
  let step1Latex = step1.buidlatexFromRawInput();
  let step2: ThreeVariableEquation = _equationVarAndConstSeparator(step1);
  let step2Latex = buildLatexVarFromLeftAndConstFromRight(step2);
  let step3: ThreeVariableEquation = _likeVariableAndConstantAdder(step2);
  let step3Latex = buildLatexVarFromLeftAndConstFromRight(step3);
  return [step1Latex, step2Latex, step3Latex];
};

type CoeffVarAndConstantTree = {
  CoeffAndVar: string[];
  Constants: string[];
};

class ThreeVariableEquation {
  rawInputEquation: string;
  leftSideCoeffVarAndConstantTree: CoeffVarAndConstantTree;
  rightSideCoeffVarAndConstantTree: CoeffVarAndConstantTree;
  constructor(equation: string) {
    this.rawInputEquation = equation;
    let rawExpression = equation.replace(/\s*/g, "");
    let leftSideRawExpression = (rawExpression.match(/.*(?=\=)/) ?? [""])[0];
    let rightSideRawExpression = (rawExpression.match(/(?<=\=).*/) ?? [""])[0];
    this.leftSideCoeffVarAndConstantTree = {
      CoeffAndVar: leftSideRawExpression.match(/(\+|\-)?[\d]*[A-Za-z]/g) ?? [],
      Constants:
        leftSideRawExpression.match(/(\+|\-)?[\d]{1,}(?![A-Za-z0-9])/g) ?? [],
    };
    this.rightSideCoeffVarAndConstantTree = {
      CoeffAndVar: rightSideRawExpression.match(/(\+|\-)?[\d]*[A-Za-z]/g) ?? [],
      Constants:
        rightSideRawExpression.match(/(\+|\-)?[\d]{1,}(?![A-Za-z0-9])/g) ?? [],
    };
  }
  buidlatexFromRawInput(): string {
    return this.rawInputEquation.replace(/([A-Za-z])/g, "\text{$1}");
  }
}



// Latex building for the third and fourth step, where
// left side has no constants and right side has no variables
const buildLatexVarFromLeftAndConstFromRight = (
  threeVarEq: ThreeVariableEquation
) => {
  // Latex string initial value set to empty string
  let returnLatex = "";

  // Iterate over all the coeff in the left side and making latex out of it
  threeVarEq.leftSideCoeffVarAndConstantTree.CoeffAndVar.map((data) => {
    returnLatex += data.replace(/([A-Za-z])/, "\text{$1}");
  });

  // Add equals sign after the latex of the left expression of equation
  returnLatex += "=";

  // Iterate over all the constants in the right side making latex of of it
  // If the constants array is empty then it must be that constant is 0
  if (!(threeVarEq.rightSideCoeffVarAndConstantTree.Constants.length === 0)) {
    threeVarEq.rightSideCoeffVarAndConstantTree.Constants.map((data) => {
      returnLatex += data;
    });
  } else {
    returnLatex += "0";
  }
  return returnLatex;
};




const _equationVarAndConstSeparator = (
  equation: ThreeVariableEquation
): ThreeVariableEquation => {
  equation.leftSideCoeffVarAndConstantTree.Constants.map(
    (_constantValue: string) => {
      let SignAndvalue = {
        _sign: "",
        _value: (_constantValue.match(/[0-9]{1,}/) ?? [""])[0],
      };
      if ((_constantValue.match(/[-]/) ?? []).length === 1) {
        SignAndvalue._sign = "-";
      } else if ((_constantValue.match(/[+]/) ?? []).length === 1) {
        SignAndvalue._sign = "+";
      } else {
        SignAndvalue._sign = "+";
      }
      equation.rightSideCoeffVarAndConstantTree.Constants.push(
        `${SignAndvalue._sign === "+" ? "-" : "+"}${SignAndvalue._value}`
      );
    }
  );
  equation.rightSideCoeffVarAndConstantTree.CoeffAndVar.map(
    (_coeffAndVarValue: string) => {
      let signCoeffandVar = {
        sign: "",
        coeff: (_coeffAndVarValue.match(/[0-9]{1,}/) ?? [""])[0],
        var: (_coeffAndVarValue.match(/[A-Za-z]/) ?? [""])[0],
      };
      if ((_coeffAndVarValue.match(/[-]/) ?? []).length === 1) {
        signCoeffandVar.sign = "-";
      } else if ((_coeffAndVarValue.match(/[+]/) ?? []).length === 1) {
        signCoeffandVar.sign = "+";
      } else {
        signCoeffandVar.sign = "+";
      }
      equation.leftSideCoeffVarAndConstantTree.CoeffAndVar.push(
        `${signCoeffandVar.sign === "+" ? "-" : "+"}${signCoeffandVar.coeff}${
          signCoeffandVar.var
        }`
      );
    }
  );
  equation.rightSideCoeffVarAndConstantTree.CoeffAndVar = [];
  equation.leftSideCoeffVarAndConstantTree.Constants = [];
  return equation;
};

// Adds all the like variables in the left side and adds all the constants in the right side
const _likeVariableAndConstantAdder = (
  equation: ThreeVariableEquation
): ThreeVariableEquation => {
  // ADDING THE CONSTANTS
  // Only operate over the constants array in the right side if its lenght is greater than 1
  if (equation.rightSideCoeffVarAndConstantTree.Constants.length !== 1) {
    // Min constant value present in the right side
    let equationValue = 0;
    equation.rightSideCoeffVarAndConstantTree.Constants.map(
      (constantValue: string) => {
        equationValue = equationValue + parseInt(constantValue);
      }
    );
    equation.rightSideCoeffVarAndConstantTree.Constants = [`${equationValue}`];
  }
  // ADDING THE LIKE VARIABLES IN THE LEFT SIDE
  const addLikeVariables = (varArray: string[]): string[] => {
    let returnArray: string[] = [];
    let coeffAndVarGroup: {
      vars: string[];
      values: string[][];
    } = {
      vars: [],
      values: [],
    };
    varArray.map((data1) => {
      let data1Var = (data1.match(/[A-Za-z]/) ?? [""])[0];
      if (!coeffAndVarGroup.vars.includes(data1Var)) {
        let varValueArray: string[] = [];
        varArray.map((data2) => {
          if ((data2.match(/[A-Za-z]/) ?? [""])[0] === data1Var) {
            if (data2.match(/[+-]?[0-9]{1,}/)) {
              // If it's in the form of 2x or +2x or -2x, then get the 2, +2 or -2 out of it
              varValueArray.push((data2.match(/[+-]?[0-9]{1,}/) ?? [""])[0]);
            } else if (data2.length === 2) {
              // If it's in the form of -x or +x , then get the -1 or +1 respectively
              varValueArray.push(`${data2[0]}1`);
            } else {
              //At last the remaining is just x , so get the +1
              varValueArray.push("1");
            }
          }
        });
        coeffAndVarGroup.values.push(varValueArray);
        coeffAndVarGroup.vars.push(data1Var);
      }
    });

    for (let i = 1; i <= coeffAndVarGroup.vars.length; i++) {
      let coeffAndvarGroupValues = 0;
      coeffAndVarGroup.values[i - 1].map((value: string) => {
        coeffAndvarGroupValues = coeffAndvarGroupValues + parseInt(value);
      });
      returnArray.push(
        `${
          coeffAndvarGroupValues < 0
            ? coeffAndvarGroupValues
            : coeffAndVarGroup.vars[0] === coeffAndVarGroup.vars[i - 1]
            ? coeffAndvarGroupValues
            : `+${coeffAndvarGroupValues}`
        }${coeffAndVarGroup.vars[i - 1]}`
      );
    }
    return returnArray;
  };
  equation.leftSideCoeffVarAndConstantTree.CoeffAndVar = addLikeVariables(
    equation.leftSideCoeffVarAndConstantTree.CoeffAndVar
  );
  return equation;
};