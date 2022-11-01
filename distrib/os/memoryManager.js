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
                    console.log("INPUT");
                }
                // TODO: Implement an actual way to map PIDs to their location within memory
                this.memoryMap[storeLoc] = this.pid;
                residentList.push(new TSOS.PCB(this.pid, storeLoc * 0x100, (storeLoc * 0x100) + 0x100, "Resident", storeLoc * 0x100));
                return "Process " + (this.pid++).toString() + " created.";
            }
            else {
                return "All memory locations are full. Clear memory before loading another program.";
            }
        }
        /**
         * Begins executing a program in the CPU
         * @param commandPid the pid of the command to be executed
         */
        run(commandPid) {
            /**
             // Sets the pID for the process that is being executed
             this.executingPid = commandPid;

             // Gets the memory location for the process to be executed
             let executeMemoryLocation =
             Object.keys(this.memoryMap).find(key => this.memoryMap[key] == this.executingPid);

             _CPU.isExecuting = true;
             _CPU.PC = parseInt(executeMemoryLocation) * 0x100;
             */
            for (let processNum = 0; processNum < residentList.length; processNum++) {
                if (residentList[processNum].pid == commandPid) {
                    readyQueue.push(residentList[processNum]);
                    residentList.splice(processNum, 1);
                }
            }
            if (_CPU.isExecuting == false) {
                _CPUScheduler.start();
                _CPU.isExecuting = true;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map