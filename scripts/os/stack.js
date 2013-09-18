/* ------------
   Stack.js
   
   A simple Stack which is really just a dressed-up JavaScript Array.
   
   ------------ */
   
function Stack()
{
    // Properties
    this.stack = new Array();

    // Methods
    this.getSize = function() {
        return this.stack.length;    
    };

    this.isEmpty = function(){
        return (this.stack.length == 0);    
    };

    this.push = function(element) {
        this.stack.push(element);        
    };
    
    this.pop = function() {
        var retVal = null;
        
		if (this.stack.length > 0) {
            retVal = this.stack.pop();
        }
		
        return retVal;
    };
    
	this.peek = function() {
		var retVal = null;
		
		if (this.stack.length > 0) {
			retVal = this.stack[stack.length-1];
		}
		
		return retVal;
	};
	
    this.toString = function() {
        var retVal = "";
        
		for (var i in this.stack) {
            retVal += "[" + this.stack[i] + "] ";
        }
		
        return retVal;
    };
}

function HistoryList {
	
	// a data structure for storing commands
	this.cmdList = new Array();
	
	// an index to the current command
	this.currentPtr = -1;
	this.frontPtr = -1;
	this.rearPtr = -1;
	
	this.addCmd = function(cmd) {
		// check if the command to be added is the same as the last command.
		//   There is no reason to have the same command listed twice in a row.
		if (this.cmdList[this.cmdList.length-1] != cmd) {
			this.cmdList.push(cmd);
			frontPtr = this.cmdList.length-1;
		}
	}
	
	this.searchUp = function() {
		// Check if there are any commands in the history.
		if (this.cmdList.length == 0) {
			return;
		// Check if the user already reached the end of the command history.
		} else if (this.currentPtr == -1) {
			return;
		// Return the current command
		} else {
			var retVal = this.cmdList[currentPtr];
			currentPtr -= 1;
			return retVal;
		}
		
	}
	
	this.searchDown = function() {
		if (this.cmdList.length == 0) {
			return;
		} else if (this.currentPtr != -1) {
			return;
		} else {
			var retVal = this.cmdList[currentPtr];
			currentPtr += 1;
			return retVal;
		}
	}
}