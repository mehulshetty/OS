/* ------------
   memoryManager.ts

   This virtual memory manager "allocates" and "deallocates" storage in memory..
   ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(memoryAccessor = null, pid = 0, memoryMap = { 0: -1, 1: -1, 2: -1 }, executingPid = 0x0) {
            this.memoryAccessor = memoryAccessor;
            this.pid = pid;
            this.memoryMap = memoryMap;
            this.executingPid = executingPid;
        }
        /**
         * Stores incoming data memory
         * @param loadDataArray the data to be stored in memory
         */
        store(loadDataArray) {
            // Lets the user know if the program size is too large (greater than 256)
            if (loadDataArray.length > 0x100) {
                return "This program is too long to store in memory.";
            }
            // Checks the first location in memory that is available
            let storeLoc = -1;
            for (let i = 0; i < 3; i++) {
                if (this.memoryMap[i] == -1) {
                    storeLoc = i;
                    break;
                }
            }
            // Checks if there is any location in memory that is available
            if (storeLoc > -1) {
                // Rewrites the memory block with all zeros
                for (let arrayElemNum = 0; arrayElemNum < 0x100; arrayElemNum++) {
                    _MemoryAccessor.writeImmediate(storeLoc * 0x100 + arrayElemNum, 0x00);
                }
                // Writes the input data in memory
                for (let arrayElemNum = 0; arrayElemNum < loadDataArray.length; arrayElemNum++) {
                    _MemoryAccessor.writeImmediate(storeLoc * 0x100 + arrayElemNum, parseInt(loadDataArray[arrayElemNum], 16));
                }
                // TODO: Implement an actual way to map PIDs to their location within memory
                this.memoryMap[storeLoc] = this.pid;
                residentList.push(new TSOS.PCB(this.pid, storeLoc * 0x100, (storeLoc * 0x100) + 0x100, "Resident", storeLoc * 0x100));
                waitAndTurnaroundTimeTable[this.pid.toString()] = [0, 0];
            }
            else {
                this.storeInDisc(loadDataArray, this.pid);
            }
            return "Process " + (this.pid++).toString() + " created.";
        }
        /**
         * Begins executing a program in the CPU
         * @param commandPid the pid of the command to be executed
         */
        run(commandPid) {
            for (let processNum = 0; processNum < residentList.length; processNum++) {
                if (residentList[processNum].pid == commandPid) {
                    residentList[processNum].state = "Ready";
                    readyQueue.push(residentList[processNum]);
                    residentList.splice(processNum, 1);
                    break;
                }
            }
            if (_CPU.isExecuting == false) {
                _CPUScheduler.start();
                _CPU.isExecuting = true;
            }
        }
        clearMem() {
            this.memoryMap = { 0: -1, 1: -1, 2: -1 };
        }
        /**
         * Stores a program in the disk
         * @param loadDataArray the array of program data to be stored
         */
        storeInDisc(loadDataArray, pid) {
            let dataArray = new Array(256).fill("00");
            for (let dataItemNum = 0; dataItemNum < loadDataArray.length; dataItemNum++) {
                dataArray[dataItemNum] = loadDataArray[dataItemNum];
            }
            _krnDiskDriver.create("~" + pid);
            _krnDiskDriver.writeDirect("~" + pid, dataArray);
            residentList.push(new TSOS.PCB(pid, 0x000, 0x100, "Resident", 0x000, "Disk"));
            waitAndTurnaroundTimeTable[pid.toString()] = [0, 0];
        }
        /**
         * Does Swapping (Most Recently Used)
         * @param inPid the pid of the incoming process
         * @param outPid the pid of the outgoing process
         */
        swap(inPid, outPid) {
            // Finds the location of the process to be swapped
            let swapMemoryLoc = parseInt(Object.keys(this.memoryMap).find(key => this.memoryMap[key] === outPid));
            // Puts the process to be swapped out into memory
            let outDataArray = new Array(256);
            for (let address = 0x100 * swapMemoryLoc; address < (0x100 * swapMemoryLoc) + 0x100; address++) {
                outDataArray[address - (0x100 * swapMemoryLoc)] =
                    _MemoryAccessor.getDataImmediate(address).toString(16).padStart(2, "0");
            }
            this.storeInDisc(outDataArray, outPid);
            // Brings the process to be swapped in into memory
            let inDataArray = _krnDiskDriver.readDirect("~" + inPid);
            _krnDiskDriver.delete("~" + inPid);
            console.log(JSON.stringify(outDataArray));
            console.log(JSON.stringify(inDataArray));
            // Rewrites the memory block with all zeros
            for (let arrayElemNum = 0; arrayElemNum < 0x100; arrayElemNum++) {
                _MemoryAccessor.writeImmediate(swapMemoryLoc * 0x100 + arrayElemNum, 0x00);
            }
            // Writes the input data in memory
            for (let arrayElemNum = 0; arrayElemNum < inDataArray.length; arrayElemNum++) {
                _MemoryAccessor.writeImmediate(swapMemoryLoc * 0x100 + arrayElemNum, parseInt(inDataArray[arrayElemNum], 16));
            }
            this.memoryMap[swapMemoryLoc] = inPid;
            readyQueue[0].baseRegister = swapMemoryLoc * 0x100;
            readyQueue[0].limitRegister = (swapMemoryLoc * 0x100) + 0x100;
            readyQueue[0].pc = (readyQueue[0].pc % 0x100) + readyQueue[0].baseRegister;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map