var Generator = require('jison').Generator;

var grammar = {
    'lex': {
        'rules': []
    },
    'operators': [],
    'bnf': {}
};


var simple_tokens = [];


var UPREFIX = '++ -- + - ! ~'.split(' ');
var USUFFIX = '++ -- ( [ .'.split(' ');
[].push.apply(simple_tokens, UPREFIX);
[].push.apply(simple_tokens, USUFFIX);


var operator_prec = [ // Convenient representation of operators and their precedence.
    ',',
    '? = += -= *= /= %= <<= >>= &= ^= |=',
    '||',
    '&&',
    '|',
    '^',
    '&',
    '== !=',
    '< <= > >=',
    '<< >>',
    '+ -',
    '* / %',
    '.* ->*',
    'UPREFIX',
    'USUFFIX'
];

var binary_operators = (', = += -= *= /= %= <<= >>= &= ^= |= ' +
    '|| && | ^ & == != < <= > >= << >> + - * / %').split(' ');

operator_prec.forEach(function (v, i) {
    // Split up operator precedence rules.
    if (['UPREFIX', 'USUFFIX'].indexOf(v) !== -1)
        return;
    operator_prec[i] = v.split(' ');
    [].push.apply(simple_tokens, operator_prec[i]);
});

operator_prec.forEach(function (v) {
    // Inform grammar of operator precedence and association rules.
    var prec_rule = ['left'];
    if (['UPREFIX', 'USUFFIX'].indexOf(v) !== -1)
        prec_rule.push(v);
    else
        [].push.apply(prec_rule, v);
    grammar.operators.push(prec_rule);
});

// These tokens do not have/need precedence rules.
simple_tokens.push(':', ')', ']', '{', '}', '=>');

var used_simple_tokens = {};
simple_tokens.forEach(function (v) {
    // Create lexer rules for each token.
    if (used_simple_tokens[v]) return;
    used_simple_tokens[v] = true;
    grammar.lex.rules.push([
        '"' + v + '"', 'return "' + v + '";'
    ]);
});

// Create lexer rules for literals.
grammar.lex.rules.push(['\\s+']);
grammar.lex.rules.push(['"/*"(.|\\n|\\r)*?"*/"']);
grammar.lex.rules.push(['"//".*']);
grammar.lex.rules.push(['\\"(\\\\.|[^\\\\"])*\\"', 'return "STRING";']);
grammar.lex.rules.push(["\\'(\\\\.|[^\\\\'])*\\'", 'return "STRING";']);
grammar.lex.rules.push(['[0-9]+("."[0-9]*)?([eE][0-9]+)?\\b', 'return "NUMBER";']);
grammar.lex.rules.push(['"."[0-9]+([eE][0-9]+)?\\b', 'return "NUMBER";']);
grammar.lex.rules.push(['"0x"[0-9A-Fa-f]+\\b', 'return "NUMBER";']);
grammar.lex.rules.push(['[A-Za-z_][0-9A-Za-z_]*', 'return "IDENTIFIER";']);
grammar.lex.rules.push(['<<EOF>>', 'return "EOF";']);

grammar.start = 'start';
grammar.bnf.start = [
    ['statements EOF', 'return $1;']
];
grammar.bnf.statements = [
    ['statement', '$$ = { statements: [$1] };'],
    ['statements statement', '$$ = $1; $$.statements.push($2);']
];
grammar.bnf.statement = [
    ['expression ";"', '$$ = $1;']
];
grammar.bnf.identifier = [['IDENTIFIER', '$$ = { identifier: yytext };']];
grammar.bnf.expressions = [
    ['expression', '$$ = { expressions: [$1] };'],
    ['expressions "," expression', '$$ = $1; $$.expressions.push($3);']
];
grammar.bnf.expression = [
    ['"(" expression ")"', '$$ = $1;'],
    ['expression "?" expression ":" expression', '$$ = { ternary: [$1, $3, $5] };'],
    ['"{" "=>" arguments ";" statements "}"', '$$ = { lambda: [$3, $5] };'],
    ['"{" statements "}"', '$$ = { lambda: [{ arguments: [] }, $2] };'],
    ['STRING', '$$ = { string: yytext };'],
    ['NUMBER', '$$ = { number: yytext };'],
    ['IDENTIFIER', '$$ = { identifier: yytext };'],
    ['expression "(" expressions ")"', '$$ = { call: [$1, $3] };'],
    ['expression "[" expression "]"', '$$ = { index: [$1, $3] };'],
    ['expression "." identifier', '$$ = { member: [$1, $3] };']
];
grammar.bnf.arguments = [
    ['identifier', '$$ = { arguments: [$1] };'],
    ['arguments "," identifier', '$$ = $1; $$.arguments.push($3);']
];

UPREFIX.forEach(function (v) {
    grammar.bnf.expression.push([
        '"' + v + '" expression %prec UPREFIX',
        '$$ = { uprefix: ["' + v + '", $2] };'
    ]);
});

USUFFIX.forEach(function (v) {
    if (v === '.')
        return;
    grammar.bnf.expression.push([
        'expression "' + v + '" %prec USUFFIX',
        '$$ = { usuffix: ["' + v + '", $1] };'
    ]);
});

binary_operators.forEach(function (v) {
    grammar.bnf.expression.push([
        'expression "' + v + '" expression',
        '$$ = { binary: ["' + v + '", $1, $3] };'
    ]);
});

exports.output = function () {
    return 'TODO';
};
