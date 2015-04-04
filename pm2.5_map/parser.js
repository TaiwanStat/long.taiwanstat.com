var fs = require('fs');
var path = require('path');
var async = require('async');
var fileSave = require('file-save');
var fs = require('fs-extra');

var xls = require('xlsjs');
var _ = require('lodash');

var folders = fs.readdirSync('../pm2.5/data/103_HOUR_00_20150324');

async.eachSeries(folders, function(root, cb) {
	var files = fs.readdirSync('../pm2.5/data/103_HOUR_00_20150324/' + root);
	files.pop();

	async.eachSeries(files, function(file, cbb) {
		
		var workbook = xls.readFile('../pm2.5/data/103_HOUR_00_20150324/' + root + '/' + file);
		var vals = workbook.Sheets['Sheet1'];

		var json = xls.utils.sheet_to_json(vals);
		
		console.log(__dirname + '/data/103_HOUR_00_20150324/' + root + '/' + path.basename(file, '.xls') + '.json');

		fs.outputJsonSync(__dirname + '/data/103_HOUR_00_20150324/' + root + '/' + path.basename(file, '.xls') + '.json', json);

		cbb();

	}, function(err) {
		if(err)
			console.error(err);
		else
			cb();
	})

}, function(err, result) {
	if(err)
		console.error(err);
	else
		console.log(result)
})

