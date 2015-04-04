var fs = require('fs');
var path = require('path');
var async = require('async');
var fs = require('fs-extra');

var _ = require('lodash');


var folders = fs.readdirSync('./data/103_HOUR_00_20150324');

async.eachSeries(folders, function(root, cb) {
	var files = fs.readdirSync('./data/103_HOUR_00_20150324/' + root);
	files.pop();

	var fs_path = [];
	var fs_name = [];

	async.eachSeries(files, function(file, cbb) {
		
		var json = fs.readJsonSync('./data/103_HOUR_00_20150324/' + root + '/' + file);
		
		var filter = _.compact(_.map(json, function(val) {
			if(val !== null){
				if(val["測項"] === 'PM2.5'){
					var sum = 0;
					var day = 24;
					_.map(val, function(n, i) {
						if(i !== '日期' && i !== '測站' && i !== '測項') {
							var num = +n || 0;
							sum = num + sum;
							if(num === 0)
								day = day - 1;
						}
					})

					val.sum = sum / day;
					return val;
				}
			}
					
		}))


		fs.outputJsonSync(__dirname + '/filter/103_HOUR_00_20150324/' + root + '/' + file, filter);
		fs_path.push('./filter/103_HOUR_00_20150324/' + root + '/' + file);
		fs_name.push(file.slice(0, file.indexOf('_')))

		cbb();

	}, function(err) {
		if(err)
			console.error(err);
		else
			cb();

		fs.writeFileSync(__dirname + '/filter/103_HOUR_00_20150324/' + root + '/fs_path.json', JSON.stringify(fs_path, 2))
		fs.writeFileSync(__dirname + '/filter/103_HOUR_00_20150324/' + root + '/fs_name.json', JSON.stringify(fs_name))
	})

}, function(err, result) {
	if(err)
		console.error(err);
	else
		console.log(result)
})

