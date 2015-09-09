var Generator = require('jison').Generator;

var grammar = {
    'lex': {
        'rules': []
    },
    'bnf': {}
};


var simple_tokens = [];


var UPREFIX = '++ -- + - ! ~ * &'.split(' ');
var USUFFIX = '++ -- ( [ . ->'.split(' ');
[].push.apply(simple_tokens, UPREFIX);
[].push.apply(simple_tokens, USUFFIX);


var operator_prec = [
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
    'USUFFIX',
    '::'
];

operator_prec.forEach(function (v, i) {
    if (['UPREFIX', 'USUFFIX'].indexOf(v) !== -1)
        return;
    operator_prec[i] = v.split(' ');
    [].push.apply(simple_tokens, operator_prec[i]);
});


simple_tokens.push(':', ')', ']', '{', '}');

var used_simple_tokens = {};
simple_tokens.forEach(function (v) {
    if (used_simple_tokens[v]) return;
    used_simple_tokens[v] = true;
    grammar.lex.rules.push([
        '"' + v + '"', 'return "' + v + '";'
    ]);
});

grammar.lex.rules.push(['\\s+']);
grammar.lex.rules.push(['\\"(\\\\.|[^\\\\"])*\\"', 'return "STRING";']);
grammar.lex.rules.push(["\\'(\\\\.|[^\\\\'])*\\'", 'return "STRING";']);
grammar.lex.rules.push(['[0-9]+("."[0-9]*)?([eE][0-9]+)?\\b', 'return "NUMBER";']);
grammar.lex.rules.push(['"."[0-9]+([eE][0-9]+)?\\b', 'return "NUMBER";']);
grammar.lex.rules.push(['"0x"[0-9A-Fa-f]+\\b', 'return "NUMBER";']);
grammar.lex.rules.push(['[A-Za-z_][0-9A-Za-z_]*', 'return "IDENTIFIER";']);
grammar.lex.rules.push(['<<EOF>>', 'return "EOF";']);

grammar.start = 'start';
grammar.bnf.start = [['statements EOF', 'return $1;']];

exports.output = function () {
    return 'TODO';
};
