/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {

	// Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
	this.LineHeight = _DefaultFontSize + _FontHeightMargin;
    this.CurrentTheme = Themes[0];
	this.buffer = "";
	this.history = null;


    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
	   this.history = new HistoryList();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };
	
	/* Scroll the display the specified number of lines. */
	this.scrollDisplay = function(n=1) {
		// Calculate the vertical scroll amount.
		var scrollY = this.LineHeight * n;
		// Save the required portion of the display.
		var saved = _DrawingContext.getImageData(
				0, // x-coord of the origin
				scrollY, // y-coord of the origin
				500, // image width
				this.CurrentYPosition - scrollY // image height
		);
		// Clear the screen.
		this.clearScreen();
		// "Scroll" up by drawing the image at the top of the screen.
		_DrawingContext.putImageData(saved, 0, 0);
		// Place the cursor at the correct position.
		this.CurrentYPosition -= scrollY;
	};
	
	/* Clear user input from the console and buffer. */
	this.clearUserInput = function() {
		// erase the entire buffer and console
		// Calculate the width of the characters to be deleted.
		var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, this.buffer);
		// Move the "caret" back to the beginning of the prompt.
		this.CurrentXPosition = this.CurrentXPosition - offset;
		// Delete the characters from the console.
		_DrawingContext.clearRect(
				this.CurrentXPosition, // x-coord
				this.CurrentYPosition - this.CurrentFontSize, // y-coord
				offset, // width
				_DefaultFontSize + _FontHeightMargin // height
			);
		// Clear the command from the buffer
		this.buffer = "";
	};

    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
			   // ... store the command in the command history ...
				this.history.saveCommand(this.buffer);
			   // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
               // ... and reset our buffer.
               this.buffer = "";
           }
		   // Check to see if it is a backspace.
		   else if (chr == String.fromCharCode(8))
		   {
				// Check if there are any characters to backspace.
				if (this.buffer.length > 0)
				{
					// Save the last char before removing it from the buffer.
					var lastChar = this.buffer[this.buffer.length-1];
					// Remove the char from the buffer.
					this.buffer = this.buffer.substr(0, this.buffer.length-1);
					// Calculate the width of the character to be deleted.
					var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, lastChar);
					// Move the "caret" back one character.
					this.CurrentXPosition = this.CurrentXPosition - offset;
					// Delete the character from the console.
					_DrawingContext.clearRect(
							this.CurrentXPosition, // x-coord
							this.CurrentYPosition - this.CurrentFontSize, // y-coord
							offset, // width
							_DefaultFontSize + _FontHeightMargin // height
						);
				}
		   }
		   // Check if this is an up arrow
		   else if (chr == '38')
		   {
				this.clearUserInput();
				// Get the saved command from the history list.
				var cmd = this.history.searchUp();
				// write the current command to the console
				_StdIn.putText(cmd);
				// write the current command to the buffer
				this.buffer = cmd;
		   }
		   else if (chr == '40')
		   {
				this.clearUserInput();
				// Get the saved command from the history list.
				var cmd = this.history.searchDown();
				// write the current command to the console
				_StdIn.putText(cmd);
				// write the current command to the buffer
				this.buffer = cmd;
		   }
           // TODO: Write a case for Ctrl-C.
           else
           {
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
           // Draw the text at the current X and Y coordinates.
           _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
           // Move the current X position.
           var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };

    this.advanceLine = function() {
       
	   this.CurrentXPosition = 0;
       this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
	   
	   if (this.CurrentYPosition > 500) {
			this.scrollDisplay();
	   }
    };

	this.setTheme = function(theme) {

		_Canvas.style.backgroundColor = theme.background;
		_DrawingContext.strokeStyle = theme.text;

		this.CurrentTheme = theme;

		this.clearScreen();
		this.resetXY();

	};
}