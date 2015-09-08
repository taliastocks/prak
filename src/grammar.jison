/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%
\s+                             /* skip whitespace */
\"(\\.|[^\\"])*\"                   return 'STRING';
\'(\\.|[^\\'])*\'                   return 'STRING';
[0-9]+("."[0-9]*)?([eE][0-9]+)?\b   return 'NUMBER';
"."[0-9]+([eE][0-9]+)?\b            return 'NUMBER';
"0x"[0-9A-Fa-f]+                    return 'NUMBER';
[A-Za-z_][0-9A-Za-z_]*              return 'IDENTIFIER';
";"                                 return ';';
","                                 return ',';
"?"                                 return '?';
":"                                 return ':';
"="                                 return '=';
"+="                                return '+=';
"-="                                return '-=';
"*="                                return '*=';
"/="                                return '/=';
"%="                                return '%=';
"<<="                               return '<<=';
">>="                               return '>>=';
"|="                                return '|=';
"^="                                return '^=';
"&="                                return '&=';
"||"                                return '||';
"&&"                                return '&&';
"|"                                 return '|';
"^"                                 return '^';
"&"                                 return '&';
"=="                                return '==';
"!="                                return '!=';
"<"                                 return '<';
"<="                                return '<=';
">"                                 return '>';
">="                                return '>=';
"<<"                                return '<<';
">>"                                return '>>';
"+"                                 return '+';
"-"                                 return '-';
"*"                                 return '*';
"/"                                 return '/';
"%"                                 return '%';
"!"                                 return '!';
"~"                                 return '~';
"++"                                return '++';
"--"                                return '--';
"("                                 return '(';
"["                                 return '[';
"."                                 return '.';
"::"                                return '::';
<<EOF>>                             return 'EOF';

/lex

/* operator associations and precedence */
%left ','
%left '?' '=' '+=' '-=' '*=' '/=' '%=' '<<=' '>>=' '&=' '^=' '|='
%left '||' 'OR'
%left '&&' 'AND'
%left '|'
%left '^'
%left '&'
%left '==' '!='
%left '<' '<=' '>' '>='
%left '<<' '>>'
%left '+' '-'
%left '*' '/' '%'
%left '!' '~' UPREFIX
%left '(' '[' '.' UPOSTFIX
%left '::'

%start start

%% /* language grammar */

start
    : statements EOF
        { return $1; }
    ;

statements
    : statement
        {
            $$ = {
                statements: [$1]
            };
        }
    | statements statement
        {
            $$ = $1;
            $$.statements.push($2);
        }
    ;

statement
    : expression ';'
        {
            $$ = $1;
        }
    ;

token_expr
    : STRING
        {
            $$ = {
                literal: {
                    type: 'string',
                    value: $1
                }
            };
        }
    | NUMBER
        {
            $$ = {
                literal: {
                    type: 'number',
                    value: $1
                }
            };
        }
    | IDENTIFIER
        {
            $$ = {
                identifier: $1
            };
        }
    ;

expression
    : /* TODO */
    ;
