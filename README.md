# NOTE
Has not been updated to final release of angular2.

# Source Code Graph Builder

This tool uses a git repository and builds a graph of its source lines of code
using the git tags saved. 

It uses [cloc](https://github.com/AlDanial/cloc) to count the lines of code
and [ng2-charts](https://github.com/valor-software/ng2-charts/) to display the
results on a chart. 

To use:
Go to countLines.js and edit the dir variable on line 11 to the filepath of 
your git repository. Run the program with node app and open up localhost:4000
on your local browser.

### Important Notes
* Make sure your git repository is clean, with no changes to add. 
* Git repositories with many tags and many lines of code will take a long time
  to count.
* When choosing which languages to count, make sure they have the official 
  spelling (e.g. JavaScript, not Javascript). 
* Separate the languages to count with a comma and a space 
  (e.g. JavaScript, HTML, CSS)
  
### TODO
* Refactor code
* Make it prettier
