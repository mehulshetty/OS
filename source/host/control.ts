/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }

            setInterval(() => this.updateCurrentDateAndTime(), 1000);
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSClock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt, Reset, and Single Step buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = false;

            document.getElementById("btnHaltOS").style.display = "block";
            document.getElementById("btnStartOS").style.display = "none";

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            _Memory = new Memory();
            _Memory.init();

            _MemoryAccessor = new MemoryAccessor(0x000,0x00,_Memory);
            _CPU.connectMemoryAccessor();

            _MemoryManager = new MemoryManager(_MemoryAccessor);

            _CPUScheduler = new CpuScheduler();
            _CPUDispatcher = new CpuDispatcher();

            setInterval(() => {
                this.updateCpuViewRow();
                this.updateMemoryViewBody();
                this.updateProcessViewBody();
                this.updateDiskViewBody();}, 100);

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);

            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = true;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).value = "Start";
            (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = true;
            document.getElementById("btnSingleStep").innerText = "Start Single Step";
            document.getElementById("btnSingleStep").className = "btn btn-success";
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static updateCurrentDateAndTime(): void {
            let dateAndTimeObject = <HTMLInputElement>document.getElementById("currentDateAndTime");
            let updatedDateAndTime = new Date();
            dateAndTimeObject.value = updatedDateAndTime.toUTCString();
        }

        public static updateCpuViewRow(): void {

            let updatedHtmlText = "<td>" + _CPU.PC.toString(16).padStart(3, '0') + "</td>"
                + "<td>" + _CPU.IR.toString(16).padStart(2, '0') + "</td>"
                + "<td>" + _CPU.acc.toString(16).padStart(2, '0') + "</td>"
                + "<td>" + _CPU.xReg.toString(16).padStart(2, '0') + "</td>"
                + "<td>" + _CPU.yReg.toString(16).padStart(2, '0') + "</td>"
                + "<td>" + _CPU.zFlag.toString(16) + "</td>";

            document.getElementById("cpuViewRow").innerHTML = updatedHtmlText;

            console.log("PID: ", _MemoryManager.executingPid.toString(),
                " | PC: ", _CPU.PC.toString(16).padStart(3, '0'),
                " | IR: ", _CPU.IR.toString(16).padStart(2, '0'),
                " | ACC: ", _CPU.acc.toString(16).padStart(2, '0'),
                " | X: ", _CPU.xReg.toString(16).padStart(2, '0'),
                " | Y: ", _CPU.yReg.toString(16).padStart(2, '0'),
                " | Z: ", _CPU.zFlag);
        }

        public static updateMemoryViewBody(): void {

            let updatedHtmlText = "";

            for(let rowStart = 0x000; rowStart < 0x300; rowStart += 0x08 ) {
                updatedHtmlText += "<tr><th>0x" + rowStart.toString(16).padStart(3, '0') + "</th>";
                for(let i = 0x0; i < 0x8; i++) {
                    updatedHtmlText += "<td>" + _Memory.storage[rowStart + i].toString(16).padStart(2, '0')
                        + "</td>";
                }

                updatedHtmlText += "</tr>";
            }

            document.getElementById("memoryViewBody").innerHTML = updatedHtmlText;
        }

        public static updateDiskViewBody(): void {

            let updatedHtmlText = "";

            for(let track = 0x0; track < 0x04; track++) {
                for(let sector = 0x0; sector < 0x08; sector ++) {
                    for(let block = 0x0; block < 0x08; block++) {
                        updatedHtmlText += "<tr><td>" + track + ":" + sector + ":" + block + "</td>";

                        let tsb = track.toString() + sector.toString() + block.toString();
                        let tsbDataArray = JSON.parse(sessionStorage.getItem(tsb));

                        updatedHtmlText += "<td>" + tsbDataArray[0] +
                            "</td><td>" + tsbDataArray[1] +
                            "</td><td>" + tsbDataArray[2] +
                            "</td><td>" + tsbDataArray[3] +
                            "</td><td>" + tsbDataArray.slice(4).join(' ') + "</td></tr>";
                    }
                }
            }

            document.getElementById("diskViewBody").innerHTML = updatedHtmlText;
        }

        public static updateProcessViewBody(): void {

            let updatedHtmlText = "";

            if(_CPU.isExecuting) {
                for(let blockRow = 0x0; blockRow < readyQueue.length; blockRow++) {
                    let block = readyQueue[blockRow];
                    if(block.pid == _MemoryManager.executingPid) {
                        updatedHtmlText += "<tr><td>" + block.pid.toString(16) + "</td>";
                        updatedHtmlText += "<td>" + _CPU.PC.toString(16).padStart(3, '0') + "</td>";
                        updatedHtmlText += "<td>" + _CPU.IR.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + _CPU.acc.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + _CPU.xReg.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + _CPU.yReg.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + _CPU.zFlag.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.baseRegister.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.state + "</td>";
                        updatedHtmlText += "<td>Memory</td>";
                        updatedHtmlText += "</tr>";
                    }
                    else {
                        updatedHtmlText += "<tr><td>" + block.pid.toString(16) + "</td>";
                        updatedHtmlText += "<td>" + block.pc.toString(16).padStart(3, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.ir.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.acc.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.xReg.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.yReg.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.zFlag.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.baseRegister.toString(16).padStart(2, '0') + "</td>";
                        updatedHtmlText += "<td>" + block.state + "</td>";
                        updatedHtmlText += "<td>" + block.location + "</td>";
                        updatedHtmlText += "</tr>";
                    }
                }
            }

            document.getElementById("processViewBody").innerHTML = updatedHtmlText;
        }

        public static hostSingleStep(btn): void {

            let btnValue = (<HTMLButtonElement>document.getElementById("btnSingleStep")).value;

            // Code runs when starting Single Step
            if(btnValue == "Start") {
                (<HTMLButtonElement>document.getElementById("btnSingleStep")).value = "Stop";
                (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = false;
                clearInterval(_hardwareClockID);
                document.getElementById("btnSingleStep").innerText = "Stop Single Step";
                document.getElementById("btnSingleStep").className = "btn btn-danger";
            }
            // Code runs when stopping Single Step
            else {
                (<HTMLButtonElement>document.getElementById("btnSingleStep")).value = "Start";
                (<HTMLButtonElement>document.getElementById("btnNextStep")).disabled = true;
                _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
                document.getElementById("btnSingleStep").innerText = "Start Single Step";
                document.getElementById("btnSingleStep").className = "btn btn-success";
            }
        }

        public static hostNextStep(): void {
            Devices.hostClockPulse();
        }
    }
}
