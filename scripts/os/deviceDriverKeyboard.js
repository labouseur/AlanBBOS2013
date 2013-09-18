/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 122)) )   // a..z
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }
    else if ( ((keyCode >= 48) && (keyCode <= 57)) ||   // digits
			   (keyCode == 32)                     ||   // space
               (keyCode == 13)                     ||   // enter
			   (keyCode == 8) )                         // backspace
    {
        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr); 
    }
	else if (keyCode == 38 || keyCode == 40) {
		_KernelInputQueue.enqueue(keyCode);
	}
	// The mozilla keycodes for punctuation characters do not map directly to ASCII characters.
	// Therefore, we must translate the key codes corresponding to punctuation characters.
	// For additional details regarding keypress events see http://unixpapa.com/js/key.html
	else if ((keyCode == 59) && isShifted)  // colon
		_KernelInputQueue.enqueue(':');
	else if (keyCode == 59)				    // semicolon
		_KernelInputQueue.enqueue(';');
	else if ((keyCode == 173) && isShifted) // underscore
		_KernelInputQueue.enqueue('_');		
	else if (keyCode == 173)				// dash
		_KernelInputQueue.enqueue('-');	
	else if ((keyCode == 188) && isShifted) // less than
		_KernelInputQueue.enqueue('<');
	else if (keyCode == 188)				// comma
		_KernelInputQueue.enqueue(',');	 	
	else if ((keyCode == 190) && isShifted) // greater than
		_KernelInputQueue.enqueue('>');	
	else if (keyCode == 190)				// period
		_KernelInputQueue.enqueue('.');
	else if ((keyCode == 191) && isShifted)	// question mark
		_KernelInputQueue.enqueue('?');
	else if (keyCode == 191)				// forward slash
		_KernelInputQueue.enqueue('/');
	else if ((keyCode == 192) && isShifted)	// tilda
		_KernelInputQueue.enqueue('~');
	else if (keyCode == 192)				// backtick
		_KernelInputQueue.enqueue('`');		
	else if ((keyCode == 219) && isShifted)	// open curly brace
		_KernelInputQueue.enqueue('{');
	else if (keyCode == 219)				// open bracket
		_KernelInputQueue.enqueue('[');
	else if ((keyCode == 220) && isShifted)	// vertical bar
		_KernelInputQueue.enqueue('|');
	else if (keyCode == 220)				// backslash
		_KernelInputQueue.enqueue('\\');	
	else if ((keyCode == 221) && isShifted)	// close curly brace
		_KernelInputQueue.enqueue('}');
	else if (keyCode == 221)				// close bracket
		_KernelInputQueue.enqueue(']');
	else if ((keyCode == 222) && isShifted)	// double-quote
		_KernelInputQueue.enqueue('"');
	else if (keyCode == 222)				// single-quote
		_KernelInputQueue.enqueue("'");
}
