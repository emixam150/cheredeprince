//The type of a token
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Text"] = 0] = "Text";
    TokenType[TokenType["StartTag"] = 1] = "StartTag";
    TokenType[TokenType["EndTag"] = 2] = "EndTag";
})(TokenType || (TokenType = {}));
//Represents a token
var Token = (function () {
    function Token(tokenType, content, tagAttributes, tagStr) {
        this.tokenType = tokenType;
        this.content = content;
        this.tagAttributes = tagAttributes;
        this.tagStr = tagStr;
    }
    //String representation of the token
    Token.prototype.toString = function () {
        return this.content + " (" + TokenType[this.tokenType] + ")";
    };
    //Check for equality
    Token.prototype.equals = function (token) {
        return this.tokenType == token.tokenType && this.content == token.content;
    };
    return Token;
})();
//Creates a new text token
function textToken(content) {
    return new Token(0 /* Text */, content);
}
//var attrNameChars = "[a-zA-Z0-9\\.\\-_:;/]";
//var attrNameChars = "\\w";
//var attrValueChars = attrNameChars;
var attrNameChars = "[a-zA-Z0-9.\\-_:;/]";
var attrValueChars = "[a-zA-Z0-9/\\\-_.!?~*'():@&=+,$]";
//Creates a new tag token
function tagToken(match) {
    if (match[1] == undefined) {
        var tagName = match[2];
        var attributes = new Array();
        var attrPattern = new RegExp("(" + attrNameChars + "+)?=\"(" + attrValueChars + "*)\"", "g");
        var attrStr = match[0].substr(1 + tagName.length, match[0].length - 2 - tagName.length);
        var attrMatch;
        while (attrMatch = attrPattern.exec(attrStr)) {
            if (attrMatch[1] == undefined) {
                attributes[tagName] = attrMatch[2];
            }
            else {
                attributes[attrMatch[1]] = attrMatch[2];
            }
        }
        return new Token(1 /* StartTag */, tagName, attributes, match[0]);
    }
    else {
        return new Token(2 /* EndTag */, match[1].substr(1, match[1].length - 1));
    }
}
//Converts the given token to a text token
function asTextToken(token) {
    if (token.tokenType == 1 /* StartTag */) {
        token.content = token.tagStr;
        token.tokenType = 0 /* Text */;
    }
    if (token.tokenType == 2 /* EndTag */) {
        token.content = "[/" + token.content + "]";
        token.tokenType = 0 /* Text */;
    }
}
//Represents a tokenizer
var Tokenizer = (function () {
    //Creates a new tokenizer with the given tags
    function Tokenizer(bbTags) {
        this.bbTags = bbTags;
    }
    //Tokenizes the given string
    Tokenizer.prototype.tokenizeString = function (str) {
        var tokens = this.getTokens(str);
        var newTokens = new Array();
        var noNesting = false;
        var noNestingTag = "";
        var noNestedTagContent = "";
        for (var i in tokens) {
            var currentToken = tokens[i];
            var bbTag = this.bbTags[currentToken.content];
            var addTag = true;
            //Replace invalid tags with text
            if (bbTag === undefined && !noNesting) {
                asTextToken(currentToken);
            }
            else {
                //Check if current tag doesn't support nesting
                if (noNesting) {
                    if (currentToken.tokenType == 2 /* EndTag */ && currentToken.content == noNestingTag) {
                        noNesting = false;
                        newTokens.push(textToken(noNestedTagContent));
                    }
                    else {
                        asTextToken(currentToken);
                        noNestedTagContent += currentToken.content;
                        addTag = false;
                    }
                }
                else {
                    if (bbTag.noNesting && currentToken.tokenType == 1 /* StartTag */) {
                        noNesting = true;
                        noNestingTag = currentToken.content;
                        noNestedTagContent = "";
                    }
                }
            }
            if (addTag) {
                newTokens.push(currentToken);
            }
        }
        return newTokens;
    };
    //Gets the tokens from the given string
    Tokenizer.prototype.getTokens = function (str) {
        var pattern = "\\[(\/\\w*)\\]|\\[(\\w*)+(=\"" + attrValueChars + "*\")?( " + attrNameChars + "+=\"" + attrValueChars + "*\")*\\]";
        var tagPattern = new RegExp(pattern, "g");
        var tokens = new Array();
        var match;
        var lastIndex = 0;
        while (match = tagPattern.exec(str)) {
            var delta = match.index - lastIndex;
            if (delta > 0) {
                tokens.push(textToken(str.substr(lastIndex, delta)));
            }
            tokens.push(tagToken(match));
            lastIndex = tagPattern.lastIndex;
        }
        var delta = str.length - lastIndex;
        if (delta > 0) {
            tokens.push(textToken(str.substr(lastIndex, delta)));
        }
        return tokens;
    };
    return Tokenizer;
})();

module.exports = Tokenizer;
