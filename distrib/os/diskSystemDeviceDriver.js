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
                let zerosArray = new Array(64).fill("--");
                zerosArray[0x0] = "0";
                for (let track = 0x0; track < 0x4; track++) {
                    for (let sector = 0x0; sector < 0x8; sector++) {
                        for (let block = 0x0; block < 0x8; block++) {
                            let tsb = track.toString() + sector.toString() + block.toString();
                            sessionStorage.setItem(tsb, JSON.stringify(zerosArray));
                        }
                    }
                }
            }
        }
        findUnusedStorageLocation() {
            for (let track = 0x1; track < 0x4; track++) {
                for (let sector = 0x0; sector < 0x8; sector++) {
                    for (let block = 0x0; block < 0x8; block++) {
                        let tsb = track.toString() + sector.toString() + block.toString();
                        let inUse = JSON.parse(sessionStorage.getItem(tsb))[0];
                        if (inUse == "0") {
                            return tsb;
                        }
                    }
                }
            }
            return "";
        }
        create(filename) {
            let track = 0x0;
            for (let sector = 0x0; sector < 0x8; sector++) {
                for (let block = 0x0; block < 0x8; block++) {
                    let tsb = track.toString() + sector.toString() + block.toString();
                    if (tsb != "000") {
                        let inUse = JSON.parse(sessionStorage.getItem(tsb))[0];
                        if (inUse == "0") {
                            let newArray = new Array(64).fill("--");
                            newArray[0x0] = "1";
                            let nextLocation = this.findUnusedStorageLocation();
                            if (nextLocation != "") {
                                let nextLocationArray = JSON.parse(sessionStorage.getItem(tsb));
                                nextLocationArray[0] = "1";
                                sessionStorage.setItem(nextLocation, JSON.stringify(nextLocationArray));
                                newArray[0x1] = nextLocation[0x0];
                                newArray[0x2] = nextLocation[0x1];
                                newArray[0x3] = nextLocation[0x2];
                                let filenameArray = filename.split('')
                                    .map(char => char.charCodeAt(0).toString(16).padStart(2, "0"));
                                let arrayElemNum = 0x4;
                                for (let letter of filenameArray) {
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
        findTsb(currentFilename) {
            let track = 0x0;
            for (let sector = 0x0; sector < 0x8; sector++) {
                for (let block = 0x0; block < 0x8; block++) {
                    let tsb = track.toString() + sector.toString() + block.toString();
                    if (tsb != "000") {
                        let filenameArray = JSON.parse(sessionStorage.getItem(tsb));
                        if (filenameArray[0] == "1") {
                            let currentFilenameArray = currentFilename.split('')
                                .map(char => char.charCodeAt(0).toString(16).padStart(2, "0"));
                            let compareFilenameArray = filenameArray.slice(4, currentFilenameArray.length + 4);
                            if (JSON.stringify(currentFilenameArray) == JSON.stringify(compareFilenameArray)) {
                                if (filenameArray[currentFilenameArray.length + 4] == "--") {
                                    return tsb;
                                }
                            }
                        }
                    }
                }
            }
            return "";
        }
        rename(currentFilename, newFilename) {
            let renameTsb = this.findTsb(currentFilename);
            let renameTsbArray = JSON.parse(sessionStorage.getItem(renameTsb));
            if (renameTsb != "") {
                let newArray = new Array(64).fill("--");
                newArray[0x0] = renameTsbArray[0x0];
                newArray[0x1] = renameTsbArray[0x1];
                newArray[0x2] = renameTsbArray[0x2];
                newArray[0x3] = renameTsbArray[0x3];
                let filenameArray = newFilename.split('')
                    .map(char => char.charCodeAt(0).toString(16).padStart(2, "0"));
                let arrayElemNum = 0x4;
                for (let letter of filenameArray) {
                    newArray[arrayElemNum] = letter;
                    arrayElemNum++;
                }
                sessionStorage.setItem(renameTsb, JSON.stringify(newArray));
                return "File renamed.";
            }
        }
        write(currentFilename, data) {
            let writeTsb = this.findTsb(currentFilename);
            if (writeTsb != "") {
                // Gets rid of the quotes
                data = data.slice(1, -1);
                let memoryBlocks = Math.floor(data.length / 60) + 1;
                let currentData = JSON.parse(sessionStorage.getItem(writeTsb));
                let currentTsb = currentData[1].toString() + currentData[2].toString() + currentData[3].toString();
                for (let block = 0x0; block < memoryBlocks; block++) {
                    let newDataArray = new Array(64).fill("--");
                    newDataArray[0] = "1";
                    let maxChars = 60;
                    // Finds the next block to store data in
                    if (block != memoryBlocks - 1) {
                        let unusedLocation = this.findUnusedStorageLocation();
                        console.log(unusedLocation);
                        newDataArray[0x1] = unusedLocation[0];
                        newDataArray[0x2] = unusedLocation[1];
                        newDataArray[0x3] = unusedLocation[2];
                    }
                    else {
                        maxChars = data.length % 60;
                    }
                    for (let charNum = 0; charNum < maxChars; charNum++) {
                        let characterValue = data.charCodeAt((block * 60) + charNum);
                        newDataArray[4 + charNum] = characterValue.toString(16).padStart(2, "0");
                    }
                    sessionStorage.setItem(currentTsb, JSON.stringify(newDataArray));
                    if (block != memoryBlocks - 1) {
                        currentTsb = newDataArray[0x1] + newDataArray[0x2] + newDataArray[0x3];
                    }
                }
            }
            return "Data written.";
        }
        delete(filename) {
            let deleteTsb = this.findTsb(filename);
            let deleteItem = JSON.parse(sessionStorage.getItem(deleteTsb));
            let nextTsb = deleteTsb;
            while (nextTsb != "------") {
                deleteItem[0] = "0";
                sessionStorage.setItem(nextTsb, JSON.stringify(deleteItem));
                nextTsb = deleteItem[1].toString() + deleteItem[2].toString() + deleteItem[3].toString();
                deleteItem = JSON.parse(sessionStorage.getItem(nextTsb));
            }
            return "File deleted.";
        }
    }
    TSOS.DiskSystemDeviceDriver = DiskSystemDeviceDriver;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=diskSystemDeviceDriver.js.map