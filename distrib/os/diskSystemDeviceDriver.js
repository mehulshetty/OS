/* ----------------------------------
   DiskSystemDeviceDriver.ts

   The Disk System Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DiskSystemDeviceDriver extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnDiskDriverEntry;
            this.isr = this.krnDiskDispatchKeyPress;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnDiskDispatchKeyPress(params) {
        }
        format() {
            if (this.status === "unloaded") {
                let zerosArray = new Array(64).fill("-");
                zerosArray[0] = "0";
                for (let track = 0x0; track < 0x04; track++) {
                    for (let sector = 0x0; sector < 0x08; sector++) {
                        for (let block = 0x0; block < 0x08; block++) {
                            let tsb = track.toString() + sector.toString() + block.toString();
                            sessionStorage.setItem(tsb, JSON.stringify(zerosArray));
                        }
                    }
                }
            }
            console.log(sessionStorage);
        }
    }
    TSOS.DiskSystemDeviceDriver = DiskSystemDeviceDriver;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskSystemDeviceDriver.js.map