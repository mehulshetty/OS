/* ------------
   memoryManager.ts

   This virtual memory manager "allocates" and "deallocates" storage in memory..
   ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor(memoryAccessor = null, pid = 0, memoryMap = new Object(), executingPid = 0x0) {
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
            let currentAddress = this.memoryAccessor.getAddress();
            this.memoryAccessor.setAddress(0 * 0x100);
            for (let arrayElemNum = 0; arrayElemNum < 0x100; arrayElemNum++) {
                _MemoryAccessor.writeImmediate(arrayElemNum, 0x00);
            }
            for (let arrayElemNum = 0; arrayElemNum < loadDataArray.length; arrayElemNum++) {
                _MemoryAccessor.writeImmediate(arrayElemNum, parseInt(loadDataArray[arrayElemNum], 16));
                console.log("INPUT");
            }
            this.memoryAccessor.setAddress(currentAddress);
            // TODO: Implement an actual way to map PIDs to their location within memory
            this.memoryMap[0] = this.pid;
            return this.pid++;
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