#include <stdio.h>


int lex (FILE *input, FILE *output, FILE *err) {
    int c;
    int prior;
    int quote;
    int line = 1, col = 0;
    int start_line, start_col;
    #define error(msg) { \
        fprintf(err, "%i:%i: %s", line, col, (msg)); \
        return 1; \
    }
    #define token(type) { \
        fprintf(output, "%i:%i:%s:", start_line, start_col, (type)); \
    }
    #define finish() { \
        out('\n'); \
        goto lbl_start; \
    }
    #define ws (c == '\t' || c == '\n' || c == ' ' || c == EOF)
    #define al_ \
        (('A' <= c && c <= 'Z') || ('a' <= c && c <= 'z') || c == '_')
    #define num ('0' <= c && c <= '9')
    #define next() { \
        c = fgetc(input); \
        c == '\n' ? (++line, col=0) : ++col; \
        if (c == '\r') c = '\n'; \
        if ((c < ' ' || c > '~') && c != '\t' && c != '\n' && c != EOF) \
            error("invalid character"); \
    }
    #define next_q() { \
        next(); \
        if (c == EOF) { \
            error("unexpected EOF"); \
        } else if (c == '\n') { \
            error("unexpected newline"); \
        } \
    }
    #define out(ch) {fputc((ch), output);}

    next();
    lbl_start:
        if (c == EOF) {
            return 0;
        }
        if (ws) {
            next();
            goto lbl_start;
        }
        start_line = line; start_col = col;
        if (c == '"' || c == '\'') {
            goto lbl_string_start;
        } else if ('0' <= c && c <= '9') {
            goto lbl_num_start;
        } else if (al_) {
            goto lbl_identifier_start;
        } else if (
            ('\'' < c && c <= '/') || (':' <= c && c <= '?') ||
            c == '!' || c == '%' || c == '&' ||
            c == '[' || c == ']' || c == '^' ||
            c == '{' || c == '|' || c == '}' || c == '~'
        ) {
            goto lbl_maybe_operator_start;
        } else {
            error("invalid start of token");
        }

    lbl_multiline_comment_start:
        next();
        if (c == '*')
            goto lbl_multiline_comment_end;
        goto lbl_multiline_comment_start;
    lbl_multiline_comment_end:
        next();
        if (c == '/') {
            next();
            goto lbl_start;
        } else if (c == '*') {
            goto lbl_multiline_comment_end;
        }
        goto lbl_multiline_comment_start;

    lbl_maybe_operator_start:
        prior = c;
        next();
        switch (prior) {
            case '.':
                if (num) {
                    token("number");
                    out('.');
                    out(c);
                    goto lbl_num;
                }
                break;
            case '/':
                if (c == '/') {
                    do { next(); } while (c != '\n');
                    goto lbl_start;
                } else if (c == '*') {
                    goto lbl_multiline_comment_start;
                } else if (c != '=') {
                    break;
                }
            case '&': case '<': case '>': case '|':
                if (prior == c) {
                    token("operator");
                    out(prior);
                    prior = c;
                    next();
                    out(prior);
                    if (c == '=') {
                        out(c);
                        next();
                    }
                    finish();
                }
            case '+': case '-': case '=': case '^':
                if (prior == c) {
                    token("operator");
                    out(prior);
                    out(c);
                    next();
                    finish();
                }
            case '%': case '*':
                if (c == '=') {
                    token("operator");
                    out(prior);
                    out(c);
                    next();
                    finish();
                }
                break;
        }
        token("operator");
        out(prior);
        finish();

    lbl_identifier_start:
        token("identifier");
        out(c);
    lbl_identifier:
        next();
        if (!al_ && !num) finish();
        out(c);
        goto lbl_identifier;

    lbl_num_start:
        token("number");
        out(c);
    lbl_num:
        next();
        if (!al_ && !num && c != '.') finish();
        out(c);
        goto lbl_num;

    lbl_string_start:
        quote = c;
        token("string");
        out(c);
    lbl_string:
        next_q();
        if (c == '\\') {
            out(c);
            next_q();
            out(c);
        } else if (c == quote) {
            out(c);
            next();
            finish();
        } else {
            out(c);
        }
        goto lbl_string;

    #undef out
    #undef next_q
    #undef next
    #undef num
    #undef al_
    #undef ws
    #undef finish
    #undef token
    #undef error
}


int main (int argc, char **argv) {
    (void) argc;
    (void) argv;

    return lex(stdin, stdout, stderr);
}
