'use strict';

exports.countWords = function(previous, next) {
    var kWhitespaceRegExp = /\S/,
        isPreviousEndsWithWhiteSpace = kWhitespaceRegExp.test(
            previous.substring(previous.length - 1)),
        isNextBeginsWithWhiteSpace = kWhitespaceRegExp.test(next[0]);

    if (!isNextBeginsWithWhiteSpace && !isPreviousEndsWithWhiteSpace) {
        return previous.split(/\s+/).length - 1;
    }

    return previous.split(/\s+/).length;
};
