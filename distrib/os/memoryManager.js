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
            let storeLoc = -2;
            for (let i = 0; i < 3; i++) {
                if (this.memoryMap[i] == 0) {
                    storeLoc = i;
                    break;
                }
            }
            // Checks if there is any location in memory that is available
            if (storeLoc < -1) {
                let currentAddress = this.memoryAccessor.getAddress();
                this.memoryAccessor.setAddress(storeLoc * 0x100);
                for (let arrayElemNum = 0; arrayElemNum < 0x100; arrayElemNum++) {
                    _MemoryAccessor.writeImmediate(arrayElemNum, 0x00);
                }
                for (let arrayElemNum = 0; arrayElemNum < loadDataArray.length; arrayElemNum++) {
                    _MemoryAccessor.writeImmediate(arrayElemNum, parseInt(loadDataArray[arrayElemNum], 16));
                    console.log("INPUT");
                }
                this.memoryAccessor.setAddress(currentAddress);
                // TODO: Implement an actual way to map PIDs to their location within memory
                this.memoryMap[storeLoc] = this.pid;
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
            this.executingPid = commandPid;
            _CPU.isExecuting = true;
            _CPU.PC = 0x00;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map