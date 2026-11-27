export type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "builtin"
  | "function"
  | "number"
  | "decorator"
  | "property"
  | "operator"
  | "variable"
  | "plain";

export interface HighlightToken {
  type: TokenType;
  value: string;
}

const PYTHON_KEYWORDS = new Set([
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "match",
  "case",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
]);

const PYTHON_BUILTINS = new Set([
  "True",
  "False",
  "None",
  "self",
  "cls",
  "print",
  "input",
  "len",
  "range",
  "int",
  "float",
  "str",
  "bool",
  "list",
  "dict",
  "set",
  "tuple",
  "type",
  "isinstance",
  "enumerate",
  "zip",
  "map",
  "filter",
  "sum",
  "min",
  "max",
  "sorted",
  "abs",
  "round",
  "open",
  "Exception",
  "ValueError",
  "TypeError",
  "KeyError",
  "IndexError",
]);

const JS_KEYWORDS = new Set([
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "let",
  "new",
  "of",
  "return",
  "static",
  "super",
  "switch",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "yield",
]);

const JS_BUILTINS = new Set([
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
  "this",
  "console",
  "Math",
  "Number",
  "String",
  "Boolean",
  "Array",
  "Object",
  "Set",
  "Map",
  "Promise",
  "JSON",
  "Date",
  "Error",
  "RegExp",
  "parseInt",
  "parseFloat",
  "setTimeout",
  "fetch",
]);

const PYTHON_PATTERN =
  /(#[^\n]*)|((?:[fFrRbBuU]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(@[A-Za-z_]\w*)|(\b0[xXbBoO][\da-fA-F_]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\.[A-Za-z_]\w*)|([A-Za-z_]\w*)|(->|==|!=|<=|>=|\*\*|\/\/|[=+\-*/%<>!&|^~?:;,.()[\]{}])/g;

const JS_PATTERN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b0[xXbBoO][\da-fA-F_]+\b|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\.[A-Za-z_$][\w$]*)|([A-Za-z_$][\w$]*)|(=>|===|!==|==|!=|<=|>=|\*\*|&&|\|\||\?\?|\.\.\.|[=+\-*/%<>!&|^~?:;,.()[\]{}])/g;

export const TOKEN_CLASSES: Record<TokenType, string> = {
  comment: "text-[#6d8099] italic",
  string: "text-[#e5b25d]",
  keyword: "text-[#69d2de]",
  builtin: "text-[#82b9f7]",
  function: "text-[#f2c883]",
  number: "text-[#56c99b]",
  decorator: "text-[#e59872]",
  property: "text-[#a9d4e6]",
  operator: "text-[#8ba0b8]",
  variable: "text-[#e6edf5]",
  plain: "text-[#d6dde7]",
};

export function tokenizeCode(
  code: string,
  language: "python" | "javascript",
): HighlightToken[] {
  const isPython = language === "python";
  const keywords = isPython ? PYTHON_KEYWORDS : JS_KEYWORDS;
  const builtins = isPython ? PYTHON_BUILTINS : JS_BUILTINS;
  const pattern = new RegExp(
    isPython ? PYTHON_PATTERN.source : JS_PATTERN.source,
    "g",
  );

  const tokens: HighlightToken[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      tokens.push({ type: "plain", value: code.slice(lastIndex, start) });
    }

    const full = match[0];
    let type: TokenType = "plain";

    if (isPython) {
      const [, comment, str, decorator, num, prop, ident, op] = match;
      if (comment) type = "comment";
      else if (str) type = "string";
      else if (decorator) type = "decorator";
      else if (num) type = "number";
      else if (prop) {
        tokens.push({ type: "operator", value: "." });
        const propName = prop.slice(1);
        const nextChar = code[start + full.length];
        tokens.push({
          type: nextChar === "(" ? "function" : "property",
          value: propName,
        });
        lastIndex = start + full.length;
        continue;
      } else if (ident) {
        const nextChar = code[start + full.length];
        if (keywords.has(ident)) type = "keyword";
        else if (builtins.has(ident)) type = "builtin";
        else if (nextChar === "(") type = "function";
        else type = "variable";
      } else if (op) type = "operator";
    } else {
      const [, comment, str, num, prop, ident, op] = match;
      if (comment) type = "comment";
      else if (str) type = "string";
      else if (num) type = "number";
      else if (prop) {
        tokens.push({ type: "operator", value: "." });
        const propName = prop.slice(1);
        const nextChar = code[start + full.length];
        tokens.push({
          type: nextChar === "(" ? "function" : "property",
          value: propName,
        });
        lastIndex = start + full.length;
        continue;
      } else if (ident) {
        const nextChar = code[start + full.length];
        if (keywords.has(ident)) type = "keyword";
        else if (builtins.has(ident)) type = "builtin";
        else if (nextChar === "(") type = "function";
        else type = "variable";
      } else if (op) type = "operator";
    }

    tokens.push({ type, value: full });
    lastIndex = start + full.length;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "plain", value: code.slice(lastIndex) });
  }

  return tokens;
}
