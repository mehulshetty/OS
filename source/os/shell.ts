/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.

   SOURCE: https://stackoverflow.com/questions/3057162/moving-an-image-across-a-html-canvas
   SOURCE: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public commandStringList = ["ver", "help", "shutdown", "cls", "man", "trace", "rot13", "prompt", "status", "load", "bsod", "date", "whereami", "hey", "gokitty"];
        public commandHistory = new Array();
        public commandOrder = -1;
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                "ver",
                "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                "help",
                "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                "shutdown",
                "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                "cls",
                "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                "man",
                "- <topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                "date",
                "- Displays the current date.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereAmI,
                "whereami",
                "- Shows you where you are.");
            this.commandList[this.commandList.length] = sc;

            // gokitty
            sc = new ShellCommand(this.shellGoKitty,
                "gokitty",
                "- Run Kitty Run! Run away from this OS!");
            this.commandList[this.commandList.length] = sc;

            // hey <name>
            sc = new ShellCommand(this.shellHey,
                "hey",
                "- <name> - The name you want to say hi to.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                "trace",
                "- <on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                "rot13",
                "- <string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                "prompt",
                "- <string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // status <string>
            sc = new ShellCommand(this.shellStatus,
                "status",
                "- <string> - Sets the status message.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "- Loads the user input and checks if it is valid HEX.");
            this.commandList[this.commandList.length] = sc;

            // bsod
            sc = new ShellCommand(this.shellBsod,
                "bsod",
                "- Displays the blue screen of death.");
            this.commandList[this.commandList.length] = sc;

            // bsod
            sc = new ShellCommand(this.shellRun,
                "run",
                "- <pid> - Runs a program from memory.");
            this.commandList[this.commandList.length] = sc;

            // run all
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- Runs all programs in memory.");
            this.commandList[this.commandList.length] = sc;

            // quantum
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "- <int> - Sets the quantum for round-robin.");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- Clears all memory partitions.");
            this.commandList[this.commandList.length] = sc;

            // ps
            sc = new ShellCommand(this.shellPS,
                "ps",
                "- Displays the PID and state of all processes.");
            this.commandList[this.commandList.length] = sc;

            // kill
            sc = new ShellCommand(this.shellKill,
                "kill",
                "- <id> - Kills the specified process id.");
            this.commandList[this.commandList.length] = sc;

            // killall
            sc = new ShellCommand(this.shellKillAll,
                "killall",
                "- Kills all processes.");
            this.commandList[this.commandList.length] = sc;

            // format
            sc = new ShellCommand(this.shellFormat,
                "format",
                "- Formats the disk drive.");
            this.commandList[this.commandList.length] = sc;

            // create
            sc = new ShellCommand(this.shellCreate,
                "create",
                "- <filename> - Creates a file with the specified name.");
            this.commandList[this.commandList.length] = sc;

            // read
            sc = new ShellCommand(this.shellRead,
                "read",
                "- <filename> - Reads and displays the contents of the file.");
            this.commandList[this.commandList.length] = sc;

            // write
            sc = new ShellCommand(this.shellWrite,
                "write",
                "- <filename> \"data\" - Writes the data inside the quotes to the file with given name.");
            this.commandList[this.commandList.length] = sc;

            // delete
            sc = new ShellCommand(this.shellDelete,
                "delete",
                "- <filename> - Removes filename from storage.");
            this.commandList[this.commandList.length] = sc;

            // copy
            sc = new ShellCommand(this.shellCopy,
                "copy",
                "- <existing filename> <new filename> - Copies the existing file into the new one.");
            this.commandList[this.commandList.length] = sc;

            // rename
            sc = new ShellCommand(this.shellRename,
                "rename",
                "- <current filename> <new filename> - Rename the current file to the new name.");
            this.commandList[this.commandList.length] = sc;

            // ls
            sc = new ShellCommand(this.shellList,
                "ls",
                "- Displays all the files currently stored on the disk.");
            this.commandList[this.commandList.length] = sc;

            // getSchedule
            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                "- Displays the CPU scheduling type";
            this.commandList[this.commandList.length] = sc;

            // setSchedule
            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                "- <scheduleType> Sets the CPU scheduling type";
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            this.commandHistory.push(buffer);
            this.commandOrder = this.commandHistory.length - 1; // Resets the commandOrder to be the current command

            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            let userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            let cmd = userCommand.command;
            let args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            let index: number = 0;
            let found: boolean = false;
            let fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        public handleTab(buffer) {
            let possibleCommands = new Array();

            // Finds all commands that could be possible matches for the current buffer
            for (let command of this.commandStringList) {
                if(command.startsWith(buffer)) {
                    possibleCommands.push(command);
                }
            }

            // If there's only one command that matches the current buffer, then it replaces the buffer with the command
            if (possibleCommands.length == 1) {
                _StdOut.putText(possibleCommands[0].slice(buffer.length));

                return possibleCommands[0];
            }
            else {
                _StdOut.advanceLine();

                let tabString = "No Valid Commands";

                // If there's more than one command that matches the buffer, then display them all
                if (possibleCommands.length > 1) {
                    tabString = possibleCommands.join(" | ");
                }

                _StdOut.putText(tabString);
                _StdOut.advanceLine();

                // Check to see if we need to advance the line again
                if (_StdOut.currentXPosition > 0) {
                    _StdOut.advanceLine();
                }

                //Write the prompt again.
                this.putPrompt();
                _StdOut.putText(buffer);

                return buffer;
            }

        }

        public handleUpAndDown(keyStroke) {

            if(this.commandHistory.length !== 0) {
                if(keyStroke === "UP") {
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
        public execute(fn, args?) {
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

        public parseInput(buffer: string): UserCommand {
            let retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            let tempList = buffer.split(" ");

            if(!buffer.toLowerCase().startsWith("status")) {
                // 2. Lower-case it.
                for (let itemNum = 0; itemNum < tempList.length; itemNum++) {
                    tempList[itemNum] = tempList[itemNum].toLowerCase();
                }
            }
            else {
                tempList = ["status", buffer.slice(7)];
            }

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
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
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        }

        // Although args is unused in some of these functions, it is always provided in the
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
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
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellDate() {
            let dateTime = new Date();
            _StdOut.putText("In this universe, the time is " + dateTime + " on Planet Earth.");
        }

        public shellWhereAmI() {
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
                "I'm just as lost as you are mate."]
            _StdOut.putText(placesYouAre[Math.floor(Math.random() * 11)]);
        }

        public shellGoKitty() {
            let catImage = new Image();
            let catPosition = 0;

            catImage.src = "source/os/images/kittyImage.png";

            catImage.onload = runAnimation;

            // Runs the actual animation for the cat
            function runAnimation() {
                _DrawingContext.drawImage(catImage, catPosition, _StdOut.currentYPosition - 80, 90, 35);
                catPosition += 5;
                if(catPosition < 900) {
                    requestAnimationFrame(runAnimation);
                }
            }

            _StdOut.currentYPosition += 50;
        }

        public shellHey(args: string[]) {
            if (args.length > 0) {
                let name = args[0].toUpperCase();

                if(name === "SIRI") {
                    _StdOut.putText("Sorry, I didn't catch that.");
                }
                else {
                    _StdOut.putText("Hello Kind User! My name is not " + name);
                }
            } else {
                _StdOut.putText("Usage: hey <name>");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellStatus(args: string[]) {
            if (args.length > 0) {
                let statusDescription = args[0];

                let newStatus = <HTMLInputElement>document.getElementById("status");
                newStatus.value = "STATUS: " + statusDescription;

            } else {
                _StdOut.putText("Usage: status <string>  Please provide a status description.");
            }
        }

        public shellLoad() {

            // Gets the text from the User Input box
            let loadData = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
            loadData = loadData.replace(/\s/g, '');

            if (loadData !== "") {
                let validData = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
                let isValid = true;

                for (let loadLetter of loadData) {
                    loadLetter = loadLetter.toUpperCase();

                    if (!validData.includes(loadLetter)) {
                        isValid = false;
                        break;
                    }
                }

                if(isValid) {
                    // _StdOut.putText("The input user code is VALID.");
                    let loadDataArray = loadData.match(/.{1,2}/g);

                    // Creates a new process and pushes it onto the ready queue
                    let pidString = _MemoryManager.store(loadDataArray);

                    _StdOut.putText(pidString);
                }
                else {
                    _StdOut.putText("The input user code is INVALID.");
                }
            } else {
                _StdOut.putText("Usage: prompt <load>  Please load some user code.");
            }
        }

        public shellRun(args: string[]) {
            if (args.length > 0) {
                let commandPid = args[0];
                _MemoryManager.run(parseInt(commandPid));
            }
        }

        public shellBsod(args: string[]) {
            if (args.length > 0) {
                _Kernel.krnTrapError(args.join(' '));
            }
            else {
                _Kernel.krnTrapError("UNKNOWN_ERROR.EXE was run. Please restart the system.");
            }
        }

        public shellRunAll() {
            console.log(residentList);
            while(residentList.length != 0) {
                _MemoryManager.run(residentList[0].pid);
            }
        }

        public shellQuantum(args: string[]) {
            if (args.length > 0) {
                _CPUScheduler.quantum = parseInt(args[0]);
            }
        }

        public shellClearMem() {
            _Memory.reset();
            _MemoryManager.clearMem();
        }

        public shellKill(args: string[]) {
            if (args.length > 0) {
                for(let processNum = 0; processNum < readyQueue.length; processNum++) {
                    if(readyQueue[processNum].pid == parseInt(args[0])) {
                        readyQueue[processNum].state = "Terminated";
                        _CPUScheduler.currentQuantum = _CPUScheduler.quantum;
                        break;
                    }
                }
            }
        }

        public shellKillAll() {

            let newQueue = readyQueue;
            readyQueue = [];

            for(let processNum = 0; processNum < newQueue.length; processNum++) {
                terminatedList.push(newQueue[processNum].pid);
            }

            _CPU.clearAll();
        }

        public shellPS() {
            let processList = {};
            for(let processNum = 0; processNum < residentList.length; processNum++) {
                let currentPid = residentList[processNum].pid;
                processList[currentPid.toString()] = "Resident";
            }

            for(let processNum = 0; processNum < readyQueue.length; processNum++) {
                let currentPid = readyQueue[processNum].pid;
                processList[currentPid.toString()] = readyQueue[processNum].state;
            }

            for(let processNum = 0; processNum < terminatedList.length; processNum++) {
                let currentPid = terminatedList[processNum];
                processList[currentPid.toString()] = "Terminated";
            }

            _StdOut.putText("  PID               State");
            _StdOut.advanceLine();
            let sortedKeys = Object.keys(processList).sort();

            for(let keyNum = 0; keyNum < sortedKeys.length; keyNum++) {
                let pid = sortedKeys[keyNum];
                let outputText = pid.padStart(5, " ") + processList[pid].padStart(20, " ");
                _StdOut.putText(outputText);
                _StdOut.advanceLine();
            }

        }

        public shellFormat() {
            _krnDiskDriver.format();
            _StdOut.putText("Disk Formatted.");
        }

        public shellCreate(args: string[]) {
            if (args.length > 0) {
                if(args[0].length < 60) {
                    if(!args[0].includes("~")) {
                        _krnDiskDriver.create(args[0]);
                    }
                    else {
                        _StdOut.putText("Filename cannot have a tilde (~).");
                    }
                }
                else {
                    _StdOut.putText("Filename cannot exceed 59 characters.");
                }
            }
        }

        public shellRead(args: string[]) {
            if (args.length > 0) {
                let filename = args[0];

                let data = _krnDiskDriver.read(filename);
                _StdOut.putText(data);
            }
        }

        public shellWrite(args: string[]) {
            if (args.length > 0) {
                if(!args[0].includes("~")) {
                    let filename = args[0];

                    let data = args.slice(1).join(" ");

                    _krnDiskDriver.write(filename, data);
                }
                else {
                    _StdOut.putText("Filename cannot have a tilde (~).");
                }
            }
        }

        public shellDelete(args: string[]) {
            if (args.length > 0) {
                if(!args[0].includes("~")) {
                    let filename = args[0];

                    _krnDiskDriver.delete(filename);
                }
                else {
                    _StdOut.putText("Filename cannot have a tilde (~).");
                }
            }
        }

        public shellCopy(args: string[]) {
            if (args.length >= 2) {
                if(!args[0].includes("~") && !args[1].includes("~")) {
                    if(args[0] != args[1]) {
                        _krnDiskDriver.copy(args[0], args[1]);
                    }
                    else {
                        _StdOut.putText("Filename already exists.");
                    }
                }
                else {
                    _StdOut.putText("Filename cannot have a tilde (~).");
                }
            }
        }

        public shellRename(args: string[]) {
            if (args.length > 1) {
                if(!args[0].includes("~") && !args[1].includes("~")) {
                    console.log(args);
                    _krnDiskDriver.rename(args[0], args[1]);
                }
                else {
                    _StdOut.putText("Filename cannot have a tilde (~).");
                }
            }
            else {
                _StdOut.putText("Has two parameters.");
            }
        }

        public shellList() {
            let allFiles = _krnDiskDriver.list();

            if(allFiles.length != 0) {

                _StdOut.putText("All Files:");

                for(let filename of allFiles) {
                    _StdOut.advanceLine();
                    _StdOut.putText(filename);
                }
            }
            else {
                _StdOut.putText("No files to display. Storage is empty.");
            }
        }

        public shellGetSchedule() {
            if(_CPUScheduler.quantum != Number.MAX_VALUE) {
                _StdOut.putText("CPU Schedule: Round Robin");
            }
            else {
                _StdOut.putText("CPU Schedule: First-Come First-Serve");
            }
        }

        public shellSetSchedule(args: string[]) {
            if (args.length > 0) {
                switch(args[0].toLowerCase()) {
                    case "fcfs":
                        _CPUScheduler.quantum = Number.MAX_VALUE;
                        break;
                    case "rr":
                        _CPUScheduler.quantum = 6;
                        break;
                }
            }
        }
    }
}
