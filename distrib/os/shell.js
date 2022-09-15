/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.

   SOURCE: https://stackoverflow.com/questions/3057162/moving-an-image-across-a-html-canvas
   SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.commandStringList = ["ver", "help", "shutdown", "cls", "man", "trace", "rot13", "prompt", "status", "load", "bsod", "date", "whereami", "hey", "gokitty"];
            this.commandHistory = new Array();
            this.commandOrder = -1;
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "Displays the current date.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "Shows you where you are.");
            this.commandList[this.commandList.length] = sc;
            // gokitty
            sc = new TSOS.ShellCommand(this.shellGoKitty, "gokitty", "Run Kitty Run! Run away from this OS!");
            this.commandList[this.commandList.length] = sc;
            // hey <name>
            sc = new TSOS.ShellCommand(this.shellHey, "hey", "<name> - The name you want to say hi to.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status message.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "Loads the user input and checks if it is valid HEX.");
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "Displays the blue screen of death.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            this.commandHistory.push(buffer);
            console.log("Command History; ", this.commandHistory);
            this.commandOrder = this.commandHistory.length - 1;
            console.log("Command Order; ", this.commandOrder);
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        handleTab(buffer) {
            let possibleCommands = new Array();
            for (let command of this.commandStringList) {
                if (command.startsWith(buffer)) {
                    possibleCommands.push(command);
                }
            }
            if (possibleCommands.length == 1) {
                _StdOut.putText(possibleCommands[0].slice(buffer.length));
                return possibleCommands[0];
            }
            else {
                _StdOut.advanceLine();
                let tabString = "No Valid Commands";
                if (possibleCommands.length > 1) {
                    tabString = possibleCommands.join(" | ");
                }
                _StdOut.putText(tabString);
                _StdOut.advanceLine();
                // Check to see if we need to advance the line again
                if (_StdOut.currentXPosition > 0) {
                    _StdOut.advanceLine();
                }
                // ... and finally write the prompt again.
                this.putPrompt();
                _StdOut.putText(buffer);
                return buffer;
            }
        }
        handleUpAndDown(keyStroke) {
            if (this.commandHistory.length !== 0) {
                if (keyStroke === "UP") {
                    let prevCommand = this.commandHistory[this.commandOrder];
                    if ((this.commandOrder - 1) >= 0) {
                        this.commandOrder -= 1;
                    }
                    return prevCommand;
                }
                else {
                    let nextCommand = this.commandHistory[this.commandOrder];
                    if ((this.commandOrder + 1) < this.commandHistory.length) {
                        this.commandOrder += 1;
                    }
                    return nextCommand;
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            let retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            let tempList = buffer.split(" ");
            if (!buffer.toLowerCase().startsWith("status")) {
                // 2. Lower-case it.
                for (let itemNum = 0; itemNum < tempList.length; itemNum++) {
                    tempList[itemNum] = tempList[itemNum].toLowerCase();
                }
            }
            else {
                let tempList = buffer.split(" ");
                tempList[0] = tempList[0].toLowerCase();
            }
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                let topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "date":
                        _StdOut.putText("Date displays the date in your current location.");
                        break;
                    case "whereami":
                        _StdOut.putText("Whereami guestimates where you might be. The instruments used to calculate this are not precise so expect an error of about 1-99%.");
                        break;
                    case "gokitty":
                        _StdOut.putText("Allows kitty to be free and run towards its freedom! Just type gokitty and watch kitty fly through the screen.");
                        break;
                    case "hey":
                        _StdOut.putText("Hey <name> says hi back to you if you get the kernel's name right. Type hey siri to get answers to any questions from Apple's virtual assistant.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellDate() {
            let dateTime = new Date();
            _StdOut.putText("In this universe, the time is " + dateTime + " on Planet Earth.");
        }
        shellWhereAmI() {
            let placesYouAre = ["Lost in the mall trying to find mom.",
                "I'm right where you left me.",
                "Past event horizon, into the black hole called zerOS.",
                "In Beyonce's basement having dinner with the other inmates.",
                "Es mejor si no sabes a dónde vamos.",
                "In a Venetian beach, getting some radiant light.",
                "The question isn't where are you, it's when are you.",
                "YOU'RE FINALLY AWAKE!",
                "Your coordinates are 53.98N and 78.98W. Oh wait, I'm looking at the wrong map.",
                "!On ThE dIsCo FlOor!",
                "I'm just as lost as you are mate."];
            _StdOut.putText(placesYouAre[Math.floor(Math.random() * 11)]);
        }
        shellGoKitty() {
            console.log("HERE");
            let catImage = new Image();
            let catPosition = 0;
            catImage.src = "source/os/images/kittyImage.png";
            catImage.onload = runAnimation;
            function runAnimation() {
                _DrawingContext.drawImage(catImage, catPosition, _StdOut.currentYPosition - 80, 90, 35);
                catPosition += 5;
                if (catPosition < 900) {
                    requestAnimationFrame(runAnimation);
                }
            }
            _StdOut.currentYPosition += 50;
        }
        shellHey(args) {
            if (args.length > 0) {
                let name = args[0].toUpperCase();
                if (name === "SIRI") {
                    _StdOut.putText("Sorry, I didn't catch that.");
                }
                else {
                    _StdOut.putText("Hello Kind User! My name is not " + name);
                }
            }
            else {
                _StdOut.putText("Usage: hey <name>");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid argument.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellStatus(args) {
            if (args.length > 0) {
                let statusDescription = args[0];
                let newStatus = document.getElementById("status");
                newStatus.value = "STATUS: " + statusDescription;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please provide a status description.");
            }
        }
        shellLoad() {
            let loadData = document.getElementById("taProgramInput").value;
            console.log(loadData);
            if (loadData !== "") {
                let validData = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", " "];
                let isValid = true;
                for (let loadLetter of loadData) {
                    loadLetter = loadLetter.toUpperCase();
                    console.log(loadLetter);
                    if (!validData.includes(loadLetter)) {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) {
                    _StdOut.putText("The input user code is VALID.");
                }
                else {
                    _StdOut.putText("The input user code is INVALID.");
                }
            }
            else {
                _StdOut.putText("Usage: prompt <load>  Please load some user code.");
            }
        }
        // TODO: BSOD
        shellBsod() {
            _DrawingContext.fillStyle = "#0000FF";
            _DrawingContext.fillRect(0, 0, 900, 650);
            _DrawingContext.fillStyle = "#FFFFFF";
            _DrawingContext.fillRect(200, 305, 550, -30);
            _StdOut.currentXPosition = 250;
            _StdOut.currentYPosition = 300;
            _StdOut.putText("UNKNOWN_ERROR.EXE was run. Please restart the system.");
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map