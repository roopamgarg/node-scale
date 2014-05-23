'use strict';

var index = 0;

exports.getNextChunk = function(chunks) {return chunks[(index++) % chunks.length];};
