'use strict';

function countWords(previous, next) {
    var kWhitespaceRegExp = /\S/,
        isPreviousEndsWithWhiteSpace = kWhitespaceRegExp.test(
            previous.substring(previous.length - 1)),
        isNextBeginsWithWhiteSpace = kWhitespaceRegExp.test(next[0]);

    if (!isNextBeginsWithWhiteSpace && !isPreviousEndsWithWhiteSpace) {
        return previous.split(/\s+/) - 1;
    }

    return previous.split(/\s+/);
}
