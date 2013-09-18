/* ------------
   Shell.js

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;

    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;

    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;

    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;

    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

	// date - displays the current date and time
	sc = new ShellCommand();
	sc.command = "date";
	sc.description = " - Displays the current date and time";
	sc.function = shellTime;
	this.commandList[this.commandList.length] = sc;

	// whereami - displays the user's current location
	sc = new ShellCommand();
	sc.command = "whereami";
	sc.description = " - Displays the user's current location.";
	sc.function = shellUserLocation;
	this.commandList[this.commandList.length] = sc;

	// theme - allows the user to change the color of the console elements
	sc = new ShellCommand();
	sc.command = "theme";
	sc.description = " - Sets the console theme."
	sc.function = shellChangeTheme;
	this.commandList[this.commandList.length] = sc;

	// load - validates the code in the user program input area
	sc = new ShellCommand();
	sc.command = "load";
	sc.description = " - Validates the user code in the program input area.";
	sc.function = shellValidateCode;
	this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    //
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately),
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help":
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on":
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }

                break;
            case "off":
                _Trace = false;
                _StdIn.putText("Trace OFF");
                break;
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellTime(args) {

		_StdIn.putText(new Date().toLocaleString());
}

var userLocations = [
			"Your Happy Place", "The Library", "Your Happy Place in the Library",
			"A Library in Your Happy Place", "Your Dorm", "At Aunt Marge's eating pie",
			"Your Aunt Bertha's", "Mordor", "In a Dream", "Mallowland", "...within a Dream.",
			"Bagend", "Smithy's Castle", "A Good Place", "Over There", "A Bad Place",
			"Right Here", "In Your Head", "Get out", "In a Burning Building",
			"Get out", "Now", "Gondor"
	];

function shellUserLocation() {
	// Generate an index into the locations array.
	var index = Math.floor((Math.random()*100)) % userLocations.length;
	// Output the users's location.
	_StdIn.putText("Your current location is: " + userLocations[index]);
}

function shellPrompt(args)
{
    if (args.length > 0) {
        _OsShell.promptStr = args[0];
    } else {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellChangeTheme(args) {

	// If the user provided no args then simply output the current theme.
	if (args.length == 0) {
		_StdIn.putText("The current theme is " + _Console.CurrentTheme.name + ".");
		_StdIn.advanceLine();
		_StdIn.putText("Type \"theme list\" for a list of available themes.");
	} else if (args.length == 1) {
		// Present the user with a list of available themes.
		if (args[0] == "list") {

			for (var i = 0; i < Themes.length; ++i) {
				_StdIn.putText("  " + Themes[i].name + " - " + Themes[i].description);
				_StdIn.advanceLine();
			}

		} else {

			var userTheme = args[0];
			// initialize the loop variables
			var found = false;
			var index = 0;
			// Loop until the theme is found or until there are no themes left to check.
			while (!found && (index < Themes.length)) {
				if (Themes[index].name == userTheme) {
					_Console.setTheme(Themes[index]);
					found = true;
				}
				index += 1;
			}
			// If no theme was found then inform the user.
			if (!found) {
				_StdIn.putText("Invalid theme. Type \"theme list\" to see valid themes.");
			}
		}
	} else {
		_StdIn.putText("Invalid argument list length. Please supply a valid theme. Type \"theme list\" for valid themes.");
	}
}

function shellValidateCode() {

	// Get the program code and split it into an array of characters.
	var tokens = _userInputArea.value.trim().split("");

	// Build the regex.
	var regex = new RegExp("([A-F]|[0-9]| )", "i");

	// Initialize loop variables.
	var valid = true;
	var index = 0;
	// loop until there are no more characters or an invalid character is found.
	while(valid && index < tokens.length) {

		if (!regex.test(tokens[index])) {
			valid = false;
		} else {
			index += 1;
		}
	}

	// Inform the user of the results.
	if (!valid) {
		_StdIn.putText("  Invalid token found in program.");
		_StdIn.advanceLine();
		_StdIn.putText("  Program should contain only spaces and HEX characters.");
	} else {
		_StdIn.putText("  Your program is valid. Good Job.");
		_StdIn.advanceLine();
		_StdIn.putText("  Whether it is correct remains to be seen.");
	}
}