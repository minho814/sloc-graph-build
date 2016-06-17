// http://nodejs.org/api.html#_child_processes
var async = require('async');

var exec = require('child_process').exec;
var child;
var mainBranch = "";

module.exports = function(req, res){

	var dir = "/Users/mhbae/Desktop/automated-versioning-tool/"
	var git = "git --git-dir " + dir + ".git";

	exec(git + " branch | grep \"* \" | tail -c+3", function(error, stdout, stderr) {
		if (error) {
			console.error('git branch error: ' + error);
		}

		mainBranch = stdout;
		getTagList();
	});
	

	// Get the list of tags in the current git repo
	function getTagList() {
		exec(git + " tag", function (error, stdout, stderr) {

			if (error) {
				console.error('git tag error: ' + error);
			}
			
			// Parse the result into an array
			var tagList = stdout.split("\n");
		    tagList.pop();
			var result = [];

			// Now use cloc with the list of tags
			getClocResult(tagList, result);
		});
	}



	function getClocResult(tagList, result) {

		// Run through each tag given synchronously 
		async.eachSeries(tagList, function (tag, callback) {

			// git checkout each tag
	    	child = exec(git + " checkout " + tag, function(err, stdo, stde) {

	    		// count lines of code in all the git tracked files
				child = exec("cloc --json $("+ git + " ls-files)", function (error, stdout, stderr) {
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
			child = exec(git + " checkout " + mainBranch, function(error, stdout, stderr) {
				if (error) {
					console.error('return checkout error: ' + error);
				}
				res.send(result);
			});
		});
	}
}