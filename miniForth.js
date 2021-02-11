let stack = [];
let emitBuffer = "";


// Let's do something.
F(); // Draw F
$(5); INCREMENT(); IS_EVEN(); // Is the integer following 5 even?
DUP(); INCREMENT(); $(12); OVER(); DIVMOD();


// User-defined words

// : SQUARE DUP MULT ;
function SQUARE() {
  return DUP(), MULT();
}

// : INCREMENT 1 + ;
function INCREMENT() {
  return $(1), PLUS();
}

// : DUP10 10 DO DUP LOOP ;
function DUP10() {
  return DO_LOOP(function() {
    $(10), DUP();
  })
}

// Writes YES if the number on the top of the stack is even, NO otherwise.
// : IS_EVEN DUP 2 MOD 0 EQUALS IF 80 EMIT 83 EMIT ELSE 78 EMIT 79 EMIT ELSE CR ;
function IS_EVEN() {
  return IF_ELSE_THEN(
    function () {
      DUP(),
      $(2),
      MOD(),
      $(0),
      EQUALS();
    },
    function () { $(89), EMIT(), $(69), EMIT(), $(83), EMIT(); },
    function () { $(78), EMIT(), $(79), EMIT(); },
    function () { CR(); }
  );
}

// : STAR 42 EMIT ;
function STAR() {
  return $(42), EMIT();
}

// : STARS 0 DO STAR LOOP ;
function STARS() {
  return $(0),
    DO_LOOP(STAR)
}

// : MARGIN CR 30 SPACES ;
function MARGIN() {
  return CR(), $(30), SPACES()
}

// : BLIP MARGIN STAR ;
function BLIP() {
  return MARGIN(), STAR();
}

// : BAR MARGIN 5 STARS ;
function BAR() {
  return MARGIN(), $(5), STARS();
}

// F BAR BLIP BAR BLIP BLIP CR ;
function F() {
  return BAR(), BLIP(), BAR(), BLIP(), BLIP(), CR();
}

// The "language"

// Push a value to the stack
function $(arg1) {
  if (typeof arg1 !== "undefined") {
    stack.push(arg1);
  }
  return stack;
}

// Forth words (so far):
// DIV
// DIVMOD
// DO_LOOP
// DROP
// DUP
// EQUALS
// EMIT
// IF_THEN_ELSE
// MINUS
// MULT
// OVER
// PLUS
// ROT
// SPACE
// SWAP
// Forth words built upon other words:
// SPACE
// SPACES

function CR() {
  console.log(emitBuffer);
  emitBuffer = "";
  return stack;
}

function DIV() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    if (arg1 === 0) throw ("Fatal error: division by zero");
    let arg2 = stack.pop();
    stack.push(Math.floor(arg2 / arg1));
    return stack;
  }
}

function DIVMOD() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    stack.push(Math.floor(arg2 / arg1));
    stack.push(Math.floor(arg2 % arg1));
  }
  return stack;
}

function DO_LOOP(action) {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    for (let i = arg1; i < arg2; i++) {
      action.apply();
    }
  }
  return stack;
}

function DROP() {
  if (stack.length > 0) {
    stack.pop();
  }
  return stack;
}

function DUP() {
  if (stack.length > 0) {
    let arg1 = stack[stack.length - 1];
    stack.push(arg1);
  }
  return stack;
}

function EMIT() { // Will not actually write to the console until we call CR
  if (stack.length > 0) {
    let arg1 = stack.pop();
    emitBuffer = emitBuffer + String.fromCharCode(arg1);
  }
  return stack;
}

function EQUALS() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    stack.push(arg1 === arg2 ? -1 : 0);
  }
  return stack;
}

// Notice: an IF...THEN statement must be contained within a definition. You can't just enter these words in "calculator style".
function IF_ELSE_THEN(test, actionIfTrue, actionIfFalse, then) {
  test.apply();
  let arg1 = stack.pop();
  if (arg1 === -1) {
    actionIfTrue.apply();
  } else {
    actionIfFalse.apply();
  }
  then.apply();
  return stack;
}

function MINUS() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    stack.push(arg2 - arg1);
  }
  return stack;
}

function MOD() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    stack.push(Math.floor(arg2 % arg1));
  }
  return stack;
}

function MULT() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    stack.push(arg2 * arg1);
  }
  return stack;
}

function OVER() {
  if (stack.length > 1) {
    let arg1 = stack[stack.length - 2];
    stack.push(arg1);
  }
  return stack;
}

function PLUS() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    stack.push(arg2 + arg1);
  }
  return stack;
}

function ROT() {
  if (stack.length > 2) {
    let arg1 = stack.splice(stack.length - 3, 1)[0];
    stack.push(arg1);
  }
  return stack;
}

function SWAP() {
  if (stack.length > 1) {
    let arg1 = stack.pop();
    let arg2 = stack.pop();
    stack.push(arg1);
    stack.push(arg2);
  }
  return stack;
}

// : SPACE 32 EMIT ;
function SPACE() {
  return $(32), EMIT();
}

// : SPACES 0 DO SPACE LOOP ;
function SPACES() { return $(0), DO_LOOP(SPACE); }
