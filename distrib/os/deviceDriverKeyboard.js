/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            // console.log(params);
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            if (isCtrl && keyCode == 67) {
                let currentProcess = _MemoryManager.executingPid;
                for (let processNum = 0; processNum < readyQueue.length; processNum++) {
                    if (readyQueue[processNum].pid == currentProcess) {
                        readyQueue[processNum].state = "Terminated";
                        _CPUScheduler.currentQuantum = _CPUScheduler.quantum;
                        break;
                    }
                }
            }
            else {
                var chr = "";
                // Check to see if we even want to deal with the key that was pressed.
                if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                    if (isShifted === true) {
                        chr = String.fromCharCode(keyCode); // Uppercase A-Z
                    }
                    else {
                        chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                    }
                    // TODO: Check for caps-lock and handle as shifted if so.
                    _KernelInputQueue.enqueue(chr);
                }
                else if (((keyCode >= 48) && (keyCode <= 57))) {
                    if (isShifted === true) { // Special Characters Above Numbers !-)
                        switch (keyCode) {
                            case 48:
                                chr = ")";
                                break;
                            case 49:
                                chr = "!";
                                break;
                            case 50:
                                chr = "@";
                                break;
                            case 51:
                                chr = "#";
                                break;
                            case 52:
                                chr = "$";
                                break;
                            case 53:
                                chr = "%";
                                break;
                            case 54:
                                chr = "^";
                                break;
                            case 55:
                                chr = "&";
                                break;
                            case 56:
                                chr = "*";
                                break;
                            case 57:
                                chr = "(";
                                break;
                        }
                    }
                    else {
                        chr = String.fromCharCode(keyCode); // Digits 0-9
                    }
                    _KernelInputQueue.enqueue(chr);
                }
                else if (((keyCode >= 186) && (keyCode <= 192)) || // All Remaining Special Characters
                    ((keyCode >= 219) && (keyCode <= 222))) {
                    if (isShifted === true) {
                        switch (keyCode) {
                            case 186:
                                chr = ":";
                                break;
                            case 187:
                                chr = "+";
                                break;
                            case 188:
                                chr = "<";
                                break;
                            case 189:
                                chr = "_";
                                break;
                            case 190:
                                chr = ">";
                                break;
                            case 191:
                                chr = "?";
                                break;
                            case 192:
                                chr = "~";
                                break;
                            case 219:
                                chr = "{";
                                break;
                            case 220:
                                chr = "|";
                                break;
                            case 221:
                                chr = "}";
                                break;
                            case 222:
                                chr = "\"";
                                break;
                        }
                    }
                    else {
                        switch (keyCode) {
                            case 186:
                                chr = ";";
                                break;
                            case 187:
                                chr = "=";
                                break;
                            case 188:
                                chr = ",";
                                break;
                            case 189:
                                chr = "-";
                                break;
                            case 190:
                                chr = ".";
                                break;
                            case 191:
                                chr = "/";
                                break;
                            case 192:
                                chr = "`";
                                break;
                            case 219:
                                chr = "[";
                                break;
                            case 220:
                                chr = "\\";
                                break;
                            case 221:
                                chr = "]";
                                break;
                            case 222:
                                chr = "'";
                                break;
                        }
                    }
                    _KernelInputQueue.enqueue(chr);
                }
                else if ((keyCode == 32) || // space
                    (keyCode == 13) || // enter
                    (keyCode == 9) || // tab
                    (keyCode == 8)) { // backspace
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                else if (keyCode == 38) { // Up Arrow
                    _KernelInputQueue.enqueue("UP");
                }
                else if (keyCode == 40) { // Down Arrow
                    _KernelInputQueue.enqueue("DOWN");
                }
                else if (keyCode == 17) {
                    isCtrl = true;
                }
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map