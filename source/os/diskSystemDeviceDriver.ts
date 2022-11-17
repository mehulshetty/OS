/* ----------------------------------
   DiskSystemDeviceDriver.ts

   The Disk System Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DiskSystemDeviceDriver extends DeviceDriver {

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

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnDiskDispatchKeyPress(params) {
        }

        public format() {
            if(this.status === "unloaded") {
                let zerosArray = new Array(64).fill("--");
                zerosArray[0x0] = "0";

                for(let track = 0x0; track < 0x4; track++) {
                    for(let sector = 0x0; sector < 0x8; sector ++) {
                        for(let block = 0x0; block < 0x8; block++) {
                            let tsb = track.toString() + sector.toString() + block.toString();
                            sessionStorage.setItem(tsb, JSON.stringify(zerosArray));
                        }
                    }
                }
            }
        }

        public findUnusedStorageLocation(): string {

            for(let track = 0x1; track < 0x4; track++) {
                for(let sector = 0x0; sector < 0x8; sector ++) {
                    for(let block = 0x0; block < 0x8; block++) {
                        let tsb = track.toString() + sector.toString() + block.toString();
                        let inUse = JSON.parse(sessionStorage.getItem(tsb))[0]

                        if(inUse == "0") {
                            return tsb;
                        }
                    }
                }
            }
            return "";
        }

        public create(filename: string): string {

            let track = 0x0;
            for(let sector = 0x0; sector < 0x8; sector++) {
                for(let block = 0x0; block < 0x8; block++) {
                    let tsb = track.toString() + sector.toString() + block.toString();
                    if(tsb != "000") {
                        let inUse = JSON.parse(sessionStorage.getItem(tsb))[0];

                        if(inUse == "0") {
                            let newArray = new Array(64).fill("--");
                            newArray[0x0] = "1";

                            let nextLocation = this.findUnusedStorageLocation();

                            if(nextLocation != "") {
                                let nextLocationArray = JSON.parse(sessionStorage.getItem(tsb));
                                nextLocationArray[0] = "1";
                                sessionStorage.setItem(nextLocation, JSON.stringify(nextLocationArray));

                                newArray[0x1] = nextLocation[0x0];
                                newArray[0x2] = nextLocation[0x1];
                                newArray[0x3] = nextLocation[0x2];

                                let filenameArray = filename.split('')
                                    .map(char => char.charCodeAt(0).toString(16));

                                let arrayElemNum = 0x4;
                                for(let letter of filenameArray) {
                                    newArray[arrayElemNum] = letter;
                                    arrayElemNum++;
                                }

                                sessionStorage.setItem(tsb, JSON.stringify(newArray));
                                return "File Created";
                            }
                        }
                    }
                }
            }
        }

        public findRenameTsb(currentFilename: string): string {
            let track = 0x0;
            for(let sector = 0x0; sector < 0x8; sector++) {
                for(let block = 0x0; block < 0x8; block++) {
                    let tsb = track.toString() + sector.toString() + block.toString();
                    if(tsb != "000") {
                        let filenameArray = JSON.parse(sessionStorage.getItem(tsb));

                        if(filenameArray[0] == "1") {
                            let currentFilenameArray = currentFilename.split('')
                                .map(char => char.charCodeAt(0).toString(16));

                            let compareFilenameArray = filenameArray.slice(4, currentFilenameArray.length + 4);
                            if(JSON.stringify(currentFilenameArray) == JSON.stringify(compareFilenameArray)) {
                                if(filenameArray[currentFilenameArray.length + 4] == "--") {
                                    return tsb;
                                }
                            }

                        }
                    }
                }
            }
            return "";
        }

        public rename(currentFilename: string, newFilename: string): string {
            let renameTsb = this.findRenameTsb(currentFilename);
            let renameTsbArray = JSON.parse(sessionStorage.getItem(renameTsb));

            if(renameTsb != "") {
                let newArray = new Array(64).fill("--");
                newArray[0x0] = renameTsbArray[0x0];
                newArray[0x1] = renameTsbArray[0x1];
                newArray[0x2] = renameTsbArray[0x2];
                newArray[0x3] = renameTsbArray[0x3];

                let filenameArray = newFilename.split('')
                    .map(char => char.charCodeAt(0).toString(16));

                let arrayElemNum = 0x4;
                for(let letter of filenameArray) {
                    newArray[arrayElemNum] = letter;
                    arrayElemNum++;
                }

                sessionStorage.setItem(renameTsb, JSON.stringify(newArray));

                return "File renamed."
            }
        }
    }
}
