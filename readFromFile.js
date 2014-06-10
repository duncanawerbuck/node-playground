var fs = require('fs');

var debug = false;

var arrayOfLinesToProcess = [];

// local array (not text file)
// arrayOfLinesToProcess = ['one three ninety-nine mud slacks', 'xxxxxxxxxxxxxxxx monkey nuts'];

getArrayOfLinesOfTextFromFile('info.txt', function (result) {
		        processLines(result, function() {
		          console.log('Done.');
		        });
});

function getArrayOfLinesOfTextFromFile (filename, next) {
// get lines array from text file instead of local array
	fs.open(
	  filename, 'r',
	  function(err, handle) {
	    var buf = new Buffer(1000000);
	    file = handle;

	    fs.read(
	      handle, buf, 0, 1000000, null,
	      function(err, length) {
	      	if (err) { 
	      		console.log('Aw, snap! Something went wrong. Have you got an "info.txt" file in the same folder as this .js file? Well if you don\'t, you should. And if you don\'t, you should feel bad.');
	      	 } else {

		        var arrayOfLines = buf.toString('utf8', 0, length).split('\n');
				fs.close(handle, function() {});

		        next(arrayOfLines);
			}
	    }
		)
	});
}

function processLines(arrayOfLines, next) {

  if (arrayOfLines.length > 0) {

    var line = arrayOfLines[0];

    var arrayOfWordsInLine = line.split(' ');

    if(debug) { console.log('Lines remaining to be processed: ' + (arrayOfLines.length)); }

    var thisLineLongestWord = '';
    // handle current line
    processWordsInLine(arrayOfWordsInLine, 0, '', function(longestWordFound) {
      // all words for the current line are now processed.
      console.log('Longest word: ' + longestWordFound);
      arrayOfLines.shift(arrayOfLines[0]);

      processLines(arrayOfLines, function() { });
    });

  };

  next();
}

function processWordsInLine(arrayOfWords, wordIndex, longestWord, next) {

  var newLongestWord = longestWord; // might be overwritten below...

  if (arrayOfWords.length > 0) {
  	var iterationNumber = (wordIndex + 1);

  	if(debug) { console.log('Word: %s, words left: %s, longest word so far: %s', wordIndex+1, arrayOfWords.length, (longestWord || '(not yet determined)')); }

    // is the current word longer than the longest known word thus far? If so, it's the longest word (pass it to the next call to processWordsInLine)

    
    if (arrayOfWords[0].length > longestWord.length) {
      newLongestWord = arrayOfWords[0];
    }

    arrayOfWords.shift(arrayOfWords[0]);

    processWordsInLine(arrayOfWords, wordIndex + 1, newLongestWord, next);
  	

  } else {
	next(longestWord);
  }

}
