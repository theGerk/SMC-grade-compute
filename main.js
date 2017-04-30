#! /usr/bin/nodejs
/* global countA, countB */

var fs = require("fs");
var path = require("path");
var stream = require("stream");
var count = 0;
var totalA = 0;
var totalB = 0;
var target = "..";

function parseGrade(txt) {
	var grade = txt.match(/\d+/g);
	return {a: grade[0], b: grade[1]};
}

function computation(file, index) {
	//do something
	var processor = new stream.Writable;
	var stringBits = [];
	processor._write = function (data, encoding, callback) {
		//This is called whenever we get data from the file.
		stringBits.push(data.toString());
	};
	var fstream = fs.createReadStream(file);
	fstream.on('end', function () {
		var txt = stringBits.join('');
		//Do processing on the whole file here.
		var totals = parseGrade(txt);
		totalA += totals.a * 1;
		totalB += totals.b * 1;
		count--;
		if (count === 0) {
			console.log(totalA + '/' + totalB);
		}
	});
	fstream.pipe(processor);
}

var loop = function (err, files, parentDir) {
	if (err) {
		//Not a valid directory.
		return;
	}
	files.forEach(function (file, index) {
		if (file === 'GRADE.txt') {
			count++;
			computation(parentDir + '/' + file, index);
		} else {
			//Might be a directory -- recursively loop over the directory
			fs.readdir(parentDir + '/' + file, function (err, files) {
				loop(err, files, parentDir + '/' + file);
			});
		}
	});
};

fs.readdir(target, function(err, files) {
	loop(err, files, target);
});
