'use strict';
const resultInput = document.getElementById('result-input');
const enterInput = document.getElementById('enter-input');
const resultBtn = document.getElementById('result-button');

const testRegExpStr = (reg, str) => reg.test(str);

const calculateExpression = (inputValue) => { // 3.5 +4*10-5.3 /5 =
  let Regs = {
    OPERAND_SYMBOL_REG: /\s*[0-9\.]\s*/,
    OPERATOR_SYMBOL_REG: /\s*[+\-*/=]\s*/,
    rgxCorrectOperand: /[1-9][0-9]*(\.[0-9]+)?|0\.[0-9]*[1-9]|0/g,
    CHECK_CORRECT_ENTER: /[^0-9\.+\-*/]/g,
    CHECK_FLOAT_REG: /^[0-9]*[.]?[0-9]+(?:[eE][-+]?[0-9]+)?$/
  };
  let expression = '' + inputValue; // '3.5 +4*10-5.3 /5 ='
  let currentOperand = '';
  let currentOperator = '';
  let index = 0;
  let result = '';

  expression = expression.replace(/\s/g, ''); // Удалим пробелы в выражении: '3.5+4*10-5.3/5=' 

  // Проверки:
  if (expression.slice(-1) !== '=') { // Проверим что в конце выражения стоит знак "=",
    return 'В конце выражения должен стоять знак "="';
  } else if (Regs.CHECK_CORRECT_ENTER.test(expression.slice(0, -1))) { // а до него вводились только вещ числа и разрешенные операторы
    return 'Доступны вещ числа и операторы +-/*';
  } else if (!Regs.OPERAND_SYMBOL_REG.test(expression[0])) {
    return 'Выражение должно начинаться с операнда';
  }

  // Решение:
  while (index < expression.length) {
    if (testRegExpStr(Regs.OPERAND_SYMBOL_REG, expression[index])) { // Получим операнд:
      while ((index < expression.length) && (testRegExpStr(Regs.OPERAND_SYMBOL_REG, expression[index]))) {
        currentOperand += expression[index];
        index++;
      }
      if (!Regs.CHECK_FLOAT_REG.test(currentOperand)) {
        return `Операнд не число: "${currentOperand}"`;
      } else {
        currentOperand = parseFloat(currentOperand);
      }
      switch (currentOperator) {
        case "+":
          result += +currentOperand;
          break;
        case "-":
          result -= +currentOperand;
          break;
        case "*":
          result *= +currentOperand;
          break;
        case "/":
          result /= +currentOperand;
          break;
        default:
          result = currentOperand;
      }
      currentOperator = '';
      currentOperand = '';
    }
    
    if (testRegExpStr(Regs.OPERATOR_SYMBOL_REG, expression[index])) { // Получим оператор:
      while ((index < expression.length) && (testRegExpStr(Regs.OPERATOR_SYMBOL_REG, expression[index]))) {
        currentOperator += expression[index];
        index++;
      }
      if (currentOperator.length > 1) {
        return `Некорректный оператор: ${currentOperator}`;
      }
      if (currentOperator === '=') {
        return result.toFixed(2);
      }
    }
  }
};

const getResultHandler = (evt) => {
  evt.preventDefault();
  resultInput.value = calculateExpression(enterInput.value);
};

resultBtn.addEventListener('click', getResultHandler);
document.addEventListener('keydown', (keyEvt) => {
  if (keyEvt.keyCode === 13) {
    getResultHandler(keyEvt);
  }
});