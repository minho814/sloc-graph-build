// http://nodejs.org/api.html#_child_processes
var async = require('async');

var exec = require('child_process').exec;
var child;

var moment = require('moment');

module.exports = function(req, res){

	var dir = ".";
	var logTags = "log --tags --simplify-by-decoration --pretty=\"format:%ci %d\" | grep \"tag:\" | sed 's/^\\(.\\{19\\}\\).*tag:\\(.*,\\).*/\\1\\2/' | sed 's/^\\(.\\{19\\}\\).*tag:\\(.*)\\).*/\\1\\2/' | sed 's/.$//'";
	var result = [];
	var mainBranch = "";

	exec("cd " + dir + " && git branch | grep \"* \" | tail -c+3", function(error, stdout, stderr) {
		if (error) {
			console.error('git branch error: ' + error);
		}

		mainBranch = stdout;
		getTagList();
	});
	

	// Get the list of tags in the current git repo
	function getTagList() {
		exec("cd " + dir + " && git " + logTags, function (error, stdout, stderr) {

			if (error) {
				console.error('git tag error: ' + error);
			}

			// Parse the result into an array
			var tempTagList = stdout.split("\n");
			tempTagList.pop();
			var tagList = [];

			var startDate = moment('0000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss');

			for (var i = tempTagList.length - 1; i >= 0; i--) {
				var endDate = moment(tempTagList[i], 'YYYY-MM-DD HH:mm:ss');
				var daysDiff = endDate.diff(startDate, 'days');
				if (daysDiff >= 7) {
					startDate = endDate;
					var tagName = tempTagList[i].substring(20);

					if (tagName == "-") {
						tagName = mainBranch;
					}

					tagList.push(tagName);
				}
			}

			// Now use cloc with the list of tags
			getClocResult(tagList);
		});
	}



	function getClocResult(tagList) {

		// Run through each tag given synchronously 
		async.eachSeries(tagList, function (tag, callback) {

			// git checkout each tag
	    	child = exec("cd " + dir + " && git checkout " + tag, function(err, stdo, stde) {
	    
	    		// count lines of code in all the git tracked files
				child = exec("cd " + dir + " && cloc --json $(git ls-files)", function (error, stdout, stderr) {
					if (error) {
						console.error('cloc error: ' + error);
					}

					// Delete all whitespace an new lines
					stdout = stdout.replace(/ /g,'');
					stdout = stdout.replace(/\n/g,'');

					// Save in a format to easily split later
					result = result + "SPLITMARK" + stdout + "SPLITMARK" + tag;
					callback(); // Move on to next commit
				});
	    	});
		},

		// Upon completion of running through all the tags
		function(err) {

			// Checkout the master branch and send back the result
			child = exec("cd " + dir + " && git checkout " + mainBranch, function(error, stdout, stderr) {
				if (error) {
					console.error('return checkout error: ' + error);
				}
				res.send(result);
			});
		});
	}
}