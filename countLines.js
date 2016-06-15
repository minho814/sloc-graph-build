// http://nodejs.org/api.html#_child_processes
var async = require('async');

var exec = require('child_process').exec;
var child;


module.exports = function(req, res){
	var count = 0;

	exec("git tag", function (error, stdout, stderr) {

		if (error) {
			console.error('exec error: ' + error);
		}

		var tagList = stdout.split("\n");
	    tagList.pop();
		var result = [];

		getClocResult(tagList, result);
	});

	function getClocResult(tagList, result) {

		async.eachSeries(tagList, function (tag, callback) {
	    	child = exec("git checkout " + tag, function(err, stdo, stde) {
				child = exec("cloc --json $(git ls-files)", function (error, stdout, stderr) {
					if (error) {
						console.error('exec error: ' + error);
					}
					stdout = stdout.replace(/ /g,'');
					stdout = stdout.replace(/\n/g,'');
					result = result + "SPLITMARK" + stdout;
					count++;
					callback();
				});
	    	});
		},

		function(err) {
			exec("git checkout master");
			res.send(result);
		});
	}
}